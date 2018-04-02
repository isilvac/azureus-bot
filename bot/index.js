var builder = require('botbuilder');
var siteUrl = require('./site-url');
var inMemoryStorage = new builder.MemoryBotStorage();

var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

// Welcome Dialog
var MainOptions = {
    Catalog: 'main_options_catalog',
    Stores: 'main_options_stores',
    SocialNetworks: 'main_options_sns'
};

var bot = new builder.UniversalBot(connector,
    (session) => {
        session.send('salute');
        session.sendTyping();
        setTimeout(function () {
            session.beginDialog('menu');
        }, 1000);
    }
).set('storage', inMemoryStorage);

bot.dialog('greetings', [
    function (session, args, next) {
        session.dialogData.profile = args || {};
        if (!session.dialogData.profile.name) {
            session.beginDialog('askName');
        } else {
            next();
        }
    },
    function (session, results, next) {
        if (results.response) {
            var name = session.dialogData.profile.name = results.response;
            session.send('salute_with_name', name);
            session.endDialogWithResult({ response: session.dialogData.profile })
        }
    }
]);

bot.dialog('askName', [
    function (session) {
        session.send(session.gettext('salute'));
        setTimeout(function () {
        builder.Prompts.text(session, session.gettext('name_request'));
        }, 1000);
    },
    function (session, results) {
        session.endDialogWithResult(results);
    }
]);

bot.dialog('menu', [
    function (session) {
        if (localizedRegex(session, [MainOptions.Catalog]).test(session.message.text)) {
            // Order Flowers
            return session.beginDialog('catalog:/');
        }

        if (localizedRegex(session, [MainOptions.Stores]).test(session.message.text)) {
            // Order Flowers
            return session.beginDialog('stores:/');
        }

        if (localizedRegex(session, [MainOptions.SocialNetworks]).test(session.message.text)) {
            // Order Flowers
            return session.beginDialog('social-networks:/');
        }

        var welcomeCard = new builder.HeroCard(session)
            .title('welcome_title')
            .subtitle('welcome_subtitle')
            .images([
                new builder.CardImage(session)
                    .url('https://dfp2hfrf3mn0u.cloudfront.net/233/233512_original_1.jpg')
                    .alt('bike_store')
            ])
            .buttons([
                builder.CardAction.imBack(session, session.gettext(MainOptions.Catalog), MainOptions.Catalog),
                builder.CardAction.imBack(session, session.gettext(MainOptions.Stores), MainOptions.Stores),
                builder.CardAction.imBack(session, session.gettext(MainOptions.SocialNetworks), MainOptions.SocialNetworks)
            ]);
        session.send(new builder.Message(session)
            .addAttachment(welcomeCard));
    }
]).triggerAction({
    matches: /^menu$/i
});

bot.dialog('bye', [
    (session) => { session.send(session.gettext('bye')).endConversation(); }
]).triggerAction({
    matches: /^adios$|^chao$|^bye$/i
});

// Enable Conversation Data persistence
bot.set('persistConversationData', true);

// Set default locale
bot.set('localizerSettings', {
    botLocalePath: './bot/locale',
    defaultLocale: 'es'
});

// Sub-Dialogs
bot.library(require('./dialogs/catalog').createLibrary());
bot.library(require('./dialogs/product-selection').createLibrary());
bot.library(require('./dialogs/stores').createLibrary());
bot.library(require('./dialogs/social-networks').createLibrary());
bot.library(require('./dialogs/settings').createLibrary());
bot.library(require('./dialogs/help').createLibrary());
bot.library(require('./dialogs/feed-reader').createLibrary());
bot.library(require('./dialogs/twitter-reader').createLibrary());

// Validators
bot.library(require('./validators').createLibrary());

// Trigger secondary dialogs when 'settings' or 'support' is called
bot.use({
    botbuilder: function (session, next) {
        var text = session.message.text;

        var settingsRegex = localizedRegex(session, ['main_options_settings']);
        var supportRegex = localizedRegex(session, ['main_options_talk_to_support', 'help']);

        if (settingsRegex.test(text)) {
            // interrupt and trigger 'settings' dialog 
            return session.beginDialog('settings:/');
        } else if (supportRegex.test(text)) {
            // interrupt and trigger 'help' dialog
            return session.beginDialog('help:/');
        }

        // continue normal flow
        next();
    }
});

// Send welcome when conversation with bot is started, by initiating the root dialog
bot.on('conversationUpdate', function (message) {
    if (message.membersAdded) {
        message.membersAdded.forEach(function (identity) {
            if (identity.id === message.address.bot.id) {
                bot.beginDialog(message.address, '/');
            }
        });
    }
});

// Cache of localized regex to match selection from main options
var LocalizedRegexCache = {};
function localizedRegex(session, localeKeys) {
    var locale = session.preferredLocale();
    var cacheKey = locale + ":" + localeKeys.join('|');
    if (LocalizedRegexCache.hasOwnProperty(cacheKey)) {
        return LocalizedRegexCache[cacheKey];
    }

    var localizedStrings = localeKeys.map(function (key) { return session.localizer.gettext(locale, key); });
    var regex = new RegExp('^(' + localizedStrings.join('|') + ')', 'i');
    LocalizedRegexCache[cacheKey] = regex;
    return regex;
}

// Connector listener wrapper to capture site url
var connectorListener = connector.listen();
function listen() {
    return function (req, res) {
        // Capture the url for the hosted application
        // We'll later need this url to create the checkout link 
        var url = req.protocol + '://' + req.get('host');
        siteUrl.save(url);
        connectorListener(req, res);
    };
}

// Other wrapper functions
function beginDialog(address, dialogId, dialogArgs) {
    bot.beginDialog(address, dialogId, dialogArgs);
}

function sendMessage(message) {
    bot.send(message);
}

module.exports = {
    listen: listen,
    beginDialog: beginDialog,
    sendMessage: sendMessage
};