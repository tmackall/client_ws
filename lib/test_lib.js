'use strict';
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
let winston = require('winston');
let randomstring = require('randomstring');

let hostDefault = 'http://192.168.0.21';
let hostNotif = process.env.HOST_NOTIF || process.env.npm_package_host_notif || hostDefault;
let portNotif = process.env.PORT_NOTIF || process.env.npm_package_config_port_notif || '3005';
let serverNotif = hostNotif + ':' + portNotif;

module.exports.serverNotif = serverNotif;
module.exports.portNotif = portNotif;


// logger
let LL = process.env.LL || process.env.npm_package_config_ll || 'warning';
let logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({'timestamp':true, level: LL})
  ]
});
module.exports.logger = logger;

let endpointState = '/notification/state';
//------------------------------------------
//
// setState()
//  - logger object used by all tests.
//
//------------------------------------------
let setState = function(state, callback) {
  logger.debug('requested state: ' + state);
  chai.request(serverNotif)
    .post(endpointState)
    .query({state: state})
    .end((err, res) => {
      if (err) return callback(err);
      res.should.have.status(200);
      res.body.should.have.property('state');
      res.body.state.should.be.eql(state.toLowerCase());
      callback(null);
  });
}

module.exports.setState = setState;
