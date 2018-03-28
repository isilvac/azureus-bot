var htmlparser = require('htmlparser2');
var https = require('https');
var http = require('http');
var url  = require('url');

//getImage('https://www.udechile.cl/primer-equipo/guillermo-hoyos-palpita-el-amistoso-con-river-plate-es-un-rival-de-nivel-y-jerarquia/');
//getImage('http://www.colocolo.cl/empate-ante-ohiggins-en-amistoso-en-la-ruca/');

async function getImage(rssUrl) {
    var parsedUrl;
    try {
        parsedUrl = await url.parse(rssUrl);
    } catch (err) {
        console.error('Error al recuperar imagen de link: ' + rssUrl + "\n\n" + err);
    }
    if (parsedUrl.host == null) {
        console.log('URL parsed Error.(' + rssUrl + ')');
        return;
    }
    const options = {
        protocol: parsedUrl.protocol,
        hostname: parsedUrl.hostname,
        port: parsedUrl.port,
        path: parsedUrl.path,
        method: 'GET'
    };

    if (parsedUrl.protocol == 'https:') {
        var request = https.request(options);
    }
    if (parsedUrl.protocol == 'http:') {
        var request = http.request(options);
    }
    request.end();

    var html = [];
    request.on('response', function (res) {

        res.on('data', function (chunk) {
            html.push(chunk);
        });

        res.on('end', function () {
            var myhtmlparser = new MyHtmlParser(parsedUrl);
            myhtmlparser.parse(html.join(''));
            myhtmlparser.getImageElements({ tagName: 'img' });

            return myhtmlparser.url;
        });
    });
};

/* -------------------------------------------------------- */
// Creates Parser object MyHtmlParser
var MyHtmlParser = function(parsedUrl){
    this.parsedUrl = parsedUrl;
    this.parsedResult = null;
    this.url;
    if (this === global){
		throw new Error("Error this is global.");
    }
    this.handler = new htmlparser.DefaultHandler(function (error, dom) {
        if(error){
            console.error("Error : " + error);
        }
    });
    return this;
};

// Uses DOM parser for the HTML
MyHtmlParser.prototype.parse = function(html){
    var parser = new htmlparser.Parser(this.handler);
    parser.parseComplete(html);
    this.parsedResult = this.handler.dom;
};

MyHtmlParser.prototype.getImageElements = function(option){
    option = option == null ? { tagName : 'img' } : option;

	var tags = htmlparser.DomUtils.getElements({ tag_name: function(val){
        return val.toLowerCase() === option.tagName ? true : false;
    }}, this.parsedResult);

    this.url = tags[1].attribs && (tags[1].attribs.href || tags[1].attribs.src);
};

// export
module.exports = {getImage};