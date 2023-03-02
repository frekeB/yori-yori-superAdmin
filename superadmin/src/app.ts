import express, { Application, Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import {countryRoutes, adminRoutes, settingsRoutes, franchiseRoutes, dispatcherRoutes, authRoutes, userRoutes} from './routes'
import { errHandler } from './exceptions';
import { Channel } from "amqplib";
import {boundChannel} from "./middlewares";



export default async (app: Application, channel: Channel) => {
  if (process.env.ENV === "dev") app.use(morgan("dev"));
  app.use(cors());
  app.use(helmet());
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(compression());

  app.use(boundChannel(channel))
  
  app.use('/admin', adminRoutes)
  app.use('/logistics/country', countryRoutes)
  app.use('/logistics/franchise', franchiseRoutes)
  app.use('/logistics/dispatcher', dispatcherRoutes)
  app.use('/settings', settingsRoutes)
  app.use('/global/auth', authRoutes)
  app.use('/users', userRoutes)
  
  
  // catch 404 and forward to error handler
  app.all("*", function (req: Request, res: Response): Response {
    return res.sendStatus(404);
  });
  
  app.use(errHandler)
}




