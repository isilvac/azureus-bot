var builder = require('botbuilder');

var lib = new builder.Library('social-networks');

lib.dialog('/', [
    function (session, args) {
        session.send('welcome_sns');
        var cards = sns();

        session.sendTyping();
        // create reply with Carousel AttachmentLayout
        var reply = new builder.Message(session)
            .attachmentLayout(builder.AttachmentLayout.carousel)
            .attachments(cards);

        session.send(reply);
        session.sendTyping();
        setTimeout(function () {
            builder.Prompts.text(session, 'back2menu');
        }, 1000);
    },
    function (session, results) {
        if (results.response === 'menu') {
            session.endDialog();
        }
    }
 ]).triggerAction({
     matches: /^sociales$|^facebook$|^instagram$|^twitter$/i
 })

function sns(session) {
    return [
        new builder.HeroCard(session)
            .title('Facebook')
            .images([
                builder.CardImage.create(session, 'http://files.softicons.com/download/social-media-icons/free-social-media-icons-by-uiconstock/png/96x96/Facebook-Icon.png')
            ])
            .buttons([
                builder.CardAction.openUrl(session, 'https://www.facebook.com/scottchilecom/', 'Ir a')
            ]),
        new builder.HeroCard(session)
            .title('Instagram')
            .images([
                builder.CardImage.create(session, 'https://image.flaticon.com/icons/png/128/174/174855.png')
            ])
            .buttons([
                builder.CardAction.openUrl(session, 'https://www.instagram.com/scottchileteam/', 'Ir a')
            ]),
        new builder.HeroCard(session)
            .title('Twitter')
            .images([
                builder.CardImage.create(session, 'https://images.sftcdn.net/images/t_optimized,f_auto/p/bf867ef4-9b36-11e6-ac1b-00163ed833e7/4027642762/twitter-for-nokia-logo.png')
            ])
            .buttons([
                builder.CardAction.openUrl(session, 'https://twitter.com/scottsports?lang=es', 'Ir a')
            ])
    ];
}
// Export createLibrary() function
module.exports.createLibrary = function () {
    return lib.clone();
};