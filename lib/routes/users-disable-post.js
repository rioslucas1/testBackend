'use strict';
const router = require('express').Router();
const logger = require('../logger');
const { User } = require('../models');

router.post('/users/:id/disable', async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({
                code: 'user_not_found',
                message: `User with ID ${userId} does not exist.`
            });
        }

        if (!user.enabled) {
            return res.status(400).json({
                code: 'user_already_disabled',
                message: `User with ID ${userId} is already disabled.`
            });
        }

        user.enabled = false;
        await user.save();

        return res.status(200).json({
            code: 'success',
            message: `User with ID ${userId} has been disabled successfully.`,
            data: user
        });
    } catch (error) {
        logger.error(`POST /api/users/${req.params.id}/disable - Error: ${error.message}`);
        return res.status(500).json({
            code: 'internal_error',
            message: 'An error occurred while disabling the user.',
            error: error.message
        });
    }
});

module.exports = router;
