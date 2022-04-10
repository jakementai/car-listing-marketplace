var express = require('express');
var router = express.Router();
const users = require('../controllers/users');
const cars = require('../controllers/cars');
const carsAvailabilities = require('../controllers/carAvailabilities');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


// Users Routes
router.get('/users', users.list);
router.get('/users/:id', users.getById);
router.post('/users', users.add);
router.patch('/users/:id', users.update);


// Car Routes
router.get('/cars', cars.list);
router.get('/cars/:id', cars.getById);
router.post('/cars', cars.add);
router.patch('/cars/:id', cars.update);
router.post('/search', cars.search)

// Car Availabilities Routes
router.get('/car-slots', carsAvailabilities.list);
router.get('/car-slots/:id', carsAvailabilities.getById);
router.post('/car-slots', carsAvailabilities.add);
router.patch('/car-slots/:id', carsAvailabilities.update);


module.exports = router;
