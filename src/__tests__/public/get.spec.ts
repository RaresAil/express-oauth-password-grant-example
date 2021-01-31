import chai, { expect } from 'chai';

const { app } = global._testEnv;

describe('GET /', () => {
  let response: ChaiHttp.Response;

  before((done) => {
    chai
      .request(app)
      .get('/')
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
    expect(response.status).to.be.equal(200);
    expect(response.text.indexOf('Some nice text')).to.be.greaterThan(0);
    done();
  });
});
