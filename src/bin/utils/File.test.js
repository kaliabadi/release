import sinon from 'sinon';
import chai from 'chai';
import sinonChai from 'sinon-chai';
import fs from 'fs';
import mkdirp from 'mkdirp';
import File from './File';

chai.use(sinonChai);

describe('File', () => {
  var sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    sandbox.stub(console, 'error');
  });

  afterEach(() => sandbox.restore());

  describe('asString', () => {
    it('should return the file as a string', () => {
      // Setup.
      const expectedFileString = 'Good file';
      sandbox
        .stub(fs, 'readFileSync')
        .returns(Buffer.from(expectedFileString, 'utf8'));
      const goodFile = new File('good/file/path');

      // Exercise.
      const fileString = goodFile.asString;

      // Verify.
      fileString.should.equal(expectedFileString);
    });

    it('should return null if the file could not be read', () => {
      // Setup.
      sandbox.stub(fs, 'readFileSync').throws(new Error('File does not exist'));
      const badFile = new File('bad/file/path');

      // Exercise.
      const fileString = badFile.asString;

      // Verify.
      should.not.exist(fileString);
    });
  });

  describe('asJson', () => {
    it('should return the file as Json', () => {
      // Setup.
      const expectedJson = { key: 'value' };
      sandbox
        .stub(fs, 'readFileSync')
        .returns(Buffer.from(JSON.stringify(expectedJson), 'utf8'));
      const goodFile = new File('good/file/path');

      // Exercise.
      const fileJson = goodFile.asJson;

      // Verify.
      fileJson.should.deep.equal(expectedJson);
    });

    it('should return null if the file could not be read', () => {
      // Setup.
      sandbox.stub(fs, 'readFileSync').throws(new Error('File does not exist'));
      const badFile = new File('bad/file/path');

      // Exercise.
      const fileJson = badFile.asJson;

      // Verify.
      should.not.exist(fileJson);
    });
  });

  describe('write', () => {
    it('should write the file contents', () => {
      // Setup.
      const expectedPath = 'good/file/path';
      const expectedContents = 'file contents';
      const writeFileStub = sandbox.stub(fs, 'writeFileSync');
      sandbox.stub(mkdirp, 'sync');
      const goodFile = new File(expectedPath);

      // Exercise.
      goodFile.write(expectedContents);

      // Verify.
      writeFileStub.should.have.been.calledWith(expectedPath, expectedContents);
    });

    it('should throw an error if the file cannot be written', () => {
      // Setup.
      const expectedPath = 'bad/file/path';
      const expectedContents = 'file contents';
      sandbox.stub(fs, 'writeFileSync').throws('Unable to write file.');
      sandbox.stub(mkdirp, 'sync');
      const badFile = new File(expectedPath);

      // Exercise.
      let expectedError = undefined;

      try {
        badFile.write(expectedContents);
      } catch (err) {
        expectedError = err;
      }

      // Verify.
      expectedError.should.be.an('Error');
    });
  });
});
