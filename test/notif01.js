'use strict';
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
const winston = require('winston');
const randomstring = require('randomstring');

const LL = process.env.LL || process.env.npm_package_config_ll || 'warning';

// logger
const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({'timestamp':true, level: LL})
   ]
});

chai.use(chaiHttp);

let server = process.env.SERVER || process.env.npm_package_config_server || 'http://192.168.0.21';
let port = process.env.PORT || process.env.npm_package_config_port || '3005';

server += ':' + port;
logger.debug(server);

let endPoint = '/notification/state';

describe(endPoint, () => {
  beforeEach((done) => {
    done();     
  });

  // get
  describe('GET', () => {
    it('should return 200 OK', (done) => {
    chai.request(server)
      .get(endPoint)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('state');
        done();
      });
    });
  });

  // post - success
  let vals = ['on', 'off', 'ON', 'oFF'];
  vals.forEach(function(val) {
    describe('POST - \'' + val + '\'', () => {
      it('should return 200 OK', (done) => {
      chai.request(server)
        .post(endPoint)
        .query({state: val})
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('state');
          res.body.state.should.be.eql(val.toLowerCase());
          done();
        });
      });
    });
  
    // get - success
    describe('GET - \'' + val + '\'', () => {
      it('should return 200 (OK)', (done) => {
      chai.request(server)
        .get(endPoint)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('state');
          res.body.state.should.be.eql(val.toLowerCase());
          done();
        });
      });
    });
  });

  // post - failure
  vals = ['no', 'offf', 'ONN', 'oF', '1234', randomstring.generate(10)];
  vals.forEach(function(val) {
    describe('POST - \'' + val + '\'', () => {
      it('should return 400 (Bad Request)', (done) => {
      chai.request(server)
        .post(endPoint)
        .query({state: val})
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
      });
    });
  });

  // post - state undefined
  describe('POST - undefined param', () => {
    it('should return 400 (Bad Request)', (done) => {
    chai.request(server)
      .post(endPoint)
      //.query({state: val})
      .end((err, res) => {
        res.should.have.status(400);
        done();
      });
    });
  });

  // post - bad endpoint
  describe('POST - bad endpoint', () => {
    let val = 'on';
    let tstEndPt = endPoint + randomstring.generate(5);
    logger.debug('bad endpoint: ' + tstEndPt);
    it('should return 404 (Not Found)', (done) => {
    chai.request(server)
      .post(tstEndPt)
      .query({state: val})
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
    });
  });
});
