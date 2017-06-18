const express = require('express');
const app = express();
var bodyParser = require('body-parser');
var fs = require('fs');
app.set('view engine', 'pug')
app.set('views', __dirname + '/views')
app.use(bodyParser.json());

var cvData = {};

app.get('/', function (req, res) {
  res.sendFile(__dirname + "/form.html");
});

// For static resources
app.use("/css", express.static(__dirname + '/css'));
app.use("/js", express.static(__dirname + '/js'));


// This generates the pdf by calling the phantomjs script and then moves & renames it.
app.post('/getCV', function (req, res) {
  cvData = req.body.cvData;
  var path = require('path')
  var childProcess = require('child_process')
  var phantomjs = require('phantomjs-prebuilt')
  var binPath = phantomjs.path

  var childArgs = [
    path.join(__dirname, '/phantom.pdf.js')
  ]

  childProcess.execFile(binPath, childArgs, function(err, stdout, stderr) {
    var rand = Math.floor(Math.random()*10000) +"-"+ Math.floor(Math.random()*10000);
    fs.rename(path.join(__dirname+ '/cv.pdf'), path.join(__dirname+ '/generated-cvs/cv'+rand+'.pdf'), function(err){
      if (err) {
        // res.json(err);
        console.log(err);
      }
      res.send(rand);
    });
  })
})

app.get('/pdfDownload/:fileId', function (req, res) {
  var path = require('path')
  res.download(path.join(__dirname+ '/generated-cvs/cv'+req.params.fileId+'.pdf'));

})

app.get('/cvPage', function (req, res) {
  res.render('cv-template', { data: cvData })
})

app.listen(3333, function () {
  console.log('App listening on port 3333!')
})