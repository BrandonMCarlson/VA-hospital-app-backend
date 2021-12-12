const Product = require('../models/user');
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    try {
   
    const user = new User({
    firstName: 'Brandon',
    lastName: 'Carlson',
    email: 'brandoncarlson93bc@gmai..com',
    location: 'Spokane, WA',
    });

    await user.save();

    return res.send(user);

    } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
    }
   });

module.exports = router;
