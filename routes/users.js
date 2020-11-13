const _ = require('lodash');
const bcyrpt = require('bcrypt');
const { User , validate } = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/me', auth , async(req , res) => {
    const user = await User.findById(req.user._id).select('-password');
    res.send(user);
});

router.post('/', async (req , res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if(user) return res.status(400).send('User Already register');

    user = new User(_.pick(req.body, [ "name","email","password"]));
    const salt = await bcyrpt.genSalt(10);
    user.password = await bcyrpt.hash(user.password , salt);

    await user.save();
    
    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send(_.pick(user, [ "name", "email" ]));
});

module.exports = router;