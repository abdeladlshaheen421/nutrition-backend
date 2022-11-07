import { Application, NextFunction, Request, Response } from 'express';
import { Role } from '../controllers/client.controller';
import {
  validateCreation,
  validateUpdate,
} from '../middlewares/reservation.middleware';
import Assistant from '../models/assistant.model';
import Clinic from '../models/clinic.model';
import { Status } from '../models/reservation.model';
import { ReservationController } from './../controllers/reservation.controller';
import { isValidIdParam } from './../middlewares/clinic.middleware';
import * as jwt from 'jsonwebtoken';
const secretKey = process.env.TOKEN_SECRET as jwt.Secret;

export const verifyAuthToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const header = req.headers.authorization as unknown as string;
    const jwtToken = header.split(' ')[1];
    const decoded = jwt.verify(jwtToken, secretKey);
    // sending data of logged in user to the next middleware
    res.locals.authUser = decoded;
    next();
  } catch (error) {
    res.status(401);
    res.send('Unauthorized');
  }
};

const reserveFromClinic = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // TODO: create user if not exists
    const reservation = await ReservationController.create({
      ...req.body,
      status: Status.APPROVED,
    });
    res.status(201).json({ reservation });
  } catch (error) {
    next(error);
  }
};

const reserveFromAPI = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const reservation = await ReservationController.create({
      ...req.body,
      status: Status.PENDING,
    });
    res.status(201).json({ reservation });
  } catch (error) {
    next(error);
  }
};

const replyToReservationRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const reservationId = req.body.reservationId;
    const status = req.body.status;
    const updatedReservation = ReservationController.update(
      reservationId,
      status
    );
    res.status(200).json({ updatedReservation });
  } catch (error) {
    next(error);
  }
};

const attend = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reservationId = req.body.reservationId;
    const status = Status.COMPLETED;
    const updatedReservation = ReservationController.update(
      reservationId,
      status
    );
    res.status(200).json({ updatedReservation });
  } catch (error) {
    next(error);
  }
};

const getClinicReservations = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = res.locals.authUser.id;
    const role = res.locals.authUser.role;
    let clinicId;
    if (role === Role.CLINIC_ADMIN) {
      clinicId = await Clinic.findOne({ clinicAdmin: userId });
    } else if (role === Role.ASSISTANT) {
      clinicId = await Assistant.findById(userId, { clinic: 1 });
    }
    const reservations = await ReservationController.getClinicReservations(
      clinicId
    );
    res.status(200).json({ reservations });
  } catch (error) {
    next(error);
  }
};

const getReservationById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const reservation = await ReservationController.getOne(req.params.id);
    res.status(200).json({ reservation });
  } catch (error) {
    next(error);
  }
};

const reservationRouter = (app: Application) => {
  app.get('/reservations/clinic/:id', isValidIdParam, getClinicReservations);
  app.get('/reservations/:id', isValidIdParam, getReservationById);
  app.post('/reservations/clinic', validateCreation, reserveFromClinic);
  app.post('/reservations/api', validateCreation, reserveFromAPI);
  app.post('/reservations/reply', validateUpdate, replyToReservationRequest);
  app.post('/reservations/attend', validateUpdate, attend);
};

export default reservationRouter;
