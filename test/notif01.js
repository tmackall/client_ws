'use strict';
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
let randomstring = require('randomstring');
let testLib = require('../lib/test_lib');

// logger
let logger = testLib.logger;

chai.use(chaiHttp);

let server = testLib.serverNotif;
logger.debug(server);

let endPoint = '/notification/state';

describe(endPoint, function() {
  beforeEach(function(done) {
    done();     
  });

  // get
  describe('GET', function() {
    it('should return 200 OK', function(done) {
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
  let vals = ['on', 'off', 'ON', 'oFF', 'on', 'on', 'off', 'off'];
  vals.forEach(function(val) {
    describe('POST - \'' + val + '\'', function() {
      it('should return 200 OK', function(done) {
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
    describe('GET - \'' + val + '\'', function() {
      it('should return 200 (OK)', function(done) {
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
    describe('POST - \'' + val + '\'', function() {
      it('should return 400 (Bad Request)', function(done) {
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
  describe('POST - undefined param', function() {
    it('should return 400 (Bad Request)', function(done) {
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
  describe('POST - bad endpoint', function() {
    let val = 'on';
    let tstEndPt = endPoint + randomstring.generate(5);
    it('should return 404 (Not Found)', function(done) {
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
