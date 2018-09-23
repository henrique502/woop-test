const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../src/app');

chai.should();
chai.use(chaiHttp);

let temp_session_id = null;

describe('API Routes Session', () => {
  describe('POST /session', () => {
    it('should create new session', (done) => {
      chai.request(server)
        .post('/session')
        .send({
          name: 'test chai',
          minutes: 2,
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.have.property('data');
          res.body.data.should.be.a('object');
          res.body.should.have.property('success');
          res.body.success.should.equal(true);

          res.body.data.should.have.property('session_id');
          temp_session_id = res.body.data.session_id;
          done();
        });
    });
  });

  describe('POST /session/:session_id/vote', () => {
    it('should vote', (done) => {
      chai.request(server)
        .post(`/session/${temp_session_id}/vote`)
        .send({
          associate_id: 1,
          option: 'YES',
        })
        .end((err, res) => {
          res.should.have.status(204);
          done();
        });
    });
  });

  describe('GET /session/:session_id', () => {
    it('should session data', (done) => {
      chai.request(server)
        .get(`/session/${temp_session_id}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.have.property('data');
          res.body.data.should.be.a('object');
          res.body.should.have.property('success');
          res.body.success.should.equal(true);

          res.body.data.should.have.property('name');
          res.body.data.should.have.property('active');
          res.body.data.should.have.property('end_at');
          res.body.data.should.have.property('start_at');
          res.body.data.should.have.property('resume');

          res.body.data.resume.should.be.a('object');
          res.body.data.resume.should.have.property('result');
          res.body.data.resume.should.have.property('yes');
          res.body.data.resume.should.have.property('no');

          res.body.data.should.have.property('votes');
          res.body.data.votes.should.be.a('array');
          res.body.data.votes[0].should.be.a('object');
          res.body.data.votes[0].should.have.property('name');
          res.body.data.votes[0].should.have.property('option');

          done();
        });
    });
  });
});
