const express = require("express");
const Joi = require('@hapi/joi');
const { Rental } = require("../models/rental");
const auth = require("../middleware/auth");
const moment = require('moment');
const router = express.Router();
const validate = require('../middleware/validate');

router.post('/', [auth, validate(validateReturn)] ,async (req, res) => {
    const rental = await Rental.lookup(req.body.customerId, req.body.movieId);

    if(!rental) return res.status(404).send('Rental not FOund');

    if(rental.dateReturned) return res.status(400).send('Return Processed..');

    rental.return();
    await rental.save();

    return res.status(200).send(rental);
});

function validateReturn(req) {
    const schema = Joi.object({
      customerId: Joi.objectId().required(),
      movieId: Joi.objectId().required()
    });
    return schema.validate(req);
  }

module.exports = router;