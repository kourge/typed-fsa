import {expect} from 'chai';
import {isAction, isError, AnyAction} from './index';

const error = new Error('bar');

describe('isAction', () => {
  it('returns false when given undefined', () => {
    expect(isAction(undefined)).to.be.false;
  });

  it('returns false when given an object with no type', () => {
    expect(isAction({} as AnyAction)).to.be.false;
  });

  it('returns true when given an object with a type', () => {
    expect(isAction({
      type: 'foo'
    })).to.be.true;
  });

  it('returns false when given an object with an unknown key', () => {
    expect(isAction({
      type: 'foo',
      unexpected: 1
    })).to.be.false;
  });

  it('returns true when given an action with a payload', () => {
    expect(isAction({
      type: 'foo',
      payload: 42
    })).to.be.true;
  });

  it('returns true when given an action with an error', () => {
    expect(isAction({
      type: 'foo',
      error: true,
      payload: error
    })).to.be.true;
  });

  it('returns true when given an action with an error', () => {
    expect(isAction({
      type: 'foo',
      meta: 'bar'
    })).to.be.true;
  });
});

describe('isError', () => {
  it('returns false when error is missing', () => {
    expect(isError({
      type: 'foo',
      payload: undefined
    })).to.be.false;
  });

  it('returns false when error is undefined', () => {
    expect(isError({
      type: 'foo',
      payload: undefined,
      error: undefined
    })).to.be.false;
  });

  it('returns false when error is false', () => {
    expect(isError({
      type: 'foo',
      payload: undefined,
      error: false
    })).to.be.false;
  });

  it('returns true when error is true', () => {
    expect(isError({
      type: 'foo',
      payload: error,
      error: true
    })).to.be.true;
  });
});
