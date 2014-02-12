
var fs = require('fs');
var exec = require('child_process').exec;

var cmd = 'tesseract public/images/test2.png public/images/ocr';
var child = exec(
  cmd,
  function (error, stdout, stderr) {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    fs.readFile('public/images/ocr.txt', 'utf8', function (err,data) {
  	if (err) {
    	return console.log(err);
  	}
  		console.log(data);
	});
    if (error !== null) {
      console.log('exec error: ' + error);
    }
  }
);



