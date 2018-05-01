import sinon from 'sinon';
import chai from 'chai';
import sinonChai from 'sinon-chai';
import inquirer from 'inquirer';
import gitTags from 'git-tags';
import updateReleaseAction from './updateReleaseAction';
import * as gitInteractions from '../github/gitInteractions';

chai.use(sinonChai);

describe('updateReleaseAction', () => {
  let sandbox;

  beforeEach(() => (sandbox = sinon.sandbox.create()));

  afterEach(() => sandbox.restore());

  it('should log the successful action when updating a specific version', async () => {
    // Setup.
    const consoleSpy = sandbox.spy(console, 'log');
    const userDetails = { username: 'tools', accessKey: 'hammer' };
    const releaseDetails = {
      approved: true,
      scheduled: 'today',
      freeText: 'extra details'
    };
    const repoDetails = 'tools/release';
    const releaseVersion = '1.2.3';
    sandbox.stub(gitInteractions, 'getOrgRepo').returns(repoDetails);
    sandbox.stub(gitInteractions, 'taggedRelease').resolves();
    sandbox
      .stub(gitInteractions, 'updateRelease')
      .resolves({ name: releaseVersion });
    sandbox.stub(inquirer, 'prompt').resolves(releaseDetails);

    // Exercise.
    await updateReleaseAction(
      userDetails,
      releaseVersion,
      releaseDetails
    );

    // Verfiy.
    consoleSpy.should.have.been.calledWith(
      `The release notes for ${releaseVersion} have been updated! \n` +
        `You can see the new release notes here: https://github.com/${repoDetails}/releases`
    );
  });

  it('should log the successful action when updating the latest version', async () => {
    // Setup.
    const consoleSpy = sandbox.spy(console, 'log');
    const userDetails = { username: 'tools', accessKey: 'hammer' };
    const releaseDetails = {
      approved: true,
      scheduled: 'today',
      freeText: 'extra details'
    };
    const repoDetails = 'tools/release';
    const releaseVersion = '1.2.3';
    sandbox.stub(gitInteractions, 'getOrgRepo').returns(repoDetails);
    sandbox.stub(gitInteractions, 'taggedRelease').resolves();
    sandbox.stub(gitTags, 'get').callsArgWith(0, null, [releaseVersion]);
    sandbox
      .stub(gitInteractions, 'updateRelease')
      .resolves({ name: releaseVersion });
    sandbox.stub(inquirer, 'prompt').resolves(releaseDetails);

    // Exercise.
    await updateReleaseAction(
      userDetails,
      undefined,
      releaseDetails
    );

    // Verfiy.
    consoleSpy.should.have.been.calledWith(
      `The release notes for ${releaseVersion} have been updated! \n` +
        `You can see the new release notes here: https://github.com/${repoDetails}/releases`
    );
  });

  it('should log the unsuccessful action', async () => {
    // Setup.
    const expectedError = new Error('Expected error');
    const errorStub = sandbox.stub(console, 'error');
    const userDetails = { username: 'tools', accessKey: 'hammer' };
    const releaseVersion = '1.2.3';
    const releaseDetails = {
      approved: true,
      scheduled: 'today',
      freeText: 'extra details'
    };
    const repoDetails = 'tools/release';
    sandbox.stub(gitInteractions, 'getOrgRepo').returns(repoDetails);
    sandbox.stub(gitInteractions, 'taggedRelease').resolves();
    sandbox.stub(gitInteractions, 'updateRelease').throws(expectedError);
    sandbox.stub(inquirer, 'prompt').resolves(releaseDetails);

    // Exercise.
    await updateReleaseAction(
      userDetails,
      releaseVersion,
      releaseDetails
    );

    // Verfiy.
    errorStub.should.have.been.calledWith(
      'Failed to update the release: ',
      expectedError
    );
  });
});
