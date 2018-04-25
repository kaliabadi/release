import sinon from 'sinon';
import chai from 'chai';
import sinonChai from 'sinon-chai';
import remoteOriginUrl from 'remote-origin-url';
import gitTags from 'git-tags';
import {
  latestRelease,
  newRelease,
  updateRelease
} from './gitInteractions';
import GithubApi from './api/GithubApi';
import File from '../utils/File';

chai.use(sinonChai);

describe('gitInteractions', () => {
  const userDetails = {
    username: 'tools',
    accessToken: 'hammer'
  };
  const orgRepo = 'newsuk/release';
  var sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    sandbox
      .stub(remoteOriginUrl, 'sync')
      .returns(`git@github.com:${orgRepo}.git`);
  });

  afterEach(() => sandbox.restore());

  describe('latestRelease', () => {
    it('should return the latest release', async () => {
      const expectedVersion = 'v1.0.0';
      const apiStub = sandbox
        .stub(GithubApi.prototype, 'latestRelease')
        .resolves(expectedVersion);

      const releaseVersion = await latestRelease(userDetails);

      releaseVersion.should.equal(expectedVersion);
      apiStub.should.have.been.calledWith(orgRepo);
    });
  });

  describe('newRelease', () => {
    it('should release a new version', async () => {
      // Setup.
      const approved = true;
      const scheduled = '20th April 2018';
      const expectedTag = '1.2.3';
      const freeText = '';
      const changeLog = 'I am a change log file.';
      const prerelease = !approved;
      const expectedApiReleaseDetails = {
        tag_name: expectedTag,
        target_commitish: 'master',
        name: expectedTag,
        draft: false,
        prerelease,
        body: `Release is scheduled for: ${scheduled}\n\n` +
                    `This release has been approved by the PO: ${approved}\n\n` +
                    'Additonal release notes: N/A\n\n'+
                    '------------------------------------------------------------------------------------\n\n' +
                    `${changeLog}`
      };

      const expectedNewReleaseResponse = {
        author: {
          login: 'tools'
        },
        prerelease,
        body: 'I am a release body containing release info.'
      };

      sandbox.stub(File.prototype, 'asString').get(() => changeLog);
      sandbox.stub(gitTags, 'get').callsArgWith(0, null, [expectedTag]);
      const newReleaseStub = sandbox
        .stub(GithubApi.prototype, 'newRelease')
        .resolves(expectedNewReleaseResponse);

      // Exercise.
      const newReleaseResponse = await newRelease(userDetails, {
        approved,
        scheduled,
        freeText
      });

      // Verify.
      newReleaseStub.should.have.been.calledWith(
        orgRepo,
        expectedApiReleaseDetails
      );

      newReleaseResponse.should.equal(expectedNewReleaseResponse);
    });

    it('should throw an error if no change log is found', async () => {
      // Setup.
      const approved = true;
      const scheduled = '20th April 2018';
      const expectedTag = '1.2.3';
      const changeLog = undefined;

      sandbox.stub(File.prototype, 'asString').get(() => changeLog);
      sandbox.stub(gitTags, 'get').callsArgWith(0, null, [expectedTag]);

      // Exercise.
      let expectedError = undefined;
      try {
        await newRelease(userDetails, {
          approved,
          scheduled
        });
      } catch (err) {
        expectedError = err;
      }

      expectedError.should.be.an('Error');
    });
  });

  describe('updateRelease', () => {
    it('should update a release with a changelog', async () => {
      // Setup.
      const expectedVersion = 'v1.0.5';
      const approved = true;
      const scheduled = '20th April 2018';
      const changeLog = 'I am a change log file.';
      const prerelease = !approved;
      const expectedTaggedRelease = 101101;
      const expectedUpdateResponse = {
        author: {
          login: 'tools'
        },
        prerelease,
        body: 'I am a release body containing release info.'
      };

      sandbox.stub(File.prototype, 'asString').get(() => changeLog);
      const taggedReleaseStub = sandbox
        .stub(GithubApi.prototype, 'taggedRelease')
        .resolves({
          id: expectedTaggedRelease
        });
      const updateReleaseStub = sandbox
        .stub(GithubApi.prototype, 'updateRelease')
        .resolves(expectedUpdateResponse);

      // Exercise.
      const updateResponse = await updateRelease(userDetails, expectedVersion, {
        approved,
        scheduled
      });

      // Verify.
      updateReleaseStub.should.have.been.calledWith(orgRepo, expectedTaggedRelease);
      taggedReleaseStub.should.have.been.calledWith(orgRepo, expectedVersion);
      updateResponse.should.equal(expectedUpdateResponse);
    });

    it('should update a release without a changelog', async () => {
      // Setup.
      const expectedVersion = 'v1.0.5';
      const approved = true;
      const prerelease = !approved;
      const expectedTaggedRelease = 101101;
      const changelog = undefined;

      const expectedUpdateResponse = {
        author: {
          login: 'tools'
        },
        prerelease
      };

      sandbox.stub(File.prototype, 'asString').get(() => changelog);
      const taggedReleaseStub = sandbox
        .stub(GithubApi.prototype, 'taggedRelease')
        .resolves({
          id: expectedTaggedRelease
        });
      const updateReleaseStub = sandbox
        .stub(GithubApi.prototype, 'updateRelease')
        .resolves(expectedUpdateResponse);

      // Exercise.
      const updateResponse = await updateRelease(userDetails, expectedVersion, approved);

      // Verify.
      taggedReleaseStub.should.have.been.calledWith(orgRepo, expectedVersion);
      updateReleaseStub.should.have.been.calledWith(
        orgRepo,
        expectedTaggedRelease
      );
      updateResponse.should.equal(expectedUpdateResponse);
    });

    it('should throw an error if no tagged release was found', async () => {
      // Setup.
      const expectedVersion = 'v1.0.5';
      const approved = true;
      const scheduled = '20th April 2018';
      const changeLog = 'I am a change log file.';

      sandbox.stub(File.prototype, 'asString').get(() => changeLog);
      sandbox.stub(GithubApi.prototype, 'taggedRelease').returns('');

      // Exercise.
      let expectedError = undefined;
      try {
        await updateRelease(userDetails, expectedVersion, {
          approved,
          scheduled
        });
      } catch (err) {
        expectedError = err;
      }

      expectedError.should.be.an('Error');
    });
  });
});
