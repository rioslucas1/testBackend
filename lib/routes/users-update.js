'use strict';
const router = require('express').Router();
const { User } = require('../models');
const logger = require('../logger');

router.patch('/users/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const updateData = req.body;

        const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
            new: true, 
            runValidators: true 
        });

        if (!updatedUser) {
            return res.status(404).json({
                code: 'user_not_found',
                message: `User with ID ${userId} does not exist.`
            });
        }

        return res.status(200).json({
            code: 'success',
            message: `User with ID ${userId} has been updated successfully.`,
            data: updatedUser
        });
    } catch (error) {
        logger.error(`PATCH /users/${req.params.id} - Error: ${error.message}`);
        return res.status(500).json({
            code: 'internal_error',
            message: 'An error occurred while updating the user.',
            error: error.message
        });
    }
});

module.exports = router;
