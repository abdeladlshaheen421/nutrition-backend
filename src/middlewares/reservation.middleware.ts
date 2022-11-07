import { body } from 'express-validator';

export const validateCreation = [
  // amount_paid
  body('amount_paid')
    .isNumeric()
    .withMessage('Amount Paid must be numbers only.')
    .custom((value) => {
      if (value < 1) {
        return 'it must be greater than zero';
      }
    }),

  // date
  body('date')
    .isDate()
    .withMessage('Invalid date.')
    .custom((value) => {
      if (value < new Date(Date.now())) {
        return 'Invalid date.';
      }
    }),

  // status
  body('status').isAlpha().withMessage('Invalid status.'),

  // clinic_id
  body('clinic_id').isMongoId().withMessage('Invalid clinic id.'),

  // doctor_id
  body('doctor_id').isMongoId().withMessage('Invalid doctor id.'),

  // client_id
  body('client_id').isMongoId().withMessage('Invalid client id.'),
];

export const validateUpdate = [
  // reservationId
  body('reservationId').isMongoId().withMessage('Invalid reservation id.'),

  // status
  body('status').isAlpha().withMessage('Invalid status.'),
];
