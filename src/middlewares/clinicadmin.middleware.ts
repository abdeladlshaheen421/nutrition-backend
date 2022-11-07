import { body } from 'express-validator';
import ClinicAdminModel from '../models/clinicadmin.model';

export const validateCreation = [
  // name
  body('name')
    .isAlpha('en-US', { ignore: ' ' })
    .withMessage('Name must be alphabets only.')
    .isLength({ max: 30 })
    .withMessage('Name must be 30 letters max.'),
  // email
  body('email')
    .isEmail()
    .withMessage('Invalid email.')
    .custom(async (value) => {
      const client = await ClinicAdminModel.findOne({ email: value });
      if (client) {
        return Promise.reject('E-mail already in use');
      }
    }),
  // password
  body('password')
    .isStrongPassword()
    .withMessage(
      'Password must be combination of one uppercase, one lower case, one special char and one digit.'
    ),
  // phone number
  body('phone')
    .matches(/^01[0125][0-9]{8}$/, 'i')
    .withMessage('Invalid phone number.'),

  // birthDate
  body('birthDate').isDate().withMessage('Invalid birth date.'),

  // nationalId
  body('nationalId')
    .matches(
      /(2|3)[0-9][1-9][0-1][1-9][0-3][1-9](01|02|03|04|11|12|13|14|15|16|17|18|19|21|22|23|24|25|26|27|28|29|31|32|33|34|35|88)\d\d\d\d\d/,
      'i'
    )
    .withMessage('Invalid national id.'),

  // image
  body('image').custom((value) => {
    // check if image is a valid image
  }),
];

export const validateUpdate = [
  // name
  body('name')
    .optional({ nullable: true })
    .isAlpha('en-US', { ignore: ' ' })
    .withMessage('Name must be alphabets only.')
    .isLength({ max: 30 })
    .withMessage('Name must be 30 letters max.'),
  // email
  body('email')
    .optional({ nullable: true })
    .isEmail()
    .withMessage('Invalid email.')
    .custom(async (value) => {
      const client = await ClinicAdminModel.findOne({ email: value });
      if (client) {
        return Promise.reject('E-mail already in use');
      }
    }),
  // password
  body('password')
    .optional({ nullable: true })
    .isStrongPassword()
    .withMessage(
      'Password must be combination of one uppercase, one lower case, one special char and one digit.'
    ),
  // phone number
  body('phone')
    .optional({ nullable: true })
    .matches(/^01[0125][0-9]{8}$/, 'i')
    .withMessage('Invalid phone number.'),

  // birthDate
  body('birthDate')
    .optional({ nullable: true })
    .isDate()
    .withMessage('Invalid birth date.'),

  // nationalId
  body('nationalId')
    .optional({ nullable: true })
    .matches(
      /(2|3)[0-9][1-9][0-1][1-9][0-3][1-9](01|02|03|04|11|12|13|14|15|16|17|18|19|21|22|23|24|25|26|27|28|29|31|32|33|34|35|88)\d\d\d\d\d/,
      'i'
    )
    .withMessage('Invalid national id.'),

  // image
  body('image')
    .optional({ nullable: true })
    .custom((value) => {
      // check if image is a valid image
    }),
];
