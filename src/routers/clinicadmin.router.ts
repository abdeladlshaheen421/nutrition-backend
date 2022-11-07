import { Application, NextFunction, Request, Response } from 'express';
import {
  ClinicAdminController,
  ClinicAdminType,
} from '../controllers/clinicadmin.controller';
import { validationResult } from 'express-validator';
import { matchedData } from 'express-validator';
import * as jwt from 'jsonwebtoken';
import {
  validateCreation,
  validateUpdate,
} from './../middlewares/clinicadmin.middleware';
import { Role } from '../controllers/client.controller';
import { isValidIdParam } from '../middlewares/clinic.middleware';
import { validatePassword } from './../middlewares/client.middleware';

const secretKey = process.env.TOKEN_SECRET as jwt.Secret;

export function validate(req: Request): void {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error();
    console.log(errors);
    error.message = errors
      .array()
      .reduce((current, object) => current + object.msg + ' ', '');
    throw error;
  }
}

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

const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const client = await ClinicAdminController.login(
      req.body.email,
      req.body.password
    );
    if (client) {
      const token = await ClinicAdminController.generateJWT(client);
      res.status(200).json({ token });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    next(error);
  }
};

const index = async (req: Request, res: Response): Promise<void> => {
  try {
    if (res.locals.authUser.role === Role.ADMIN) {
      const clinicAdmins = await ClinicAdminController.getAll();
      res.status(200).json({ clinicAdmins });
    } else {
      res.status(401).json({ message: 'Unauthorized' });
    }
  } catch (err) {
    throw new Error(`Could not get clinic admins => ${err}`);
  }
};

const show = async (req: Request, res: Response): Promise<void> => {
  try {
    validate(req);
    const clinicAdmin = await ClinicAdminController.getOne(req.params.id);
    res.status(200).json({ clinicAdmin });
  } catch (err) {
    throw new Error(`Could not show this clinic admin => ${err}`);
  }
};

const create = async (req: Request, res: Response) => {
  try {
    validate(req);
    const clinicAdmin = await ClinicAdminController.create(req.body);
    res.status(201).json({ clinicAdmin });
  } catch (err) {
    throw new Error(`Could not create this clinic admin => ${err}`);
  }
};

const update = async (req: Request, res: Response): Promise<void> => {
  try {
    validate(req);
    const matched = matchedData(req, {
      includeOptionals: true,
    });
    const clinicAdmin = await ClinicAdminController.update(
      req.params.id,
      <ClinicAdminType>matched
    );
    res.status(200).json({ clinicAdmin });
  } catch (err) {
    throw new Error(`Could not edit this clinic admin => ${err}`);
  }
};

const remove = async (req: Request, res: Response): Promise<void> => {
  try {
    validate(req);
    if (res.locals.authUser.role === Role.ADMIN) {
      const clinicAdmin = await ClinicAdminController.delete(req.params.id);
      res.status(200).json({ clinicAdmin });
    } else {
      res.status(401).json({ message: 'Unauthorized' });
    }
  } catch (err) {
    throw new Error(`Could not delete this clinic admin => ${err}`);
  }
};

const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    validate(req);
    const id = res.locals.authUser.id;
    if (id === req.params.id) {
      const oldPassword = req.body.oldPassword;
      const newPassword = req.body.newPassword;
      const correctPassword = await ClinicAdminController.findByPassword(
        req.params.id,
        oldPassword
      );
      if (correctPassword) {
        const client: ClinicAdminType =
          await ClinicAdminController.updatePassword(
            req.params.id,
            newPassword
          );
        res.status(200).json({ client });
      } else {
        res.status(401).json({ message: 'Invalid credentials' });
      }
    } else {
      res.status(401).json({ message: 'Unauthorized' });
    }
  } catch (error) {
    next(error);
  }
};

const clinicAdminRouter = (app: Application) => {
  // app.get('/clinic-admins', index);
  app.get('/clinic-admins/:id', isValidIdParam, show);
  app.post('/clinic-admins', validateCreation, create);
  app.post('/clinic-admins/login', login);
  app.patch(
    '/clinic-admins/:id',
    verifyAuthToken,
    isValidIdParam,
    validateUpdate,
    update
  );
  app.patch(
    '/clinic-admins/:id/password',
    verifyAuthToken,
    isValidIdParam,
    validatePassword,
    changePassword
  );
  app.delete('/clinic-admins/:id', isValidIdParam, remove);
  // app.get('/clinic-admins/:id/clinics', getAllClinics);
  // app.get('/clinic-admins/:id/clinics/:id', getOneClinic);
};

export default clinicAdminRouter;
