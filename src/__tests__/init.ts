import chaiHttp from 'chai-http';
import mocha from 'mocha';
import chai from 'chai';

import app from '../index';

chai.use(chaiHttp);

declare global {
  namespace NodeJS {
    interface Global {
      _testEnv: {
        // declare global variables for tests
        app: typeof app;
      };
    }
  }
}

global._testEnv = {
  app
};

// Wait for the app to finish
let isAppReady = false;
app.on('ready', () => {
  isAppReady = true;
});

mocha.before((done) => {
  if (isAppReady) {
    return done();
  }

  app.on('ready', () => {
    done();
  });
});
