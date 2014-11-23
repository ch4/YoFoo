var express = require('express');
var _ = require('underscore');
var querystring = require('querystring');

/**
 * Create an express application instance
 */
var app = express();

/**
 * Create a Parse ACL which prohibits public access.  This will be used
 *   in several places throughout the application, to explicitly protect
 *   Parse User, TokenRequest, and TokenStorage objects.
 */
var restrictedAcl = new Parse.ACL();
restrictedAcl.setPublicReadAccess(false);
restrictedAcl.setPublicWriteAccess(false);

/**
 * Global app configuration section
 */
//app.set('views', 'cloud/views');  // Specify the folder to find templates
app.set('view engine', 'ejs');    // Set the template engine
app.use(express.bodyParser());    // Middleware for reading request body


app.get('/incomingYo', function(req, res) {
  var yoName = req.query.username; //ch4ch4
  var yoLink = req.query.link; //http://harveychan.net
  //var tempLocation = req.params.location; //42.360091;-71.09415999999999
  if(req.query.location){
    var yoLatitude = (req.query.location.split(';'))[0];
    var yoLongitude = (req.query.location.split(';'))[1];
  }


  var responseStr = 'username='+yoName+' location='+yoLatitude+','+yoLongitude+' link='+yoLink;
  console.log(responseStr);
  res.end(responseStr);
});

app.get('/outgoingYo', function(req, res) {
  var uberLink = 'uber://?client_id=jGHmeGpUbf7-dLOosaAEhM1uWek8xsRd&action=setPickup&pickup[latitude]=37.775818&pickup[longitude]=-122.418028&pickup[nickname]=UberHQ&pickup[formatted_address]=1455%20Market%20St%2C%20San%20Francisco%2C%20CA%2094103&dropoff[latitude]=37.802374&dropoff[longitude]=-122.405818&dropoff[nickname]=Coit%20Tower&dropoff[formatted_address]=1%20Telegraph%20Hill%20Blvd%2C%20San%20Francisco%2C%20CA%2094133&product_id=a1111c8c-c720-46c3-8534-2fcdd730040d';
  SendYo('ch4ch4', uberLink, function(){
    res.end();
  })
});

function SendYo(yoUsername, yoLink, callback){
  Parse.Config.get().then(function(config) {
    var YO_TOKEN = config.get("YO_TOKEN");
    Parse.Cloud.httpRequest({
      url: 'http://api.justyo.co/yo/',
      method: "POST",
      body: {
        link:(yoLink ? yoLink : ''),
        api_token: YO_TOKEN,
        username: yoUsername
      },
      success: function (httpResponse) {
        callback();
      },
      error: function (httpResponse) {

        callback();
      }
    });
  }, function(error) {
    // Something went wrong (e.g. request timed out)
    callback();
  });
}

// Attach the Express app to your Cloud Code
app.listen();