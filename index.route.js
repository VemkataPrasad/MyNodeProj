var express = require('express');
var router = express.Router();

/* GET Landing Page*/

router.get('/', function (req, res) {
 res.render('index', { title: 'SN API' });
});

module.exports = router;
