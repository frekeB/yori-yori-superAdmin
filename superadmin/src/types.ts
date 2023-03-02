import {Request} from 'express'
import { Admin } from './interfaces';
import { Channel } from 'amqplib';

export interface RequestWithChannel extends Request {
  channel?: Channel;
}


export interface ProtectedRequest extends RequestWithChannel {
  admin?: Admin;
}

export type Event = {
  originator: string;
  destination: string;
  action: "CREATE" | "UPDATE" | "DELETE";
  resource: string;
  filter: string;
  data: object;
  token: string;
};
