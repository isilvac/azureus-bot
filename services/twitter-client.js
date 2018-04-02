var Twitter = require('twitter-node-client').Twitter;

var twitter = new Twitter('data/twitter_config.json');

var obj = [];

twitter.getUserTimeline({ screen_name: 'CruzadosSADP', count: '5' }, 
    error = function (err, response, body) {
        console.log('ERROR [%s]', body);
    },
    success = function(data) {
        var feed = JSON.parse(data);
        console.log("DATA: " + data);
        feed.forEach(tweet => {
            if(tweet.retweeted) {
                if (tweet.retweeted_status.entities.media) {
                    var media = tweet.retweeted_status.entities.media;
                    console.log(tweet.text + "\n" + media[0].media_url_https + "\n" + tweet.created_at);
                    console.log("Fav:" + tweet.favorite_count + " / RT:" + tweet.retweet_count + "\n");
                    obj.push(tweet.text);
                }
            } else {
                console.log(tweet.text + "\n" + tweet.created_at);
                console.log("Fav:" + tweet.favorite_count + " / RT:" + tweet.retweet_count + "\n");
            }
        });
        console.log(obj[0]);
    }
);
