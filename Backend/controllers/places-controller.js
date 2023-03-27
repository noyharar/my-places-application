const HttpError = require('../models/http-error');
const uuid = require('uuid');
const {validationResult} = require('express-validator');
const getCoordsForAddress = require('../util/location');
const Place = require('../models/place');
const User = require('../models/user');
const mongoose = require('mongoose');

let DUMMY_PLACES = [
    {
        id: 'p1',
        title: 'Empire State Building',
        description: 'One of the most famous sky scrapers in the world!',
        imageUrl:
            'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg',
        address: '20 W 34th St, New York, NY 10001',
        location: {
            lat: 40.7484405,
            lng: -73.9878584
        },
        creator: 'u1'
    },
    {
        id: 'p2',
        title: 'Empire State Building',
        description: 'One of the most famous sky scrapers in the world!',
        imageUrl:
            'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg',
        address: '20 W 34th St, New York, NY 10001',
        location: {
            lat: 40.7484405,
            lng: -73.9878584
        },
        creator: 'u2'
    }
];

const getPlaceById = async (req, res, next) => {
    const placeId = req.params.pid;
    let place;
    try {
        place = await Place.findById(placeId);
    }catch (e) {
        const error = new HttpError(
            'Place not found',
            500
        );
        return next(error);
    }
    if(!place){
        const error = new HttpError('Could not find a place for the provided id.', 404);
        return next(error);
    }
    res.json({place : place.toObject({getters: true})})
};

const getPlacesByUserId = async (req, res, next) => {
    const userId = req.params.uid;
    let places;
    try {
        places = await Place.find({ creator : userId });
    }catch (e) {
        const error = new HttpError(
            'Places not found',
            500
        );
        return next(error);
    }
    if (!places || places.length === 0) {
        return next(new HttpError('Could not find a place for the provided user id.',404));
    }
    res.status(200).json({ places });
    // res.status(200).json({places: places.map(place => place.toObject({getters: true}))})
};

const createPlace = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }

    const { title, description, address, creator } = req.body;

    let coordinates;
    try {
        coordinates = await getCoordsForAddress(address);
    } catch (error) {
        return next(error);
    }

    // const title = req.body.title;
    const createdPlace = new Place({
        title,
        description,
        address,
        location: coordinates,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Empire_State_Building_%28aerial_view%29.jpg/400px-Empire_State_Building_%28aerial_view%29.jpg',
        creator
    });
    let user;
    try {
        user = await User.findById(creator);
    } catch (err) {
        const error = new HttpError(
            'Creating place failed, please try again.',
            500
        );
        return next(error);
    }
    if(!user){
        return next (new HttpError('Could not find user by id',404))
    }
    try {
        const session = await mongoose.startSession();
        session.startTransaction();
        await createdPlace.save({session:session});
        user.places.push(createdPlace)
        await user.save({session: session})
        await session.commitTransaction();
    } catch (err) {
        const error = new HttpError(
            'Creating place failed, please try again.',
            500
        );
        return next(error);
    }

    res.status(201).json({ place: createdPlace });
};

const updatePlace = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors);
        throw new HttpError('Invalid inputs', 422)
    }
    const { title, description } = req.body;
    const placeId = req.params.pid;
    let place;
    try{
        place = await Place.findById(placeId);
    }catch (err) {
        const error = new HttpError(
            'Something wrong - cant find place to update',
            500
        );
        return next(error);
    }
    place.title = title || place.title;
    place.description = description || place.description ;
    try {
        await place.save();
    }catch (err) {
        const error = new HttpError(
            'Place to update not found',
            500
        );
        return next(error);
    }
    res.status(200).json({place: place.toObject({getters: true})});
};

const deletePlace = async (req, res, next) => {
    const placeId = req.params.pid;
    let place;
    try {
        place = await Place.findById(placeId).populate('creator');
    }catch (err) {
        const error = new HttpError(
            'Something wrong - cant find place to delete',
            500
        );
        return next(error);
    }
    try {
        if(!place) {
            return next(new HttpError('Could not find place for this id',404))
        }
    }catch (err) {
        const error = new HttpError(
            'Something wrong - cant find place to delete',
            500
        );
        return next(error);
    }
    try {
        const session = await mongoose.startSession();
        session.startTransaction();
        await place.deleteOne({session:session});
        place.creator.places.pull(place);
        await place.creator.save({session:session});
        await session.commitTransaction();
    }catch (err) {
        const error = new HttpError(
            'Something wrong - cant find place to delete',
            500
        );
        return next(error);
    }
    res.status(200).json({message: `${placeId} deleted`});




};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
