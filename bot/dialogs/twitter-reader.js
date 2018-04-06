var builder = require('botbuilder');
var Twitter = require('twitter-node-client').Twitter;

var lib = new builder.Library('twitter-reader');
var twitter = new Twitter('data/twitter_config.json');

var clubData = [
    {
        nombre: 'Colo Colo',
        tAccount: 'colocolo'
    },
    {
        nombre: 'Universidad de Chile',
        tAccount: 'udechile'
    },
    {
        nombre: 'Universidad Catolica',
        tAccount: 'CruzadosSADP'
    }
];

lib.dialog('twitter',[
    function (session, args) {
        var text = 'Dime la cuenta Twitter que quieres ver';
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
        getTweets(club[0].tAccount, 5, session);
    }
]).triggerAction({
    matches: /^tweet$/i
});

function getTweets(account, q, session) {
    var elements = [];
    var url = 'https://www.twitter.com/' + account + '/status/';

    twitter.getUserTimeline({ screen_name: account, count: q },
        error = function (err, response, body) {
            console.log('ERROR [%s]', body);
        },
        success = function (data) {
            var feed = JSON.parse(data);
            feed.forEach(tweet => {
                var card = new builder.HeroCard(session)
                    .title(new Date(tweet.created_at).toLocaleString())
                    .subtitle(tweet.text)
                    .buttons([
                        builder.CardAction.openUrl(session, url + tweet.id_str, 'Ver Tweet')
                    ]);
                console.log(url + tweet.id_str);
                if (tweet.retweeted) {
                    if (tweet.retweeted_status.entities.media) {
                        var media = tweet.retweeted_status.entities.media;
                        card.images([new builder.CardImage().url(media[0].media_url_https)]);
                    }
                }

                console.log("Fav:" + tweet.favorite_count + " / RT:" + tweet.retweet_count + "\n");
                elements.push(card);
            });
            var reply = new builder.Message(session)
                .attachmentLayout(builder.AttachmentLayout.carousel)
                .attachments(elements);
            session.send(reply);
        }
    );
}

// Export createLibrary() function
module.exports.createLibrary = function () {
    return lib.clone();
};