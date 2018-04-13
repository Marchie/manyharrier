'use strict';

const {expect} = require('chai');
const {useFakeTimers} = require('sinon');

describe('validity filter', () => {
  let clock;
  let date;
  let sut;

  before(() => {
    date = new Date(2018, 3, 13, 22, 30, 0, 0);
    clock = useFakeTimers(date);
    sut = require('./validity-filter');
  });

  after(() => {
    clock.restore();
  });

  it('should return true if there is no "validFrom" and "validUntil"', () => {
    let data = {
      title: 'Foo'
    };

    expect(sut(data)).to.equal(true);
  });

  it('should return true if there is no "validFrom" and the current time is before "validUntil"', () => {
    let data = {
      title: 'Foo',
      validUntil: '2018-04-18T00:00+01:00'
    };

    expect(sut(data)).to.equal(true);
  });

  it('should return true if the current time is after "validFrom" and there is no "validUntil"', () => {
    let data = {
      title: 'Foo',
      validFrom: '2018-04-11T00:00+01:00'
    };

    expect(sut(data)).to.equal(true);
  });

  it('should return true if the current time is between "validFrom" and "validUntil"', () => {
    let data = {
      title: 'Foo',
      validFrom: '2018-04-11T00:00+01:00',
      validUntil: '2018-04-18T00:00+01:00'
    };

    expect(sut(data)).to.equal(true);
  });

  it('should return false if the current time is before "validFrom"', () => {
    let data = {
      title: 'Foo',
      validFrom: '2018-04-18T00:00+01:00'
    };

    expect(sut(data)).to.equal(false);
  });

  it('should return false if the current time is after "validUntil"', () => {
    let data = {
      title: 'Foo',
      validUntil: '2018-04-11T00:00+01:00'
    };

    expect(sut(data)).to.equal(false);
  });
});
