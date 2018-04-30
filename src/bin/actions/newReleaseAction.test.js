import sinon from 'sinon';
import chai from 'chai';
import sinonChai from 'sinon-chai';
import inquirer from 'inquirer';
import ChangeLog from '../utils/ChangeLog';
import newReleaseAction from './newReleaseAction';
import * as gitInteractions from '../github/gitInteractions';

chai.use(sinonChai);

describe('newReleaseAction', () => {
  let sandbox;

  beforeEach(() => (sandbox = sinon.sandbox.create()));

  afterEach(() => sandbox.restore());

  it('should log the successful action', async () => {
    // Setup.
    const consoleSpy = sandbox.spy(console, 'log');
    const userDetails = { username: 'tools', accessKey: 'hammer' };
    const releaseDetails = {
      approved: true,
      scheduled: 'today',
      freeText: 'extra details'
    };
    const repoDetails = 'tools/release';
    sandbox.stub(ChangeLog.prototype, 'create');
    sandbox.stub(gitInteractions, 'getOrgRepo').returns(repoDetails);
    sandbox.stub(gitInteractions, 'newRelease').resolves();
    sandbox.stub(inquirer, 'prompt').resolves(releaseDetails);

    // Exercise.
    await newReleaseAction(userDetails, releaseDetails);

    // Verfiy.
    consoleSpy.should.have.been.calledWith(
      `A new release has been publised! 🎉 \nGo to https://github.com/${repoDetails}/releases to see the details`
    );
  });

  it('should log the unsuccessful action', async () => {
    // Setup.
    const expectedError = new Error('Expected error');
    const errorStub = sandbox.stub(console, 'error');
    const userDetails = { username: 'tools', accessKey: 'hammer' };
    const releaseDetails = {
      approved: true,
      scheduled: 'today',
      freeText: 'extra details'
    };
    const repoDetails = 'tools/release';
    sandbox.stub(ChangeLog.prototype, 'create');
    sandbox.stub(gitInteractions, 'getOrgRepo').returns(repoDetails);
    sandbox.stub(gitInteractions, 'newRelease').throws(expectedError);
    sandbox.stub(inquirer, 'prompt').resolves(releaseDetails);

    // Exercise.
    await newReleaseAction(userDetails, releaseDetails);

    // Verfiy.
    errorStub.should.have.been.calledWith('Failed to create a new release: ', expectedError);
  });
});
