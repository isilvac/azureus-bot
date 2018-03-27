var builder = require('botbuilder');
var Parser = require('rss-parser');
//var imageRetriever = require('../../services/image-retriever');

var lib = new builder.Library('rss-reader');

lib.dialog('getFeeds', [
    function (session, args) {
        if (args && args.reprompt) {
            builder.Prompts.text(session, 'Favor usar este formato: https:\/\/www.sitio.com');
        } else {
            builder.Prompts.text(session, 'Dime el sitio que quieres ver');
        }
    },
    function (session, results, next) {
        var urlOK = results.response.match(/(http(s)?:\/\/)?([A-Za-z0-9])*(\.)?([A-Za-z0-9\-\_])*\.[com|org|net|cl]*/);
        var url = urlOK ? results.response : null;
        if (url) {
            var rssUrl = url + "/feed";
            session.send('Se validara la URL ' + rssUrl);
            next({ response: rssUrl});
        } else {
            session.replaceDialog('getFeeds', {reprompt: true});
        }
    },
    function (session, results, next) {
        var urlRSS = results.response;
        getFeeds(urlRSS,session);
    }
]).triggerAction({
    matches: /^rss$|^feed$/i
});

async function getFeeds(url, session) {
    let parser = new Parser();
    var elements = [];
    var maxFeed = 5;
    var items = 0;
    try {
        let feed = await parser.parseURL(url);
        console.log(feed.title);
        var title = subtitle = '';
        var image = '';
        if (feed.title == 'Colo-Colo') {
            var image = 'http://cdn.colocolo.cl/wp-content/themes/colo-colo/assets/equipos/relato/colo-colo.png';
        }
        if (feed.title == 'Club Universidad de Chile') {
            var image = 'http://uvfaesports.com/assets/images/escudos/escudo_time_850_1508439722.png';
        }

        feed.items.forEach(item => {
            if (items == maxFeed) {
                return;
            }
            if (item.title.length > 40) {
                title = item.title.substring(0, 37) + '...'
            } else {
                title = item.title;
            }
            if (item.contentSnippet.length > 60) {
                subtitle = item.contentSnippet.substring(0, 57) + '...'
            } else {
                subtitle = item.contentSnippet;
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
    } catch (err) {
        console.error("Error en parseo de URL: " + url + "\n\n" + err);
    }
}

// Export createLibrary() function
module.exports.createLibrary = function () {
    return lib.clone();
};