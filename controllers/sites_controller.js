var axios = require('axios');
var uuid = require('uuid');
var ObjectId = require('mongoose').Schema.ObjectId;

var User = require('../models/user').User;
var Test = require('../models/test').model;
var testSchema = require('../models/user').testSchema;



exports.getURLContent = function(req, res) {
  var url = req.query.url;
  var match = req.query.match;
  if (!url) {
    return res.status(422).send("Please provide a URL.")
  }
  axios.get(url)
    .then((response) => {
      var data = response.data;
      var suc = ( data.indexOf(match) > 0 );
      res.json({success: suc});
    })
    .catch((response) => {
      res.status(404).json("Could not get URL.");
    });

}

exports.create = function(req, res) {
  var user = req.user;
  var url = req.body.url;
  var idString = uuid.v4();
  var site = { name: url, url: url, tests: [], _id: idString };
  var updateObject = {
    $push: {
      sites: site
    }
  };
  User.findOneAndUpdate({_id: user._id}, updateObject, {new: true}, function(err, model) {
    if (err) {
      res.status(422).send(err);
    } else {
      res.json({site: site});
    }
  });
}

exports.destroy = function(req, res) {
  var user = req.user;
  var siteId = req.query.siteId;
  user.sites.pull({siteId: siteId});
  user.save((err, message) => {
    if (err) {
      res.status(422).send(err);
    } else {
      res.send();
    }
  });
}


exports.update = function(req, res) {
  var user = req.user;
  var site_id = req.params.site_id;

  User.findById(user._id, function(err, doc) {
    // if (req.body.name) {
    //   doc.sites.id(site_id).name = req.body.name;
    // }
    // if (req.body.url) {
    //   doc.sites.id(site_id).url = req.body.url;
    // }
    console.log("HDSAIUIUIHUHIUADS")
    doc.save((err, message) => {
      console.log("KILOL ME BICGUIADHUASDHUDSAHIUDASIUHDSAIUIUIHUHIUADS")
      if (err) {
        res.status(422).send(err);
      } else {
        res.send({site: user.sites.id(site_id)});
      }
    });
  });
}

exports.createTest = function(req, res) {
  var user = req.user;
  var site_id = req.params.site_id;

  var test = {
    match: req.body.match,
    extension: req.body.extension,
    name: req.body.name,
    _id: uuid.v4()
  };

  user.sites.id(site_id).tests.push(test);

  user.save((err, message) => {
    if (err) {
      res.status(422).send(err);
    } else {
      res.send({site: user.sites.id(site_id)});
    }
  });
}

exports.deleteTest = function(req, res) {
  var user = req.user;
  var site_id = req.params.site_id;
  var test_id = req.params.test_id;

  user.sites.id(site_id).tests.id(test_id).remove();
  user.save((err, message) => {
    if (err) {
      res.status(422).send(err);
    } else {
      res.send({site: user.sites.id(site_id)});
    }
  });
}
