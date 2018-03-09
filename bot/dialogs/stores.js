var builder = require('botbuilder');

var lib = new builder.Library('stores');

lib.dialog('/', [
    // List comunes
    function (session, args) {
        var communes = ['Santiago', 'Vitacura', 'Providencia'];
        builder.Prompts.choice(session, session.gettext('store_choice'), communes, { listStyle: builder.ListStyle.button });
    },
    // List stores per comune
    function (session, results) {
        var choice = results.response.entity;
        var cards = createCards(choice);

        var reply = new builder.Message(session)
            .attachmentLayout(builder.AttachmentLayout.carousel)
            .attachments(cards);

        session.send(reply);
        session.sendTyping();
        setTimeout(function () {
            builder.Prompts.text(session, session.gettext('more'));
        }, 1000);
    },
    function (session, results) {
        if (results.response.toLowerCase() === 'no') {
            builder.Prompts.text(session, session.gettext('back2menu'));
        } else {
            session.beginDialog('/');
        }
    }
]);

function createCards(comune, session) {
    switch (comune) {
        case 'Santiago':
            return [
                new builder.HeroCard(session)
                    .title('MAQBike')
                    .subtitle('San Diego 852, Santiago')
                    .buttons([
                        builder.CardAction.openUrl(session, 'https://www.google.cl/maps/place/San+Diego+852,+Santiago,+Región+Metropolitana', 'Direccion')
                    ])
            ];
            break;
        case 'Vitacura':
            return [
                new builder.HeroCard(session)
                    .title('Bike Store Concept Shop')
                    .subtitle('Padre Hurtado 1090, Vitacura')
                    .buttons([
                        builder.CardAction.openUrl(session, 'https://www.google.cl/maps/place/Av.+Padre+Hurtado+Norte+1090,+Vitacura,+Región+Metropolitana', 'Direccion')
                    ]),
                new builder.HeroCard(session)
                    .title('Bike Store Padre Hurtado')
                    .subtitle('Padre Hurtado Norte 1121, Vitacura')
                    .buttons([
                        builder.CardAction.openUrl(session, 'https://www.google.cl/maps/place/Av.+Padre+Hurtado+Norte+1121,+Vitacura,+Región+Metropolitana', 'Direccion')
                    ])
            ];
            break;
        case 'Providencia':
            return [
                new builder.HeroCard(session)
                    .title('BIKE Universe')
                    .subtitle('Tobalaba 4073, L2, Providencia')
                    .buttons([
                        builder.CardAction.openUrl(session, 'https://www.google.cl/maps/place/Tobalaba+4073,+Providencia,+Regi%C3%B3n+Metropolitana', 'Direccion')
                    ])
            ];
            break;
    }
}
// Export createLibrary() function
module.exports.createLibrary = function () {
    return lib.clone();
};