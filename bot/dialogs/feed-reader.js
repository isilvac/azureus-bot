var builder = require('botbuilder');
var Parser = require('rss-parser');
//var imageRetriever = require('../../services/image-retriever');

var lib = new builder.Library('rss-reader');

var clubData = [
    {
        nombre: 'Colo Colo',
        url: 'http://www.colocolo.cl/feed',
        img: 'http://cdn.colocolo.cl/wp-content/themes/colo-colo/assets/equipos/relato/colo-colo.png'
    },
    {
        nombre: 'Universidad de Chile',
        url: 'https://www.udechile.cl/feed',
        img: 'http://uvfaesports.com/assets/images/escudos/escudo_time_850_1508439722.png'
    },
    {
        nombre: 'Universidad Catolica',
        url: 'https://www.cruzados.cl/feed',
        img: 'https://botw-pd.s3.amazonaws.com/styles/logo-thumbnail/s3/072011/cduc_2.png?itok=QSKh7L5t'
    },
];

lib.dialog('getFeeds', [
    function (session, args) {
        var text = 'Dime el sitio que quieres ver';
        var clubs = ['Colo Colo', 'Universidad de Chile', 'Universidad Catolica'];
        if (args && args.reprompt) {
            text = 'Elige dentro de las opciones';
        }
        builder.Prompts.choice(session, text, clubs, { listStyle: builder.ListStyle.button });
    },
    function (session, results, next) {
        var club = clubData.filter(function (obj) {
            return obj.nombre == results.response.entity;
        });
        var url = club[0].url;
        var img = club[0].img;
        getFeeds(url, img, session);
    }
]).triggerAction({
    matches: /^rss$|^feed$/i
});

async function getFeeds(url, img, session) {
    let parser = new Parser();
    var elements = [];
    var maxFeed = 5;
    var items = 0;
    var feed;

    try {
        feed = await parser.parseURL(url);
    } catch (err) {
        console.error("Error en parseo de URL: " + url + "\n\n" + err);
    }
    console.log(feed.title);
    var title = subtitle = '';
    var image = img;

    feed.items.forEach(item => {
        if (items == maxFeed) {
            return;
        }
        if (item.title.length > 50) {
            title = item.title.substring(0, 47) + '...'
        } else {
            title = item.title;
        }
        if (item.contentSnippet) {
            if (item.contentSnippet.length > 80) {
                subtitle = item.contentSnippet.substring(0, 77) + '...'
            } else {
                subtitle = item.contentSnippet;
            }
        }
        elements.push(new builder.HeroCard(session)
            .title(title)
            .subtitle(subtitle)
            .images([new builder.CardImage().url(image)])
            .buttons([
                builder.CardAction.openUrl(session, item.link, 'Ir a Noticia')
            ])
        );
    })
    var reply = new builder.Message(session)
        .attachmentLayout(builder.AttachmentLayout.carousel)
        .attachments(elements);
    session.send(reply);
    ++items;
}

// Export createLibrary() function
module.exports.createLibrary = function () {
    return lib.clone();
};