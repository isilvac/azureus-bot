var _ = require('lodash');
var builder = require('botbuilder');
var Promise = require('bluebird');

var simpleFeed =
    [{
        title: 'MONTANA',
        link: 'Escapa a la montana!',
        pubDate: 'http://www.scottchile.com/imagenes/bannermontana.jpg'
    }];

var detailFeed =
    [{
        title: 'MONTANA',
        link: 'Escapa a la montana!',
        description: '',
        pubDate: 'http://www.scottchile.com/imagenes/bannermontana.jpg'
    }];

var mediaFeed =
    [{
        title: 'MONTANA',
        link: 'Escapa a la montana!',
        media: '',
        description: '',
        pubDate: 'http://www.scottchile.com/imagenes/bannermontana.jpg'
    }];


var noFeed = [{
    title: 'Sin noticias disponibles',
    link: 'Somos un bot al que no le alcanza la plata para tanta bicicleta...'
}];

var feedService = {
    getFeeds: function (pageNumber, pageSize, feedType) {
        var feed;
        switch (feedType) {
            case simple:
                feed = simpleFeed; 
                break;
            case detail:
                feed = detailFeed;
                break;
            case media:
                feed = mediaFeed;
                break;
            default:
                feed = nofeed;
                break;
        }
        return pageItems(pageNumber, pageSize, feed);
    }
};

// helpers
function pageItems(pageNumber, pageSize, items) {
    var pageItems = _.take(_.drop(items, pageSize * (pageNumber - 1)), pageSize);
    var totalCount = items.length;
    return Promise.resolve({
        items: pageItems,
        totalCount: totalCount
    });
}

// export
module.exports = feedService;