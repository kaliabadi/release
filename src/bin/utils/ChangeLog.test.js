import sinon from 'sinon';
import chai from 'chai';
import sinonChai from 'sinon-chai';
import fs from 'fs';
import changeLog from 'generate-changelog';
import gitTags from 'git-tags';
import ChangeLog from './ChangeLog';

chai.use(sinonChai);

describe('ChangeLog', () => {
  var sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    sandbox.stub(console, 'error');
  });

  afterEach(() => sandbox.restore());

  it('should write the change log contents to "./CHANGELOG.md"', async () => {
    // Setup.
    const expectedChangeLog = 'I am changelog contents';
    const expectedTag = '1.0.0';
    sandbox.stub(gitTags, 'get').callsArgWith(0, null, [expectedTag]);
    const changeLogStub = sandbox
      .stub(changeLog, 'generate')
      .resolves(expectedChangeLog);
    const fsStub = sandbox.stub(fs, 'writeFileSync');

    // Exercise.
    await new ChangeLog('./CHANGELOG.md').create();

    // Verify.
    changeLogStub.should.have.been.calledWith({ tag: expectedTag });
    fsStub.should.have.been.calledWith('./CHANGELOG.md', expectedChangeLog);
  });
});
