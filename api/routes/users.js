'use strict';

const express = require('express');
const { check, validationResult } = require('express-validator');
const bcryptjs = require('bcryptjs');
const auth = require('basic-auth');
const { sequelize, models } = require('../db');
const { User, Course } = models;
const router = express.Router();


const authenticateUser = async (req, res, next) => {
  let message = null;

  // Parse the user's credentials from the Authorization header.
  const credentials = auth(req);

  // If the user's credentials are available...
  if (credentials) {
    // Attempt to retrieve the user from the data store
    // by their username (i.e. the user's "key"
    // from the Authorization header).
    const userfind = await User.findAll();
    const user = userfind.find(u => u.emailAddress === credentials.name);

    // If a user was successfully retrieved from the data store...
    if (user) {
      // Use the bcryptjs npm package to compare the user's password
      // (from the Authorization header) to the user's password
      // that was retrieved from the data store.
      const authenticated = bcryptjs
        .compareSync(credentials.pass, user.password);

      // If the passwords match...
      if (authenticated) {
        console.log(`Authentication successful for username: ${credentials.name}`);

        // Then store the retrieved user object on the request object
        // so any middleware functions that follow this middleware function
        // will have access to the user's information.
        req.currentUser = user;
      } else {
        message = `Authentication failure for username: ${credentials.name}`;
      }
    } else {
      message = `User not found for username: ${credentials.name}`;
    }
  } else {
    message = 'Auth header not found';
  }

  // If user authentication failed...
  if (message) {
    console.warn(message);

    // Return a response with a 401 Unauthorized HTTP status code.
    res.status(401).json({ message: 'Access Denied' });
  } else {
    // Or if user authentication succeeded...
    // Call the next() method.
    next();
  }
};

// GET /api/users 200 - Returns the currently authenticated user
router.get('/users', authenticateUser, (req, res) => {
  const user = req.currentUser;

  res.json({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    emailAddress: user.emailAddress,
  });
});

// POST /api/users 201 - Creates a user, sets the Location header to "/", and returns no content
router.post("/users", [
  check("firstName")
  .exists({ checkNull: true, checkFalsy: true })
  .withMessage("Please provide a value for 'firstName'"),
  check("lastName")
  .exists({ checkNull: true, checkFalsy: true })
  .withMessage("Please provide a value for 'lastName'"),
  check("emailAddress")
  .exists({ checkNull: true, checkFalsy: true })
  .withMessage("Please provide a value for 'emailAddress'")
  .isEmail() // check if the email is valid
  .withMessage("Please provide a valid email address"),
  check("password")
  .exists({ checkNull: true, checkFalsy: true })
  .withMessage("Please provide a value for 'password'")
], async (req, res, next) => {

  // Get validation result from Request object
  const errors = validationResult(req);

  // If there are errors...
  if (!errors.isEmpty()) {
    // Map over errors object to get error messages
    const errorMessages = errors.array().map(error => error.msg);
    // Return errors to the client
    res.status(400).json({ errors: errorMessages });

  } else {
    // Search for a match
    const foundEmailCoincidence = await User.findOne({
      where: {
        emailAddress: req.body.emailAddress
      }
    });

    if (foundEmailCoincidence !== null) { // if there is a coincidence
      res.status(400).json({ errors: ['The email address is already in use!'] });
    }else {
      let user;
      try {
        user = req.body;
        user.password = bcryptjs.hashSync(user.password); // hash password
        // Create user with the hashed password
        await User.create(user);
        // Set location to '/'
        res.setHeader("Location", "/");
        // Set the status to 201 Created and end the response.
        res.status(201).end();
      } catch (err) {
        res.status(400).json({ errors: err });
      }
    }
  }
});


module.exports = router;
