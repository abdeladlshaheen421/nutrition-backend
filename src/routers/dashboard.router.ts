import { Application, Request, Response } from 'express';
import { Role } from '../controllers/client.controller';

const login = async (req: Request, res: Response) => {
  const { role } = req.body;
  // clinic admin
  if (role === Role.CLINIC_ADMIN) {
    res.redirect('/clinic-admins/login');
    // doctor
  } else if (role === Role.DOCTOR) {
    res.redirect('/doctors/login');
    // assistant
  } else if (role === Role.ASSISTANT) {
    res.redirect('/assistants/login');
  }
};

const dashboardRouter = (app: Application) => {
  app.get('/dashboard/login', login);
};

export default dashboardRouter;
