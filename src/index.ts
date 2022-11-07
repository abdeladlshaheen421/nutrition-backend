import express, {
  Request,
  Response,
  NextFunction,
  ErrorRequestHandler,
} from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import clinicRouter from './routers/clinic.router';
import clientRouter from './routers/client.router';
import assistantRouter from './routers/assistant.router';
import clinicAdminRouter from './routers/clinicadmin.router';
import doctorRouter from './routers/doctor.router';
import bodyParser from 'body-parser';
import reservationRouter from './routers/reservation.router';
import dashboardRouter from './routers/dashboard.router';

dotenv.config();
const { SERVER_PORT, DATABASE_CONNECTION } = process.env;

const app: express.Application = express();
const PORT = SERVER_PORT || 8080;

mongoose
  .connect(DATABASE_CONNECTION as string)
  .then(() => {
    console.log('Connecting to DB ...');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT} ...`);
    });
  })
  .catch((error) => {
    console.log(error + '');
  });

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use('/static', express.static(`${__dirname}/assets`));
// home page
app.get('/', (req: express.Request, res: express.Response): void => {
  res.status(200).json({ welcomeMessage: 'Welcome To Our Nutrition System' });
});

// dashboard routers
dashboardRouter(app);

// clinic routers
clinicRouter(app);

// client routers
clientRouter(app);

// Assistant Router
assistantRouter(app);

// reservation Router
reservationRouter(app);

// clinic admin routers
clinicAdminRouter(app);

// Doctor router
doctorRouter(app);

// Not Found Handler
app.use((req: Request, res: Response, next: NextFunction): Response => {
  return res.status(404).json({ error: 'Route is Not Found' });
});

// Error Handler
app.use(
  (
    error: ErrorRequestHandler,
    req: Request,
    res: Response,
    next: NextFunction
  ): Response => {
    return res.status(500).json({ error: error + ' ' });
    // return res.status(500).json({ error: 'Internal server error' }); //deployment Catch Error
  }
);

export default app;
