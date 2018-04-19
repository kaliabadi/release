import sinon from 'sinon';
import chai from 'chai';
import sinonChai from 'sinon-chai';
import remoteOriginUrl from 'remote-origin-url';
import {latestRelease} from './gitInteractions';
import GithubApi from './api/GithubApi';

chai.use(sinonChai);

describe('gitInteractions', () => {

    const userDetails = { username: 'tools', accessToken: 'hammer'};
    const orgRepo = 'newsuk/release';
    var sandbox;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        sandbox.stub(remoteOriginUrl, 'sync')
            .returns(`git@github.com:${orgRepo}.git`);
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

});
