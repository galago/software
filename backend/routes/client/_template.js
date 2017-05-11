const ClientStatuses = require('../../shared/clientStatuses');

module.exports = function(app) {
  app.get('/clients/', function(req, res) {
    cards.forEach(function(item) {
      let title = item.title.toLowerCase();
      var trimTitle = title.replace(/\s+/g, '');
    });
    res.send(200);
  });


};
