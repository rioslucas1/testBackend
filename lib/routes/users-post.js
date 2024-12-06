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
    // Validación de User
    const { error: userError } = userSchema.validate(req.body, { abortEarly: false });
    if (userError) {
        return res.status(400).json({
            code: 'validation_error',
            message: 'Invalid fields in User',
            details: userError.details.map((err) => err.message)
        });
    }
    console.log("aca estoy");
    next();
}


async function createUserInformation(req, res, next) {
    try {
        // Extraer datos de userInformation del cuerpo de la solicitud
        const { name, lastName, dni, age } = req.body.userInformation;

        // Crear y guardar el documento de UserInformation
        const newUserInfo = await UserInformation.create({ name, lastName, dni, age });

        // Adjuntar el ID de UserInformation a req.body para que saveUser pueda usarlo
        req.body.userInformationId = newUserInfo._id;
        next();
    } catch (error) {
        logger.error(`POST /users - createUserInformation error: ${error.message}`);
        console.error('Error en createUserInformation:', error); // Para más información
        return res.status(500).json({
            code: 'internal_error',
            message: 'An error occurred while creating user information',
            error: error.message, // Añadido para más detalles en la respuesta
        });
    }
}


function saveUser(req, res) {
    console.log("Creating User");
    return User.create({
        email: req.body.email,
        color: req.body.color,
        enabled: req.body.enabled,
        userInformation: req.body.userInformationId // Referencia al documento UserInformation
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
