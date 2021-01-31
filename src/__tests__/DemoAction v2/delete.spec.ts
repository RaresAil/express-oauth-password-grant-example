import chai, { expect } from 'chai';

import { DeleteDemoResponse } from '../@types/app';

const { app } = global._testEnv;

describe('DELETE /api/v2/demo/:id', () => {
  let response: ChaiHttp.Response;
  const id = '12345678';

  before((done) => {
    chai
      .request(app)
      .delete(`/api/v2/demo/${id}`)
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

    const body: DeleteDemoResponse = response.body;

    expect(response.status).to.be.equal(200);
    expect(body).to.not.be.equal(undefined);
    expect(body).to.not.be.equal(null);
    expect(body.success).to.be.equal(true);
    done();
  });

  it(`Id should be ${id}`, (done) => {
    expect(response).not.be.equal(undefined);

    const body: DeleteDemoResponse = response.body;

    expect(body).to.not.be.equal(undefined);
    expect(body).to.not.be.equal(null);
    expect(body.id).to.be.equal(id);
    done();
  });
});
