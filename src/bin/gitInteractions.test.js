import sinon from 'sinon';
import chai from 'chai';
import sinonChai from 'sinon-chai';
import remoteOriginUrl from 'remote-origin-url';
import {latestRelease, updateRelease } from './gitInteractions';
import GithubApi from './api/GithubApi';
import File from './utils/File';

chai.use(sinonChai);

describe('gitInteractions', () => {

    const userDetails = { username: 'tools', accessToken: 'hammer'};
    const orgRepo = 'newsuk/release';
    var sandbox;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        sandbox.stub(remoteOriginUrl, 'sync').returns(`git@github.com:${orgRepo}.git`);
    });

    afterEach(() => sandbox.restore());

    describe('latestRelease', () => {

        it('should return the latest release', async () => {
            const expectedVersion = 'v1.0.0';
            const apiStub = sandbox.stub(GithubApi.prototype, 'latestRelease').resolves(expectedVersion);

            const releaseVersion = await latestRelease(userDetails);

            releaseVersion.should.equal(expectedVersion);
            apiStub.should.have.been.calledWith(orgRepo);
        });

    });

    describe('updateRelease', () => {

        it('should update a release with a changelog', async () => {
            // Setup.
            const expectedVersion = 'v1.0.5';
            const approved = true;
            const scheduled = '20th April 2018';
            const changeLog = "I am a change log file." 
            const prerelease = !approved;
            const expectedTaggedRelease = 101101;
            const expectedApiReleaseDetails = {
                prerelease: false,
                body: `${scheduled}\n\n` + 
                `This release has been approved by the PO: ${approved}\n\n` + 
                '------------------------------------------------------------------------------------\n\n' + 
                `${changeLog}`
            }
            const expectedUpdateResponse = {
                author: {
                    login: 'tools',
                },
                prerelease,
                body:  'I am a release body containing release info.'
            };

            sandbox.stub(File.prototype, 'asString').get(() => changeLog);            
            const taggedReleaseStub = sandbox.stub(GithubApi.prototype, 'taggedRelease').resolves({id: expectedTaggedRelease});
            const updateReleaseStub = sandbox.stub(GithubApi.prototype, 'updateRelease').resolves(expectedUpdateResponse);

            // Exercise.
            const updateResponse = await updateRelease(userDetails, expectedVersion, {approved, scheduled});

            // Verify.
            taggedReleaseStub.should.have.been.calledWith(orgRepo, expectedVersion);
            updateReleaseStub.should.have.been.calledWithMatch(orgRepo, expectedTaggedRelease, expectedApiReleaseDetails); 
            updateResponse.should.equal(expectedUpdateResponse);
        });

    });

});
