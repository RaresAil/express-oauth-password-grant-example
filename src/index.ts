import { InjectType } from 'adr-express-ts/lib/@types';
import { Injector, Router } from 'adr-express-ts';
import bodyParser from 'body-parser';
import Express from 'express';

import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import Server from './app/Server';

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
  [morgan('dev'), cookieParser('SECRET'), bodyParser.json()],
  InjectType.Variable
);

Injector.inject('Express', expressApp, InjectType.Variable);

Injector.inject('Server', Server);
Injector.inject('Router', Router);

Injector.ready();

export default expressApp;
