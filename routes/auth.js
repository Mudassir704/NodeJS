const _ = require('lodash');
const Joi = require('@hapi/joi');
const bcyrpt = require('bcrypt');
const { User } = require('../models/user');
const express = require('express');
const router = express.Router();
const validate = require('../middleware/validate');

router.post('/', validate(validateAuth) ,async (req , res) => {
    let user = await User.findOne({ email: req.body.email });
    if(!user) return res.status(400).send('Invalid username or Password');

    const validPassword = await bcyrpt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).send('Invalid username or Password');
  
    const token = user.generateAuthToken();
    res.send(token);
});

function validateAuth(req) {
    const Schema = Joi.object({
        email: Joi.string().min(5).max(1024).email().required(),
        password: Joi.string().max(50).min(5).required()
    });
    return Schema.validate(req);
    
}

module.exports = router;