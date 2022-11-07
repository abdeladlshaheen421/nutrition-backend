import { body } from 'express-validator';
import Client from '../models/client.model';

export const isValidEmail = body('email')
  .isEmail()
  .withMessage('Email should be a valid email')
  .bail()
  .custom(async (email) => {
    const client = await Client.findOne({ email: email });
    if (!client) {
      return Promise.reject('E-mail already in use');
    }
    return Promise.resolve();
  });

export const isValidPassword = body('newPassword')
  .isStrongPassword()
  .withMessage(
    'password should include special char and at least captial char and number'
  );
export const validateCreation = [
  // first name
  body('firstName')
    .isAlpha('en-US', { ignore: ' ' })
    .withMessage('Name must be alphabets only.')
    .isLength({ max: 30 })
    .withMessage('Name must be 30 letters max.'),
  // last name
  body('lastName')
    .isAlpha('en-US', { ignore: ' ' })
    .withMessage('Name must be alphabets only.')
    .isLength({ max: 30 })
    .withMessage('Name must be 30 letters max.'),
  // password
  body('password')
    .isStrongPassword()
    .withMessage(
      'Password must be combination of one uppercase, one lower case, one special char and one digit.'
    ),
  // email
  body('email')
    .isEmail()
    .withMessage('Invalid email.')
    .custom(async (value) => {
      const client = await Client.findOne({ email: value });
      if (client) {
        return Promise.reject('E-mail already in use');
      }
    }),
  // phone number
  body('phone')
    .matches(/^01[0125][0-9]{8}$/, 'i')
    .withMessage('Invalid phone number.'),

  body('username')
    .optional({ nullable: true })
    .isAlphanumeric('en-US')
    .withMessage('Username must be alphanumeric only.')
    .isLength({ max: 30 })
    .withMessage('Username must be 30 letters max.')
    .custom(async (value, { req }) => {
      const client = await Client.findOne({ username: value });
      if (client && client._id != req.params?.id) {
        return Promise.reject('Username already in use');
      }
    }),

  body('gender')
    .optional({ nullable: true })
    .isIn(['Male', 'male', 'Female', 'female'])
    .withMessage('Gender must be male or female only.'),

  body('birthDate')
    .optional({ nullable: true })
    .isDate()
    .withMessage('Invalid birth date.'),

  body('lastVisit')
    .optional({ nullable: true })
    .isDate()
    .withMessage('Invalid last visit date.'),
];

export const validateUpdate = [
  // first name
  body('firstName')
    .optional({ nullable: true })
    .isAlpha('en-US', { ignore: ' ' })
    .withMessage('first name must be alphabets only.')
    .isLength({ max: 30 })
    .withMessage('first name must be 30 letters max.'),
  // last name
  body('lastName')
    .optional({ nullable: true })
    .isAlpha('en-US', { ignore: ' ' })
    .withMessage('last name must be alphabets only.')
    .isLength({ max: 30 })
    .withMessage('last name must be 30 letters max.'),

  // email
  body('email')
    .optional({ nullable: true })
    .isEmail()
    .withMessage('Invalid email.')
    .custom(async (value) => {
      const client = await Client.findOne({ email: value });
      if (client) {
        return Promise.reject('E-mail already in use');
      }
    }),
  // phone number
  body('phone')
    .optional({ nullable: true })
    .matches(/^01[0125][0-9]{8}$/, 'i')
    .withMessage('Invalid phone number.'),

  body('username')
    .optional({ nullable: true })
    .isAlphanumeric('en-US')
    .withMessage('Username must be alphanumeric only.')
    .isLength({ max: 30 })
    .withMessage('Username must be 30 letters max.')
    .custom(async (value, { req }) => {
      const client = await Client.findOne({ username: value });
      if (client && client._id != req.params?.id) {
        return Promise.reject('Username already in use');
      }
    }),

  body('gender')
    .optional({ nullable: true })
    .isIn(['Male', 'male', 'Female', 'female'])
    .withMessage('Gender must be male or female only.'),

  body('birthDate')
    .optional({ nullable: true })
    .isDate()
    .withMessage('Invalid birth date.'),

  body('lastVisit')
    .optional({ nullable: true })
    .isDate()
    .withMessage('Invalid last visit date.'),
];

export const validatePassword = [
  body('newPassword')
    .isStrongPassword()
    .withMessage(
      'Password must be combination of one uppercase, one lower case, one special char and one digit.'
    ),
];
