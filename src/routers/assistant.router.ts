import { NextFunction, Request, Response, Application } from 'express';
import {
  AssistantController,
  AssistantType,
} from '../controllers/assistant.controller';
import {
  validateCreation,
  validateUpdate,
} from './../middlewares/assistant.middleware';
import { isValidIdParam } from '../middlewares/clinic.middleware';
import { validatePassword } from './../middlewares/client.middleware';
import { validate } from './client.router';
import { verifyAuthToken } from './client.router';

const assistantInstance = new AssistantController();

const createAssistant = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    validate(req);
    const assistant = await assistantInstance.create(req.body);
    res.status(201).json({ assistant });
  } catch (error) {
    next(error);
  }
};

const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const assistant = await assistantInstance.login(
      req.body.email,
      req.body.password
    );
    if (assistant) {
      const token = await assistantInstance.generateJWT(assistant);
      res.status(200).json({ token });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    next(error);
  }
};

const getAllAssistants = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    validate(req);
    if (res.locals.authUser.role === 'admin') {
      const assistants = await assistantInstance.index();
      res.status(200).json({ assistants });
    } else {
      res
        .status(401)
        .json({ message: 'You are Unauthorized to do this action' });
    }
  } catch (error) {
    next(error);
  }
};

const showAssistant = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    validate(req);
    if (
      res.locals.authUser.role === 'admin' ||
      res.locals.authUser.role === 'clinicAdmin' ||
      (res.locals.authUser.role === 'assistant' &&
        res.locals.authUser.id === req.params.id)
    ) {
      const assistant = await assistantInstance.show(req.params.id);
      res.status(200).json({ assistant });
    } else {
      res
        .status(401)
        .json({ message: 'You are Unauthorized to do this action' });
    }
  } catch (error) {
    next(error);
  }
};

const updateAssistant = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    validate(req);
    if (
      res.locals.authUser.role === 'admin' ||
      res.locals.authUser.role === 'clinicAdmin'
    ) {
      delete req.body.password;
      const assistant = await assistantInstance.update(req.params.id, req.body);
      res.status(200).json({ assistant });
    } else {
      res
        .status(401)
        .json({ message: 'You are Unauthorized to do this action' });
    }
  } catch (error) {
    next(error);
  }
};

const removeAssistant = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    validate(req);
    if (
      res.locals.authUser.role === 'admin' ||
      res.locals.authUser.role === 'clinicAdmin'
    ) {
      await assistantInstance.delete(req.params.id);
      res.status(200).json({ message: 'Assistant deleted successfully' });
    } else {
      res
        .status(401)
        .json({ message: 'You are Unauthorized to do this action' });
    }
  } catch (error) {
    next(error);
  }
};

const showAssistantsClinic = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    validate(req);
    if (
      res.locals.authUser.role === 'admin' ||
      res.locals.authUser.role === 'clinicAdmin'
    ) {
      const assistantsClinic = await assistantInstance.showAssistantsClinic(
        req.params.id
      );
      res.status(200).json({ assistantsClinic });
    } else {
      res
        .status(401)
        .json({ message: 'You are Unauthorized to do this action' });
    }
  } catch (error) {
    next(error);
  }
};
const updatePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    validate(req);
    if (
      res.locals.authUser.role === 'assistant' &&
      res.locals.authUser.id === req.params.id
    ) {
      const oldPassword = req.body.oldPassword;
      const newPassword = req.body.newPassword;
      const correctPassword = await assistantInstance.findByPassword(
        req.params.id,
        oldPassword
      );
      if (correctPassword) {
        const assistant: AssistantType = await assistantInstance.updatePassword(
          req.params.id,
          newPassword
        );
        res.status(200).json({ assistant });
      } else {
        res.status(401).json({ message: 'Invalid credentials for password' });
      }
    } else {
      res
        .status(403)
        .send({ message: 'You are Unauthorized to update password' });
    }
  } catch (error) {
    next(error);
  }
};

const assistantRouter = (app: Application) => {
  app.get('/assistants', verifyAuthToken, getAllAssistants);
  app.get('/assistants/:id', isValidIdParam, verifyAuthToken, showAssistant);
  app.get(
    '/assistants/clinic/:id',
    isValidIdParam,
    verifyAuthToken,
    showAssistantsClinic
  );
  app.post('/assistants/create', validateCreation, createAssistant);
  app.post('/assistants/login', login);
  app.patch(
    '/assistants/update/:id',
    isValidIdParam,
    validateUpdate,
    verifyAuthToken,
    updateAssistant
  );
  app.patch(
    '/assistants/:id/password',
    isValidIdParam,
    validatePassword,
    verifyAuthToken,
    updatePassword
  );
  app.delete(
    '/assistants/:id',
    isValidIdParam,
    verifyAuthToken,
    removeAssistant
  );
};

export default assistantRouter;
