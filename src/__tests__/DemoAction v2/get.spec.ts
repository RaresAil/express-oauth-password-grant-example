import chai, { expect } from 'chai';

import { GetDemoResponse } from '../@types/app';

const { app } = global._testEnv;

describe('GET /api/v2/demo/demo1', () => {
  let response: ChaiHttp.Response;

  before(async () => {
    response = await chai.request(app).get('/api/v2/demo/demo1');
  });

  it('Should be successfully', async () => {
    expect(response).not.be.equal(undefined);

    const body: GetDemoResponse = response.body;

    expect(response.status).to.be.equal(200);
    expect(body).to.not.be.equal(undefined);
    expect(body).to.not.be.equal(null);
    expect(body.success).to.be.equal(true);
  });

  it('Data from middleware should be defined', async () => {
    expect(response).not.be.equal(undefined);

    const body: GetDemoResponse = response.body;

    expect(body).to.not.be.equal(undefined);
    expect(body).to.not.be.equal(null);
    expect(body.test).to.be.equal('My custom request data!');
  });

  it('Check if @next is working', async () => {
    const { body, status } = await chai.request(app).get('/api/demo');

    expect(body).to.not.be.equal(undefined);
    expect(body).to.not.be.equal(null);
    expect(status).to.be.equal(500);
    expect(body).to.be.deep.equal({
      success: false,
      message: 'Internal Server Error'
    });
  });
});
