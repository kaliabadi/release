import sinon from "sinon";
import chai from "chai";
import sinonChai from "sinon-chai";
import fs from 'fs';
import File from './File';

chai.use(sinonChai);

describe('File', () => {

  var sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    sandbox.stub(console, "error");
  });

  afterEach(() => sandbox.restore());

  it('should return the file as a string', () => {
    // Setup.
    const expectedFileString = 'Good file';
    sandbox.stub(fs, 'readFileSync').returns(Buffer.from(expectedFileString, 'utf8'));
    const badFile = new File('good/file/path');

    // Exercise.
    const fileString = badFile.asString;

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
