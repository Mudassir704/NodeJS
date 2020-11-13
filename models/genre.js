const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
  
  const genreSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50
    }
  });

  const Genre = mongoose.model('Genre', genreSchema);

  function validate(genere) {
    const schema = Joi.object({
      name: Joi.string().min(5).max(50).required(),
    });
    return schema.validate(genere);
  }

  exports.genreSchema = genreSchema;
  exports.Genre = Genre;
  exports.validate = validate;