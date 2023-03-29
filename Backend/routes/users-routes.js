const express = require('express');
const {check} = require('express-validator');
const fileUpload = require( '../middleware/file-upload');

const usersControllers = require('../controllers/users-controller');

const router = express.Router();

router.get('/', usersControllers.getUsers);
router.post('/signup',
    fileUpload.single('image'),
    [
    check('name').not().isEmpty(),
    check('password').isLength({min: 6}),
    check('email').normalizeEmail().isEmail()
], usersControllers.signup);
router.post('/login', usersControllers.login);


module.exports = router;
