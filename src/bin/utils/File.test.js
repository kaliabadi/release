import sinon from 'sinon';
import chai from 'chai';
import sinonChai from 'sinon-chai';
import fs from 'fs';
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
      const expectedJson = {key: 'value'};
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
});
