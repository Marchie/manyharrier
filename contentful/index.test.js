'use strict';

const {expect} = require('chai');
const {stub} = require('sinon');
const proxyquire = require('proxyquire');

const contentful = require('contentful');

describe('Contentful client', () => {
  let config;
  let contentfulMethods;
  let createClient;
  let logger;
  let logHandler;
  let sut;

  before(() => {
    config = {
      get: stub()
    };

    config.get.withArgs('contentful:accessToken').returns('access-token');
    config.get.withArgs('contentful:host').returns('host');
    config.get.withArgs('contentful:spaceId').returns('space-id');

    contentfulMethods = {
      getEntries: 'foo'
    };

    createClient = stub(contentful, 'createClient');

    createClient.returns(contentfulMethods);

    logger = {
      log: 'instance'
    };

    logHandler = stub().returns('log-handler');

    sut = proxyquire('./index', {
      './log-handler': logHandler
    });
  });

  afterEach(() => {
    config.get.resetHistory();
    createClient.resetHistory();
    logHandler.resetHistory();
  });

  after(() => {
    createClient.restore();
  });

  it('should instantiate a Contentful client with config options', () => {
    sut(config, logger);
    expect(createClient.calledOnce).to.equal(true);
    expect(createClient.firstCall.args[0]).to.eql({
      accessToken: 'access-token',
      host: 'host',
      logHandler: 'log-handler',
      space: 'space-id'
    });
  });

  it('should create a log handler', () => {
    sut(config, logger);
    expect(logHandler.calledOnce).to.equal(true);
    expect(logHandler.firstCall.args[0]).to.eql(logger);
  });

  it('should return the Contentful methods', () => {
    expect(sut(config, logger)).to.eql(contentfulMethods);
  });
});
