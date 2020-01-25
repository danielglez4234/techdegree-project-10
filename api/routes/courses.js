'use strict';

const express = require('express');
const { check, validationResult } = require('express-validator');
const bcryptjs = require('bcryptjs');
const auth = require('basic-auth');
const { sequelize, models } = require('../db');
const { User, Course } = models;
const router = express.Router();

/* Handler function to wrap each route. */
function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error){
      res.status(500).send(error);
    }
  }
}

// User authentication ---------------------------------------------------------------
const authenticateUser = async (req, res, next) => {
  let message = null;
  const credentials = auth(req);

  if (credentials) {
    const user = await User.findOne({
      where: {
        emailAddress: credentials.name
      }
    });
    if (user) {
      const authenticated = bcryptjs
        .compareSync(credentials.pass, user.password);

      if (authenticated) {
        console.log(`Authentication successful for username: ${credentials.name}`);
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

  if (message) {
    console.warn(message);
    res.status(401).json({ message: 'Access Denied' });
  } else {
    next();
  }
};
// -----------------------------------------------------------------------------------

// GET /api/courses 200 - Returns a list of courses (including the user that owns each course)
router.get('/courses', asyncHandler(async (req, res) => {
  const courses = await Course.findAll({
    attributes: { exclude: ["createdAt", "updatedAt"] },
    include: [
      {
        model: User,
        as: 'Owner',
        attributes: { exclude: ["password", "createdAt", "updatedAt"] }
      },
    ],
  });
  if (courses === null) { // if no course is found
    res.status(400).json({ errors: 'the courses cannot be found' });
  }
  res.status(200).json({ courses });
}));


// GET /api/courses/:id 200 - Returns a the course (including the user that owns the course) for the provided course ID
router.get('/courses/:id', asyncHandler(async (req, res) => {
  const courses = await Course.findByPk(req.params.id, {
    attributes: { exclude: ["createdAt", "updatedAt"] },
    include: [
      {
        model: User,
        as: 'Owner',
        attributes: { exclude: ["password", "createdAt", "updatedAt"] }
      },
    ],
  });
  if (courses === null) { // if no course is found
    res.status(400).json({ errors: 'the course cannot be found' });
  }
  res.status(200).json({ courses });
}));


// POST /api/courses 201 - Creates a course, sets the Location header to the URI for the course, and returns no content
router.post('/courses', [
  check("title")
  .exists({ checkNull: true, checkFalsy: true })
  .withMessage("Title is required, Please provide a value for 'title'"),
  check("description")
  .exists({ checkNull: true, checkFalsy: true })
  .withMessage("Description is required, Please provide a value for 'description'")
  ], authenticateUser, asyncHandler(async (req, res) => {

    // Get validation result from Request object
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(error => error.msg); // Map over errors object to get error messages
      res.status(400).json({ errors: errorMessages }); // Return errors to the client
    }else {
      let course;
      try {
        const user = req.currentUser;
        course = req.body;
        course.userId = user.id; // put the user id that created the course in the userId field
        await Course.create(course);
        res.setHeader("Location", `/api/courses/${course.id}`);
        res.status(201).end();
      } catch (error) {
        course = await Course.build(req.body);
        res.status(400).json({ message: 'failed to create the course' });
      }
    }
}));


// PUT /api/courses/:id 204 - Updates a course and returns no content
router.put('/courses/:id', [
  check("title")
  .exists({ checkNull: true, checkFalsy: true })
  .withMessage("Title is required, Please provide a value for 'title'"),
  check("description")
  .exists({ checkNull: true, checkFalsy: true })
  .withMessage("Description is required, Please provide a value for 'description'")
  ], authenticateUser, asyncHandler(async (req, res) => {
    // Get validation result from Request object
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg); // Map over errors object to get error messages
    res.status(400).json({ errors: errorMessages }); // Return errors to the client
  }else {
    let course;
    try {
      course = await Course.findByPk(req.params.id);
      if (course) { // verify that the course to be updated exists
        if(course.userId === req.currentUser.id) { // verify if the current user own the requested course
          await course.update(req.body);
          res.status(204).end();
        } else { // if it doesn't belong, send a 403
          res.status(403).json({ message: 'You can only update the courses you own' });
        }
      }else {
        res.status(400).json({ errors: 'This course ID doesnt exists' });
      }
    } catch (error) {
      course = await Course.build(req.body);
      course.id = req.params.id; // make sure correct course gets updated
      res.status(400).json({ errors: 'failed to update the course' });
    }
  }
}));


// DELETE /api/courses/:id 204 - Deletes a course and returns no content
router.delete('/courses/:id', authenticateUser, asyncHandler(async (req ,res) => {
  const course = await Course.findByPk(req.params.id);
  if(course) { // verify that the course to be deleted exists
    if(course.userId === req.currentUser.id) { // verify if the current user own the requested course
      await course.destroy();
      res.status(204).end();
    } else { // if it doesn't belong, send a 403
      res.status(403).json({ errors: 'You can only delete the courses you own' });
    }
  } else {
    res.status(400).json({ errors: 'this course ID doesnt exists' });
  }
}));


module.exports = router;
