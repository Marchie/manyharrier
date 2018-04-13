'use strict';

const {expect} = require('chai');
const {stub} = require('sinon');
const proxyquire = require('proxyquire');

describe('API - getAlerts', () => {
  let config;
  let contentfulClient;
  let contentfulMethods;
  let logger;
  let next;
  let req;
  let res;
  let sut;
  let validityFilter;

  before(() => {
    config = {
      config: 'config'
    };

    contentfulMethods = {
      getEntries: stub()
    };

    contentfulClient = stub().returns(contentfulMethods);

    logger = {
      logger: 'logger'
    };

    next = stub();

    req = {};

    res = {
      json: stub()
    };

    validityFilter = stub();
  });

  afterEach(() => {
    contentfulClient.resetHistory();
    contentfulMethods.getEntries.resetHistory();
    next.resetHistory();
    res.json.resetHistory();
    validityFilter.resetHistory();
  });

  describe('initialisation', () => {
    before(() => {
      sut = proxyquire('./get-alerts', {
        '../contentful': contentfulClient,
        './validity-filter': validityFilter
      });
    });

    it('should return a function', () => {
      expect(sut()).to.be.an.instanceOf(Function);
    });
  });

  describe('initialised', () => {
    before(() => {
      validityFilter.onFirstCall().returns(true);
      validityFilter.onSecondCall().returns(false);

      sut = proxyquire('./get-alerts', {
        '../contentful': contentfulClient,
        './validity-filter': validityFilter
      })(config, logger);
    });

    describe('happy path', () => {
      let contentfulResponse;

      before(() => {
        contentfulResponse = {
          items: [
            {
              fields: {
                title: 'Foo'
              }
            },
            {
              fields: {
                title: 'Bar'
              }
            }
          ]
        };

        contentfulMethods.getEntries.resolves(contentfulResponse);
      });

      it('should return a Promise', () => {
        expect(sut(req, res, next)).to.be.an.instanceOf(Promise);
      });

      it('should initialise the Contentful client', () => {
        return sut(req, res, next)
          .then(() => {
            expect(contentfulClient.calledOnce).to.equal(true);
            expect(contentfulClient.firstCall.args[0]).to.eql(config);
            expect(contentfulClient.firstCall.args[1]).to.eql(logger);
          });
      });

      it('should get alerts with the "getEntries" method on the Contentful client', () => {
        return sut(req, res, next)
          .then(() => {
            expect(contentfulMethods.getEntries.calledOnce).to.equal(true);
            expect(contentfulMethods.getEntries.firstCall.args[0]).to.eql({
              'content_type': 'alert'
            });
          });
      });

      it('should filter alerts based on validity', () => {
        return sut(req, res, next)
          .then(() => {
            expect(validityFilter.calledTwice).to.equal(true);
            expect(validityFilter.firstCall.args[0]).to.eql(contentfulResponse.items[0].fields);
            expect(validityFilter.secondCall.args[0]).to.eql(contentfulResponse.items[1].fields);
          });
      });

      it('should return the filtered alerts', () => {
        return sut(req, res, next)
          .then(() => {
            expect(res.json.calledOnce).to.equal(true);
            expect(res.json.firstCall.args[0]).to.eql([
              contentfulResponse.items[0].fields
            ]);
          });
      });
    });

    describe('sad path', () => {
      let error;

      before(() => {
        error = new Error('FUBAR');

        contentfulMethods.getEntries.rejects(error);
      });

      it('should not call res.json', () => {
        return sut(req, res, next)
          .then(() => {
            expect(res.json.notCalled).to.equal(true);
          });
      });

      it('should call next with the error', () => {
        return sut(req, res, next)
          .then(() => {
            expect(next.calledOnce).to.equal(true);
            expect(next.firstCall.args[0]).to.eql(error);
          });
      });
    });
  });
});
