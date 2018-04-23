import sinon from "sinon";
import chai from "chai";
import sinonChai from "sinon-chai";
import request from 'superagent';
import GithubApi from './GithubApi';

chai.use(sinonChai);

describe('GithubApi', () => {

    const userDetails = {
        username: 'tools',
        accessToken: 'hammer'
    };
    const repoDetails = 'tools/release';
    let sandbox;
    let api;
    let goodSendStub;
    let goodSetStub;
    let goodRequestMock;
    let badSendStub;
    let badSetStub;
    let badRequestMock;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        api = new GithubApi(userDetails);
        sandbox.stub(console, "error");
        goodSendStub = (body) => sandbox.stub().returns(({body}));
        goodSetStub = (body) => sandbox.stub().returns({send: goodSendStub(body)});
        goodRequestMock = (body) => ({set: goodSetStub(body)});
        badSendStub = sandbox.stub().rejects({response: {body: 'Github Error'}});
        badSetStub = sandbox.stub().returns({send: badSendStub});
        badRequestMock = () => ({set: badSetStub});
    });

    afterEach(() => sandbox.restore());

    describe('latestRelease', () => {

        it('should return a valid response', async () => {
            // Setup.
            const expectedBody = {name: '1.2.3'};
            sandbox.stub(request, 'get').returns(goodRequestMock(expectedBody));

            // Exercise.
            const response = await api.latestRelease(repoDetails);

            // Verify.
            request.get.should.be.calledWith(`https://api.github.com/repos/${repoDetails}/releases/latest`);
            request.get().set.should.be.calledWith('Authorization', 'Basic dG9vbHM6aGFtbWVy');
            response.should.deep.equal(expectedBody);
        });

        it('should return an error', async () => {
            // Setup.
            sandbox.stub(request, 'get').returns(badRequestMock());

            // Exercise.
            const response = await api.latestRelease(repoDetails);

            // Verify.
            should.exist(response.error);
        });

    });

    describe('taggedRelease', () => {

        it('should return a valid response', async () => {
            // Setup.
            const expectedBody = {id: '1.2.3'};
            const expectedTag = '1.2.3';
            sandbox.stub(request, 'get').returns(goodRequestMock(expectedBody));

            // Exercise.
            const response = await api.taggedRelease(repoDetails, expectedTag);

            // Verify.
            request.get.should.be.calledWith(`https://api.github.com/repos/${repoDetails}/releases/tags/${expectedTag}`);
            request.get().set.should.be.calledWith('Authorization', 'Basic dG9vbHM6aGFtbWVy');
            response.should.deep.equal(expectedBody);
        });

        it('should return an error', async () => {
            // Setup.
            sandbox.stub(request, 'get').returns(badRequestMock());

            // Exercise.
            const response = await api.taggedRelease(repoDetails, '1.2.3');

            // Verify.
            should.exist(response.error);
        });

    });

    describe('updateRelease', () => {

        it('should return a valid response', async () => {
            // Setup.
            const expectedBody = {name: '1.2.3'};
            const expectedReleaseId = '10669493';
            const expectedReleaseDetails = '*release content details*'
            sandbox.stub(request, 'patch').returns(goodRequestMock(expectedBody));

            // Exercise.
            const response = await api.updateRelease(repoDetails, expectedReleaseId, expectedReleaseDetails);

            // Verify.
            request.patch.should.be.calledWith(`https://api.github.com/repos/${repoDetails}/releases/${expectedReleaseId}`);
            request.patch().set.should.be.calledWith('Authorization', 'Basic dG9vbHM6aGFtbWVy');
            request.patch().set().send.should.be.calledWith(expectedReleaseDetails);
            response.should.deep.equal(expectedBody);
        });

        it('should return an error', async () => {
            // Setup.
            sandbox.stub(request, 'patch').returns(badRequestMock());

            // Exercise.
            const response = await api.updateRelease(repoDetails, '10669493', '*release content details*');

            // Verify.
            should.exist(response.error);
        });

    });

});
