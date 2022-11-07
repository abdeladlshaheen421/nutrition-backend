import { body, CustomValidator, ValidationChain } from 'express-validator';
import mongoose from 'mongoose';

import Clinic from '../models/clinic.model';
import Doctor from '../models/doctor.model';

// custom validatiors
const isDoctorEmailValid: CustomValidator = async (value) => {
  const doctor = await Doctor.findOne({ email: value });
  if (doctor) {
    return Promise.reject('Sorry, e-mail already taken');
  }
};

const isStartTimeValid: CustomValidator = (val: Date, { req }) => {
  if (
    new Date(val).toLocaleTimeString() >=
    new Date(req.body.endTime).toLocaleTimeString()
  )
    return Promise.reject('start time must be before end time');
  return Promise.resolve();
};

const isClinicValid: CustomValidator = async (id: string) => {
  const clinicId = new mongoose.Types.ObjectId(id);
  const clinic = await Clinic.findById(clinicId);
  if (!clinic) {
    return Promise.reject('Sorry, not a valid clinic');
  }
};

export const validateDoctor = [
  // name
  body('name')
    .matches(/^[a-zA-Z ]*$/)
    .withMessage('Name must have letters and spaces only.')
    .isLength({ min: 3, max: 30 })
    .withMessage('Name must be 3 letters min, 30 letters max.'),
  // email
  body('email')
    .normalizeEmail()
    .isEmail()
    .withMessage('Please enter a valid e-mail.')
    .bail()
    .custom(isDoctorEmailValid),
  // password
  body('password')
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage(
      'Password must be combination of one uppercase, one lower case, one special char and one digit.'
    ),
  // phone
  body('phone')
    .matches(/^01[0125]\d{8}$/)
    .withMessage('Please enter a valid phone number.'),
  // start time
  body('startTime')
    .notEmpty()
    .withMessage('start time should not be empty')
    .toDate()
    .custom(isStartTimeValid),
  // end time
  body('endTime')
    .notEmpty()
    .withMessage('end time should not be empty')
    .toDate()
    .isISO8601()
    .withMessage('Please enter a valid date'),
  // gender
  body('gender')
    .optional({ nullable: true })
    .isIn(['Male', 'male', 'Female', 'female'])
    .withMessage('Please enter a valid gender.'),
  // clinic
  body('clinic')
    .isMongoId()
    .withMessage('please enter a valid clinic id')
    .bail()
    .custom(isClinicValid),
  // image
  body('image')
    .optional()
    .matches(/^[a-zA-Z0-9]+\.(jpe?g|png)$/i)
    .withMessage('Please enter a valid image'),
];

export const validateUpdateDoctor = [
  // name
  body('name')
    .optional({ nullable: true })
    .matches(/^[a-zA-Z ]*$/)
    .withMessage('Name must have letters and spaces only.')
    .isLength({ min: 3, max: 30 })
    .withMessage('Name must be 3 letters min, 30 letters max.'),
  // phone
  body('phone')
    .optional({ nullable: true })
    .matches(/^01[0125]\d{8}$/)
    .withMessage('Please enter a valid phone number.'),
  // start time
  body('startTime')
    .optional({ nullable: true })
    .notEmpty()
    .withMessage('start time should not be empty')
    .toDate()
    .custom(isStartTimeValid),
  // end time
  body('endTime')
    .optional({ nullable: true })
    .notEmpty()
    .withMessage('end time should not be empty')
    .toDate()
    .isISO8601()
    .withMessage('Please enter a valid date'),
  // gender
  body('gender')
    .optional({ nullable: true })
    .isIn(['Male', 'male', 'Female', 'female'])
    .withMessage('Please enter a valid gender.'),
  // clinic
  body('clinic')
    .optional({ nullable: true })
    .isMongoId()
    .withMessage('please enter a valid clinic id')
    .bail()
    .custom(isClinicValid),
  // image
  body('image')
    .optional()
    .matches(/^[a-zA-Z0-9]+\.(jpe?g|png)$/i)
    .withMessage('Please enter a valid image'),
];
