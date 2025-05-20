import express, { Application } from 'express';
import { setUpRoutes } from './routes/index';

const app: Application = express();

setUpRoutes(app);


export default app;