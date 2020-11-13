const auth = require('../middleware/auth');
const validId = require('../middleware/validateObjectId');
const express = require("express");
const router = express.Router();
const { Genre , validate } = require("../models/genre");
const admin = require('../middleware/admin');

router.get("/", async (req, res) => {
  // throw new Error('Could not get the genres .');
  const generes = await Genre.find().sort('name');
  res.send(generes);
});

router.post("/", auth , async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  
  let genere = new Genre({ name: req.body.name });
  genere = await genere.save()
  
  res.send(genere);
});

router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genere = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name},{ new : true });

  if (!genere) return res.status(404).send("Not FOUND!!!");

  res.send(genere);
});

router.get("/:id", validId ,async (req, res) => {
  const genere = await Genre.findById(req.params.id);

  if (!genere) return res.status(404).send("Not FOUND!!!");

  res.send(genere);
});

router.delete("/:id",[ auth, admin ], async (req, res) => {
  const genere = await Genre.findByIdAndRemove(req.params.id);

  if (!genere) return res.status(404).send("Not FOUND!!!");

  res.send(genere);
});


module.exports = router;
