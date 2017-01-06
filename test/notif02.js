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

let endPoint = '/notification';

describe(endPoint, function() {
  before(function(done) {
    logger.debug('before');
    done();     
  });

  beforeEach(function(done) {
    logger.debug('beforeEach');
    testLib.setState('on', function(err, res) {
      done(err);
    });
  });

  afterEach(function(done) {
    logger.debug('afterEach');
    testLib.setState('off', function(err, res) {
      done(err);
    });
  });

  describe('POST', function() {
    it('should return 200 OK', function(done) {
    chai.request(server)
      .post(endPoint)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('state');
        res.body.state.should.be.eql('on');
        done();
      });
    });
  });
  
  describe('PUT', function() {
    it('should return 200 OK', function(done) {
    chai.request(server)
      .put(endPoint)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('state');
        res.body.state.should.be.eql('on');
        done();
      });
    });
  });
  
  describe('DELETE', function() {
    it('should return 200 OK', function(done) {
    chai.request(server)
      .delete(endPoint)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('state');
        res.body.state.should.be.eql('on');
        done();
      });
    });
  });
  
  // bad endpoint
  describe('PUT (bad endpoint)', function() {
    it('should return 404 OK', function(done) {
    chai.request(server)
      .put(endPoint + 'n')
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
    });
  });
  
});
