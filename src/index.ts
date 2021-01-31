import { InjectType } from 'adr-express-ts/lib/@types';
import { Injector, Router } from 'adr-express-ts';
import bodyParser from 'body-parser';
import Express from 'express';
import dotenv from 'dotenv';

import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import Server from './app/Server';

import PasswordGrant from './auth/PasswordGrant';
import authConfig from './auth/config.json';

dotenv.config(); // Load the .env file

const expressApp = Express();

Injector.setup({
  rootFile: __filename,
  apiPrefix: '/api',
  debug: {
    log: console.log,
    error: console.error
  }
});

Injector.inject(
  'Middlewares',
  [
    morgan('dev'),
    cookieParser(authConfig.cookieSecret),
    bodyParser.json(),
    bodyParser.urlencoded({
      extended: false
    })
  ],
  InjectType.Variable
);

Injector.inject('Express', expressApp, InjectType.Variable);

// Inject the PasswordGrant class
Injector.inject('PasswordGrant', PasswordGrant);

Injector.inject('Server', Server);
Injector.inject('Router', Router);

Injector.ready();

export default expressApp;
