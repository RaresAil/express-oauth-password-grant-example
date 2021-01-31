import chai, { expect } from 'chai';

import { PostDemoResponse } from '../@types/app';

const { app } = global._testEnv;

describe('POST /api/v2/demo', () => {
  let response: ChaiHttp.Response;

  before((done) => {
    chai
      .request(app)
      .post('/api/v2/demo')
      .then((res) => {
        response = res;
        done();
      })
      .catch((error) => {
        return done(error);
      });
  });

  it('Should be successfully', (done) => {
    expect(response).not.be.equal(undefined);

    const body: PostDemoResponse = response.body;

    expect(response.status).to.be.equal(201);
    expect(body).to.not.be.equal(undefined);
    expect(body).to.not.be.equal(null);
    expect(body.success).to.be.equal(true);
    done();
  });

  it('Data from domain should be valid', (done) => {
    expect(response).not.be.equal(undefined);

    const body: PostDemoResponse = response.body;

    expect(body).to.not.be.equal(undefined);
    expect(body).to.not.be.equal(null);
    expect(body.data).to.be.equal('Data from database');
    expect(body.someParameter).to.be.equal('parameter from action');
    done();
  });
});
