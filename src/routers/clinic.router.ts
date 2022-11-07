import express, { Request, Response, NextFunction } from 'express';
import clinicController, { ClinicType } from '../controllers/clinic.controller';
import {
  validateCreation,
  isValidIdParam,
  isValidClinic,
  validateUpdate,
} from '../middlewares/clinic.middleware';
import { validate } from './client.router';
import { matchedData } from 'express-validator';
import sharp from 'sharp';
import multer from 'multer';

const storage = multer.memoryStorage();
// resizeImage middleware
const resizeImage = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.file) return next();
  req.file.filename = `clinic-${Math.random()}-${Date.now()}.jpeg`;
  sharp(req.file.buffer)
    .resize(400, 400)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`./../assets/images/${req.file.filename}`);
  next();
};

const upload = multer({ storage });
// get all clinics
const index = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const clinics: ClinicType[] = <ClinicType[]>await clinicController.index();
    res.status(200).json(clinics);
  } catch (error) {
    next(error);
  }
};

const create = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    validate(req);
    const matched = matchedData(req, {
      includeOptionals: true,
    });
    const newClinic: ClinicType = <ClinicType>(
      await clinicController.create(<ClinicType>matched)
    );
    res.status(201).json(newClinic);
  } catch (error) {
    next(error);
  }
};

const show = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    validate(req);
    const clinic: ClinicType = <ClinicType>(
      await clinicController.show(req.params.id)
    );
    res.status(200).json(clinic);
  } catch (error) {
    next(error);
  }
};

const destroy = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    validate(req);
    await clinicController.destroy(req.params.id);
    res.status(200).json({ message: 'Clinic is deleted successfully' });
  } catch (error) {
    next(error);
  }
};

const update = async (
  req: Request,
  res: Response,
  next: Function
): Promise<void> => {
  try {
    validate(req);
    const matched = matchedData(req, {
      includeOptionals: true,
    });
    const updatedData = await clinicController.update(
      <ClinicType>matched,
      req.params.id
    );
    res.send(updatedData);
  } catch (error) {
    next(error);
  }
};

const search = async (req: Request, res: Response): Promise<void> => {
  const searchText: string = req.query.search as string;
  if (searchText) {
    const result = await clinicController.search(searchText);
    res.status(200).json(result);
  } else {
    res.status(404).json({ msg: 'Invalid query' });
  }
};

const getAdminClinic = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    validate(req);
    const clinic: ClinicType = <ClinicType>(
      await clinicController.getAdminClinic(req.params.adminId)
    );
    res.status(200).json(clinic);
  } catch (error) {
    next(error);
  }
};
const clinicRouter = (app: express.Application): void => {
  app
    .route('/clinics')
    .get(index) // get all clinics in our system
    .post(validateCreation, upload.single('image'), create); // This will create a clinic for Admin

  app
    .route('/clinic/:id')
    .all(isValidIdParam)
    .get(show)
    .delete(destroy)
    .put(validateUpdate, update);

  app.get('/clinics/search', search); // using query param
  app.get('/clinicAdmin/:adminId/clinic',getAdminClinic)
};

export default clinicRouter;
