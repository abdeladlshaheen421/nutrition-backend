import { body, CustomValidator } from 'express-validator';
import Assistant from '../models/assistant.model';
import Clinic from '../models/clinic.model';

//Custom Validator

const isAssistantEmailValid: CustomValidator = async (value) => {
  const assistant = await Assistant.findOne({ email: value });
  if (assistant) {
    return Promise.reject('Sorry, e-mail already taken');
  }
};

const isClinicValid: CustomValidator = async (value) => {
  const clinic = await Clinic.findOne({ _id: value });
  if (!clinic) {
    return Promise.reject(
      'Assistant must have a clinic that he belongs to and clinic must be already existed'
    );
  }
};

export const validateCreation = [
  // Name
  body('name')
    .trim()
    .isAlpha('en-US', { ignore: ' ' })
    .withMessage('Name must be alphabets only.')
    .bail()
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
    .trim()
    .isEmail()
    .withMessage('Invalid email.')
    .bail()
    .custom(isAssistantEmailValid),
  // Clinic
  body('clinic')
    .not()
    .isEmpty()
    .withMessage('You should enter value for the clinic')
    .bail()
    .isMongoId()
    .withMessage('Not valid Object ID')
    .bail()
    .custom(isClinicValid),

  //image
  body('image')
    .optional({ nullable: true })
    .matches(/^[a-zA-Z0-9]+\.(jpe?g|png)$/i)
    .withMessage('Image must be valid Image'),
];

export const validateUpdate = [
  // Name
  body('name')
    .optional()
    .trim()
    .isAlpha('en-US', { ignore: ' ' })
    .withMessage('Name must be alphabets only.')
    .bail()
    .isLength({ max: 30 })
    .withMessage('Name must be 30 letters max.'),
  // email
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Invalid email.')
    .bail()
    .custom(isAssistantEmailValid),
  // Clinic
  body('clinic')
    .optional()
    .not()
    .isEmpty()
    .withMessage('You should enter value for the clinic')
    .bail()
    .isMongoId()
    .withMessage('Not valid Object ID')
    .bail()
    .custom(isClinicValid),

  //image
  body('image')
    .optional({ nullable: true })
    .matches(/^[a-zA-Z0-9]+\.(jpe?g|png)$/i)
    .withMessage('Image must be valid Image'),
];
