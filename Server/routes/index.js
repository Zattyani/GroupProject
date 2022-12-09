let express = require('express');
let router = express.Router();
let indexController = require('../controller/index');

/* GET home page. */
router.get('/', indexController.displayHomePage);

/* GET home page. */
router.get('/home', indexController.displayHomePage);

// GET router for login page
router.get('/login', indexController.displayLoginPage);

// Post router for login page
router.post('/login', indexController.processLoginPage);

// GET router for registration page
router.get('/register', indexController.displayRegisterPage);

// Post router for registration page
router.post('/register', indexController.processRegisterPage);

// GET router for logout page
router.get('/logout', indexController.performLogout);




module.exports = router;
