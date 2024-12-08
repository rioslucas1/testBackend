'use strict';
const router = require('express').Router();
const { User } = require('../models');
const logger = require('../logger');

router.get('/users/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId).populate('userInformation');

        if (!user) {
            return res.status(404).json({
                code: 'user_not_found',
                message: `User with ID ${userId} does not exist.`
            });
        }

        return res.status(200).json({
            code: 'success',
            message: `User with ID ${userId} and related information retrieved successfully.`,
            data: user
        });
    } catch (error) {
        logger.error(`GET /users/${req.params.id} - Error: ${error.message}`);
        return res.status(500).json({
            code: 'internal_error',
            message: 'An error occurred while retrieving the user.',
            error: error.message
        });
    }
});

module.exports = router;
