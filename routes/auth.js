const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
// Validatprs
const { registerValidation, loginValidation } = require('../utils/validation');

router.post('/register', async (req, res) => {
  // Data validation
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Does the user already exit ?
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send('Email already exist');

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  // Create new user
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });

  // Add the new user the database
  try {
    const savedUser = await user.save();
    res.status(200).send({ user: user._id });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post('/login', async (req, res) => {
  // Data valication
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Does the user already exit ?
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Email or password doesn't exist !");

  // Is the password correct ?
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword)
    return res.status(400).send("Email or password doesn't exist !");
  // Create and assign a token
  const token = jwt.sign({ _id: user.id }, process.env.JWT_SECRET_TOKEN);
  res.header('auth-token', token).send(token);
});

module.exports = router;
