var express = require('express'),
  fs = require('fs'),
  request = require('request'),
  cheerio = require('cheerio'),
  app = express();

app.get('/scrape', function(req,res) {
  // The URL we will scrape from - Anchorman 2.

  url = 'http://www.imdb.com/title/tt1229340';

  // the structure of our request call
  // the first param is our url
  // the call function takes 3 params, an error, response status code and the html

  request(url, function(error, resp, html) {

    if (!error) {

      // we'll utilize the cheerio library on the returned html which will give us jQuery functionality
      var $ = cheerio.load(html);

      // finally, we'll define the variables we're going to capture
      var title, release, rating;
      var json = {title: '', release: '', rating: ''};

      $('.header').filter(function () {

        // store the data we filter into a variable so we can easily see what's going on.

        var data = $(this);

        // In examining the DOM we notice that the title rests within the first child element of the header tag.
        // Utilizing jQuery we can easily navigate and get the text by writing the following code:
        title = data.children().first().text();
        release = data.children().last().children().text();

        // Once we have our title, we'll store it to the our json object.
        json.title = title;
        json.release = release;
      });

      // Since the rating is in a different section of the DOM, we'll have to write a new jQuery filter to extract this information.

      $('.star-box-giga-star').filter(function () {
        var data = $(this);

        rating = data.text();

        json.rating = rating;
      })
    }

    // To write to the system we will use the built in 'fs' library.
    // In this example we will pass 3 parameters to the writeFile function
    // Parameter 1 :  output.json - this is what the created filename will be called
    // Parameter 2 :  JSON.stringify(json, null, 4) - the data to write, here we do an extra step by calling JSON.stringify to make our JSON easier to read
    // Parameter 3 :  callback function - a callback function to let us know the status of our function
    fs.writeFile('output.json', JSON.stringify(json, null, 4), function (err) {
      console.log('File successfully written! - Check your project directory for the output.json file');
    })

    // Finally, we'll just send out a message to the browser reminding you that this app does not have a UI.
    res.send('Check your console!')
  });
});

app.listen('8081');

console.log('Magic happens on port 8081');

exports = module.exports = app;
