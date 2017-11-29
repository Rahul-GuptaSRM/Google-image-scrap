var express = require("express");
var app = express();
//var favicon = require("serve-favicon");
var path = require("path");
var port = process.env.PORT || 8080;
var morgan = require("morgan");
var mongoose = require("mongoose");
var bodyParser = require('body-parser');
var router = express.Router();
var ejs = require("ejs");
var passport  = require("passport");
var flash = require("connect-flash");

var cookieParser = require("cookie-parser");
var bcrypt = require('bcrypt-nodejs');
var session = require("express-session");


app.use(morgan('dev'));
var dbURI = 'mongodb://localhost:27017/rahul';
mongoose.Promise = global.Promise;
mongoose.connect(dbURI,function(err)
	{
		if(err)
          {
          	console.log("error");
          }
          else{
          	console.log("successfully connected");
          }
	});


 

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

app.use(cookieParser());
app.set('view engine','ejs');
app.use(session({secret: 'mySecretKey',saveUninitialized: true,resave:true}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use('/container', express.static(__dirname + '/container'));
require('./config/passport')(passport);//for the local authentication
 require('./app/authentication/routes/route.js')(app,passport);// all the routing included here
app.use(express.static('./public'));
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

app.get('/',function(req,res)
{
	res.sendFile(path.join(__dirname +'/public/view/Frontpage.html'));
});

app.listen(port);
console.log("server is running on port "+port);

exports = module.exports = app;