var _ = require('lodash');
var builder = require('botbuilder');
var Promise = require('bluebird');

var allCategories =
    [{
        name: 'MONTANA',
        subtitle: 'Escapa a la montana!',
        imageUrl: 'http://www.scottchile.com/imagenes/bannermontana.jpg'
    },
    {
        name: 'CARRETERA',
        subtitle: 'Vuela sobre el asfalto...',
        imageUrl: 'http://www.scottchile.com/imagenes/bannercarretera.jpg'
    },
    {
        name: 'URBANAS',
        subtitle: 'Muevete en la ciudad',
        imageUrl: 'http://www.scottchile.com/imagenes/bannercityurban.jpg'
    },
    {
        name: 'MUJER',
        subtitle: 'Para ellas',
        imageUrl: 'http://www.scottchile.com/imagenes/bannermujer.jpg'
    },
    {
        name: 'JUNIOR',
        subtitle: 'Para los mas pequenos de la casa',
        imageUrl: 'http://www.scottchile.com/imagenes/bannerjunior.jpg'
    }];

var mountainBikes =
    [{
        name: 'SCALE RC 900 SL',
        subtitle: 'Cross Country',
        imageUrl: 'https://dfp2hfrf3mn0u.cloudfront.net/265/265201_210191_png_overview_4.png',
        buttonUrl: 'https://www.scott-sports.com/es/es/product/sco-bike-scale-rc-900-sl-m-null?article=265201007'
    },
    {
        name: 'SCALE RC 900 WORLD CUP',
        subtitle: 'Cross Country',
        imageUrl: 'https://dfp2hfrf3mn0u.cloudfront.net/265/265202_210184_png_overview_8.png',
        buttonUrl: 'https://www.scott-sports.com/es/es/product/sco-bike-scale-rc-900-world-cup-xl-null?article=265202009'
    },
    {
        name: 'SCALE 915',
        subtitle: 'Cross Country',
        imageUrl: 'https://dfp2hfrf3mn0u.cloudfront.net/265/265205_209107_png_overview_4.png',
        buttonUrl: 'https://www.scott-sports.com/es/es/product/sco-bike-scale-915-s-null?article=265205006'
    },
    {
        name: 'SCALE 920',
        subtitle: 'Cross Country',
        imageUrl: 'https://dfp2hfrf3mn0u.cloudfront.net/265/265210_217313_png_overview_8.png',
        buttonUrl: 'https://www.scott-sports.com/es/es/product/sco-bike-scale-920-eu-s-null?article=265210006'
    }];

var highwayBikes =
    [{
        name: 'PLASMA PREMIUM',
        subtitle: 'Aero',
        imageUrl: 'https://dfp2hfrf3mn0u.cloudfront.net/265/265326_210247_png_overview_4.png',
        buttonUrl: 'https://www.scott-sports.com/es/es/product/sco-bike-plasma-premium-l57-null?article=265326027'
    },
    {
        name: 'PLASMA RC',
        subtitle: 'Aero',
        imageUrl: 'https://dfp2hfrf3mn0u.cloudfront.net/265/265327_210242_png_overview_4.png',
        buttonUrl: 'https://www.scott-sports.com/es/es/product/sco-bike-plasma-rc-m54-null?article=265327022'
    },
    {
        name: 'FOIL PREMIUM DISC',
        subtitle: 'Aero',
        imageUrl: 'https://dfp2hfrf3mn0u.cloudfront.net/265/265330_210246_png_overview_4.png',
        buttonUrl: 'https://www.scott-sports.com/es/es/product/sco-bike-foil-premium-disc-l56-null?article=265330023'
    },
    {
        name: 'FOIL RC',
        subtitle: 'Aero',
        imageUrl: 'https://dfp2hfrf3mn0u.cloudfront.net/265/265331_210245_png_overview_4.png',
        buttonUrl: 'https://www.scott-sports.com/es/es/product/sco-bike-foil-rc-s52-null?article=265331021'
    }];

var urbanBikes =
    [{
        name: 'SILENCE EVO',
        subtitle: 'City & Urban',
        imageUrl: 'https://dfp2hfrf3mn0u.cloudfront.net/265/265451_208819_png_overview_4.png',
        buttonUrl: 'https://www.scott-sports.com/es/es/product/sco-bike-silence-evo-l-null?article=265451008'
    },
    {
        name: 'SILENCE 20 LADY',
        subtitle: 'City & Urban',
        imageUrl: 'https://dfp2hfrf3mn0u.cloudfront.net/265/265455_208823_png_overview_4.png',
        buttonUrl: 'https://www.scott-sports.com/es/es/product/sco-bike-silence-20-lady-l-null?article=265455008'
    },
    {
        name: 'SILENCE 30 MEN',
        subtitle: 'City & Urban',
        imageUrl: 'https://dfp2hfrf3mn0u.cloudfront.net/265/265456_208825_png_overview_4.png',
        buttonUrl: 'https://www.scott-sports.com/es/es/product/sco-bike-silence-30-men-l-null?article=265456008'
    }];

var defaultBikes =[{
    name: 'Sin bicicletas por el momento',
    subtitle: 'Somos un bot al que no le alcanza la plata para tanta bicicleta...',
}];

var productsService = {
    // Categories
    getCategories: function (pageNumber, pageSize) {
        return pageItems(pageNumber, pageSize, allCategories);
    },

    // Get Single Category
    getCategory: function (categoryName) {
        var category = _.find(allCategories, ['name', categoryName]);
        return Promise.resolve(category);
    },

    // Products
    getProducts: function (categoryName, pageNumber, pageSize) {
        var products;
        switch (categoryName) {
            case 'MONTANA':
                products = mountainBikes;
                break;
            case 'CARRETERA':
                products = highwayBikes;
                break;
            case 'URBANAS':
                products = urbanBikes;
                break;
            default:
                products = defaultBikes;
                break;
        }
        return pageItems(pageNumber, pageSize, products);
    },

    // Get Single Product
    getProduct: function (productName, session) {
        var category;
        switch (session.dialogData.category.name) {
            case 'MONTANA':
                category = mountainBikes;
                break;
            case 'CARRETERA':
                category = highwayBikes;
                break;
            case 'URBANAS':
                category = urbanBikes;
                break;
            default:
                category = defaultBikes;
                break;
        }
        var product = _.find(category, ['name', productName]);
        return Promise.resolve(product);
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
module.exports = productsService;