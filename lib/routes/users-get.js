'use strict'
const router = require('express').Router();
const { User } = require('../models');
const logger = require('../logger');

router.get('/users', async (req, res) => {
    try {
        const { enabled, sortBy } = req.query;

        const filter = {};
        if (enabled !== undefined) {
            filter.enabled = enabled === 'true'; 
        }

        const sortOptions = {};
        if (sortBy) {
            sortOptions[sortBy] = 1;
        }

        const users = await User.find(filter).sort(sortOptions);

      
        return res.status(200).json({
            code: 'success',
            message: 'Users retrieved successfully',
            data: users,
        });
    } catch (error) {
       
        logger.error(`GET /api/users - Error: ${error.message}`);
        return res.status(500).json({
            code: 'internal_error',
            message: 'An error occurred while retrieving users',
            error: error.message,
        });
    }
});

module.exports = router;