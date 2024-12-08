'use strict';
const router = require('express').Router();
const logger = require('../logger');
const {User, UserInformation} = require('../models');
const joi = require('joi');

const userInformationSchema = joi.object({
    name: joi.string().alphanum().min(3).max(30).required(),
    lastName: joi.string().alphanum().min(3).max(30).required(), 
    dni: joi.string().alphanum().length(8).required(), 
    age: joi.number().min(0).max(200).required() });
    

const userSchema = joi.object({
    email: joi.string().email().required(), 
    color: joi.string().valid('red', 'green', 'blue').required(), 
    enabled: joi.boolean().default(true) ,
    userInformation: userInformationSchema.required()
});


function validateFields(req, res, next) {

    const { error: userError } = userSchema.validate(req.body, { abortEarly: false });
    if (userError) {
        return res.status(400).json({
            code: 'validation_error',
            message: 'Invalid fields in User',
            details: userError.details.map((err) => err.message)
        });
    }
    logger.info("Fields Validated"); // cambiar
    next();
}

async function createUserInformation(req, res, next) {
    try {
      
        const { name, lastName, dni, age } = req.body.userInformation;

        
        const newUserInfo = await UserInformation.create({ name, lastName, dni, age });

        
        req.body.userInformationId = newUserInfo._id;
        logger.info("User created successfully"); // cambiar 
        next();
    } catch (error) {
        logger.error(`POST /users - createUserInformation error: ${error.message}`);
        console.error('Error en createUserInformation:', error); 
        return res.status(500).json({
            code: 'internal_error',
            message: 'An error occurred while creating user information',
            error: error.message,
        });
    }
}

function saveUser(req, res) {
    logger.info("Saving New User"); // cambiar
    return User.create({
        email: req.body.email,
        color: req.body.color,
        enabled: req.body.enabled,
        userInformation: req.body.userInformationId 
    })
        .then((user) => {
            return res.status(201).json(user.toJSON());
        })
        .catch((error) => {
            logger.error(`POST /users - saveUser error: ${error.message}`);
            return res.status(500).json({
                code: 'internal_error',
                message: 'Internal error'
            });
        });
}


router.post(
    '/users',
    validateFields,
    createUserInformation,
    saveUser
);

module.exports = router;
