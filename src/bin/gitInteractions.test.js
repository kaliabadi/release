import sinon from 'sinon';
import chai from 'chai';
import sinonChai from 'sinon-chai';
import {latestRelease} from './gitInteractions';
import GithubApi from './api/GithubApi';

chai.should();
chai.use(sinonChai);

describe('gitInteractions', () => {

    const userDetails = { username: 'tools', accessToken: 'hammer'};
    var sandbox;

    beforeEach(() => sandbox = sinon.sandbox.create());
    afterEach(() => sandbox.restore());

    describe('latestRelease', () => {

        it('should return the latest release', async () => {
            const expectedVersion = 'v1.0.0';
            const apiStub = sandbox.stub(GithubApi.prototype, 'latestRelease').resolves(expectedVersion);
            const repo = 'release';
            const org = 'newsuk';

            const releaseVersion = await latestRelease(userDetails, {repo, org});

            releaseVersion.should.equal(expectedVersion);
            apiStub.should.have.been.calledWith(org, repo);
        });

    });

});
