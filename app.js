
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();
var fs = require('fs');
var exec = require('child_process').exec;


// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

var io = require('socket.io').listen(app.listen(app.get('port')));
io.set('log level', 1);

io.sockets.on('connection', function (socket) {
	 socket.on('from_client', function (data) {
    	
    	base64Data = data.replace(/^data:image\/png;base64,/,""),
		binaryData = new Buffer(base64Data, 'base64').toString('binary');	

        fs.writeFile("./public/images/test.png", binaryData, "binary", function(err) { // remove "data:image/png;base64,", that's why we remove this
            if(err) {
                console.log(err);
            } else {
                console.log("The file was saved!");
                var cmd = 'tesseract public/images/test.png public/images/ocr';
				var child = exec(
				  cmd,
				  function (error, stdout, stderr) {
				    console.log('stdout: ' + stdout);
				    console.log('stderr: ' + stderr);
				    fs.readFile('public/images/ocr.txt', 'utf8', function (err,data) {
				  	if (err) {
				    	return console.log(err);
				  	}
				  		console.log('result:');
				  		console.log(data);
				  		socket.emit('from_server', data);
					});
				    if (error !== null) {
				      console.log('exec error: ' + error);
				    }
				  }
				);
            }
        }); 
	});
});