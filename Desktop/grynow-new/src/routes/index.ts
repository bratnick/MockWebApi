import { Router } from 'express';
var router = Router();

router.get('/', function(req, res) {
  res.render('index');
});

router.get('/contact', function(req, res) {
  res.render('contact');
});

router.get('/creator', function (req, res) {
	res.render('creator');
});

router.get('/brand', function (req, res) {
	res.render('brand');
});


export default router;
