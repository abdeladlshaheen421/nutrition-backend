import { Application, NextFunction, Request, Response } from 'express';
import { matchedData } from 'express-validator';

import { DoctorController, DoctorType } from '../controllers/doctor.controller';
import { Role } from '../controllers/client.controller';
import {
  validateDoctor,
  validateUpdateDoctor,
} from './../middlewares/doctor.middleware';
import { isValidIdParam } from '../middlewares/clinic.middleware';
import { validatePassword } from '../middlewares/client.middleware';
import { validate, verifyAuthToken } from './client.router';

const index = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (
      [Role.ADMIN, Role.CLINIC_ADMIN].includes(res.locals.authUser.role) &&
      res.locals.authUser.id === req.params.id
    ) {
      const doctors = await DoctorController.getAll();
      res.status(200).json({ doctors });
    } else {
      res.status(403).send({ message: 'Unauthorized' });
    }
  } catch (err) {
    next(err);
  }
};

const show = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    validate(req);
    if (
      [Role.ADMIN, Role.CLINIC_ADMIN, Role.DOCTOR].includes(
        res.locals.authUser.role
      ) &&
      res.locals.authUser.id === req.params.id
    ) {
      const doctor = await DoctorController.getOne(req.params.id);
      res.status(200).json({ doctor });
    } else {
      res.status(403).send({ message: 'Unauthorized' });
    }
  } catch (err) {
    next(err);
  }
};

const showClinicDoctors = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    validate(req);

    const doctors = await DoctorController.getClinicDoctors(req.params.id);
    res.status(200).json({ doctors });
  } catch (err) {
    next(err);
  }
};

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    validate(req);
    if (
      [Role.ADMIN, Role.CLINIC_ADMIN].includes(res.locals.authUser.role) &&
      res.locals.authUser.id === req.params.id
    ) {
      const doctor = await DoctorController.create(req.body);
      res.status(200).json({ doctor });
    } else {
      res.status(403).send({ message: 'Unauthorized' });
    }
  } catch (err) {
    next(err);
  }
};

const update = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    validate(req);
    if (
      [Role.ADMIN, Role.CLINIC_ADMIN].includes(res.locals.authUser.role) &&
      res.locals.authUser.id === req.params.id
    ) {
      const matched = matchedData(req, {
        includeOptionals: true,
      });
      const doctor = await DoctorController.update(
        req.params.id,
        <DoctorType>matched
      );
      res.status(200).json({ doctor });
    } else {
      res.status(403).send({ message: 'Unauthorized' });
    }
  } catch (err) {
    next(err);
  }
};

const remove = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    validate(req);
    if (
      [Role.ADMIN, Role.CLINIC_ADMIN].includes(res.locals.authUser.role) &&
      res.locals.authUser.id === req.params.id
    ) {
      const doctor = await DoctorController.delete(req.params.id);
      res.status(200).json({ doctor });
    } else {
      res.status(403).send({ message: 'Unauthorized' });
    }
  } catch (err) {
    next(err);
  }
};

const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const doctor = await DoctorController.login(
      req.body.email,
      req.body.password
    );
    if (doctor) {
      const token = await DoctorController.generateJWT(doctor);
      res.status(200).json({ token });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    validate(req);
    if (
      res.locals.authUser.role === Role.DOCTOR &&
      res.locals.authUser.id === req.params.id
    ) {
      const oldPassword = req.body.oldPassword;
      const newPassword = req.body.newPassword;
      const doctorWithPassword = await DoctorController.findByPassword(
        req.params.id,
        oldPassword
      );
      if (doctorWithPassword) {
        const doctor: DoctorType = await DoctorController.updatePassword(
          req.params.id,
          newPassword
        );
        res.status(200).json({ doctor });
      } else {
        res.status(401).json({ message: 'Invalid credentials' });
      }
    } else {
      res.status(403).send({ message: 'Unauthorized' });
    }
  } catch (error) {
    next(error);
  }
};

const doctorRouter = (app: Application) => {
  //middleware verifyAuthToken to index
  app.get('/doctors', index);
  app.get('/doctors/:id', isValidIdParam, verifyAuthToken, show);
  app.get(
    '/doctors/clinic/:id',
    isValidIdParam,
    verifyAuthToken,
    showClinicDoctors
  );
  app.post('/doctors/register', validateDoctor, create);
  app.post('/doctors/login', login);
  app.put(
    '/doctors/:id',
    isValidIdParam,
    validateUpdateDoctor,
    verifyAuthToken,
    update
  );
  app.patch(
    '/doctors/:id/password',
    isValidIdParam,
    validatePassword,
    verifyAuthToken,
    resetPassword
  );
  app.delete('/doctors/:id', isValidIdParam, verifyAuthToken, remove);
};

export default doctorRouter;
