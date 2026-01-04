import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { check, validationResult } from 'express-validator';
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

router.post(
  '/register',
  [
    check('username', 'Username is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
        'password','Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
  ],async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }
      const salt = await bcrypt.genSalt(10);
      console.log(salt);
      const passwordHash = await bcrypt.hash(password, salt);
      console.log("passwordHash",passwordHash);
      user = new User({
        username,
        email,
        passwordHash,
      });
      console.log("user", user);
      await user.save();

      res.json({ user: { id: user._id }, message: 'User registered successfully' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });

router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check(
        'password','Password is required'
    ).not().isEmpty(),
  ],async (req, res) => {    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      const payload = {
        user: { id: user._id, username: user.username },
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '5 days' },
        (err, token) => {
          if (err) throw err;
          res.json({ token, user: { id: user._id, username: user.username } } );
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
      }
    )

export default router;