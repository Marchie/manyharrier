'use strict';

const {expect} = require('chai');
const {stub} = require('sinon');

describe('Contentful log handler', () => {
  let sut;

  before(() => {
    sut = require('./log-handler');
  });

  it('should return a function', () => {
    expect(sut()).to.be.an.instanceOf(Function);
  });

  describe('returned log handler function', () => {
    let error;
    let logger;

    before(() => {
      error = new Error('FUBAR');

      logger = {
        error: stub(),
        warn: stub()
      };

      sut = require('./log-handler')(logger);
    });

    afterEach(() => {
      logger.error.resetHistory();
      logger.warn.resetHistory();
    });

    it('should call the appropriate logger level with error data', () => {
      sut('error', error);
      expect(logger.error.calledOnce).to.equal(true);
      expect(logger.error.firstCall.args[0]).to.eql(error);
    });

    it('should translate a "warning" to call the "warn" logger level', () => {
      sut('warning', error);
      expect(logger.warn.calledOnce).to.equal(true);
      expect(logger.warn.firstCall.args[0]).to.eql(error);
    });
  });
});
