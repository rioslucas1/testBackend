'use strict';
const router = require('express').Router();
const logger = require('../logger');
const {User} = require('../models');

function validateFields(req, res, next) {
    // TODO:
    // - name: string, al menos 3 caracteres
    // - color: string, uno de estos valores: "red", "green", "blue"
    return next();
}

function saveUser(req, res) {
    return User.create({
        name: req.body.name,
        color: req.body.color
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
    saveUser
);

module.exports = router;
