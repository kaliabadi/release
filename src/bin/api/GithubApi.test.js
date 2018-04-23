import sinon from "sinon";
import chai from "chai";
import sinonChai from "sinon-chai";
import request from 'superagent';
import GithubApi from './GithubApi';

chai.use(sinonChai);

describe('GithubApi', () => {

    var sandbox;
    const userDetails = {
        username: 'tools',
        accessToken: 'hammer'
    };
    const repoDetails = 'tools/release';
    const goodSendStub = (body) => sinon.stub().returns(({body}));
    const goodSetStub = (body) => sinon.stub().returns({send: goodSendStub(body)});
    const goodRequestMock = (body) => ({set: goodSetStub(body)});
    const badSendStub = sinon.stub().rejects({response: {body: 'Github Error'}});
    const badSetStub = sinon.stub().returns({send: badSendStub});
    const badRequestMock = () => ({set: badSetStub});

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        sandbox.stub(console, "error");
    });

    afterEach(() => sandbox.restore());

    it('should return the user`s details', () => {
        // Setup.
        const api = new GithubApi(userDetails);

        // Exercise.
        const response  = api.userDetails;

        // Verify.
        response.should.deep.equal(userDetails);
    });

    describe('latestRelease', () => {

        it('should return a valid response', async () => {
            // Setup.
            const api = new GithubApi(userDetails);
            const expectedBody = {name: '1.2.3'};
            sandbox.stub(request, 'get').returns(goodRequestMock(expectedBody));

            // Exercise.
            const response  = await api.latestRelease(repoDetails);

            // Verify.
            request.get.should.be.calledWith(`https://api.github.com/repos/${repoDetails}/releases/latest`);
            request.get().set.should.be.calledWith('Authorization', 'Basic dG9vbHM6aGFtbWVy');
            response.should.deep.equal(expectedBody);
        });

        it('should return an error', async () => {
            // Setup.
            const api = new GithubApi(userDetails);
            sandbox.stub(request, 'get').returns(badRequestMock());

            // Exercise.
            const response  = await api.latestRelease(repoDetails);

            // Verify.
            should.exist(response.error);
        });

    });

});
