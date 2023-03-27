const HttpError = require('../models/http-error');
const uuid = require('uuid');
const {validationResult} = require('express-validator');
const User = require('../models/user');

let DUMMY_USERS = [
    {
        id: 'u1',
        email: 'u1@gmail.com',
        name: 'u1',
        password: 'u123456',
    },
    {
        id: 'u2',
        email: 'u2@gmail.com',
        name: 'u2',
        password: 'u223456',
    },
];

const getUsers = async (req, res, next) => {
    let users;
    try {
        users = await User.find({}, '-password');
    }catch (err) {
        const error = new HttpError(
            'Get users failed, please try again.',
            500
        );
        return next(error);
    }
    res.json({users:users.map(user => user.toObject({getters: true}))});
};


const signup = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors);
        return next (new HttpError('Invalid inputs', 422));
    }
    const { name, email, password } = req.body;
    let find;
    try {
        find = await User.findOne({email : email});
    }catch (err) {
        const error = new HttpError(
            'Creating user failed, please try again.',
            500
        );
        return next(error);
    }
    if(find){
        const error = new HttpError('This email already exists', 422);
        return next(error);
    }
    const createUser = new User({
        name,
        email,
        image: 'https://www.hrus.co.il/wp-content/uploads/2015/09/%D7%90%D7%99%D7%A9-%D7%A2%D7%A1%D7%A7%D7%99%D7%9D-Photo-by-stockimages.jpg',
        password,
        places: []
    });
    try{
        await createUser.save();
    }catch (err) {
        const error = new HttpError(
            'Creating user failed, please try again.',
            500
        );
        return next(error);
    }
    res.status(201).json({user : createUser.toObject({getters : true})})
};

const login = async (req, res, next) => {
    const { email, password } = req.body;
    let identifiedUser;
    try {
        identifiedUser = await User.findOne({email : email});
    }catch (err) {
        const error = new HttpError(
            'Creating user failed, please try again.',
            500
        );
        return next(error);
    }
    if(!identifiedUser || identifiedUser.password !== password){
        return next(new HttpError('Could not identify user'));
    }
    res.json({message: 'logged in',user: identifiedUser.toObject({getters: true})})
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
