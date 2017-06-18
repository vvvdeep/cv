 var loadInProgress = false,
    interval = 0,
    page = require('webpage').create(),
    url = 'http://localhost:3333/cvPage';
 
page.viewportSize = {
  width: 1780,
  height: 900
};

page.paperSize = {
    width: '1780px',
    height: '900px',
    orientation: 'portrait'
};
 
// page.settings.userAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_2) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.6 Safari/537.11";
page.open(url, function(status) {
  setTimeout(function() {
    page.render('cv.pdf');
    phantom.exit();
  }, 2000);
});