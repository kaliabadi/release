import sinon from "sinon";
import chai from "chai";
import sinonChai from "sinon-chai";
import latestReleaseAction from './latestReleaseAction';
import * as gitInteractions from '../github/gitInteractions';

chai.use(sinonChai);

describe('latestReleaseAction', () => {

    let sandbox;

    beforeEach(() => sandbox = sinon.sandbox.create());

    afterEach(() => sandbox.restore());

    it('should log the successful action', async () => {
        // Setup.
        const consoleSpy = sandbox.spy(console, 'log');
        const userDetails = {username: 'tools', accessKey: 'hammer'};
        const repoDetails = 'tools/release';
        const expectedVersionName = '1.2.3';
        sandbox.stub(gitInteractions, 'getOrgRepo').returns(repoDetails);
        sandbox.stub(gitInteractions, 'latestRelease').resolves({name: expectedVersionName});
        
        // Exercise.
        await latestReleaseAction(userDetails);

        // Verfiy.
        consoleSpy.should.have.been.calledWith(`The latest release version for ${repoDetails} is ${expectedVersionName}`);
    });

    it('should log the unsuccessful action', async () => {
        // Setup.
        const errorStub = sandbox.spy(console, 'error');        
        const userDetails = {username: 'tools', accessKey: 'hammer'};
        const expectedError = 'An error occurred.';
        sandbox.stub(gitInteractions, 'getOrgRepo').returns('tools/release');
        sandbox.stub(gitInteractions, 'latestRelease').resolves({error: expectedError});
        
        // Exercise.
        await latestReleaseAction(userDetails);

        // Verfiy.
        errorStub.should.have.been.calledWith('Failed to get the latest release version', expectedError);
    });

});
