import fs from 'fs';

export default class File {
  constructor(filePath) {
    this._filePath = filePath;
  }

  get filePath() {
    return this._filePath;
  }

  get asString() {
    try {
      return fs.readFileSync(this.filePath, 'utf8').toString();
    } catch (err) {
      console.error(`Failed to read the file: ${this.filePath}, Error: `, err);
    }
    return null;
  }

  get asJson() {
    try {
      return JSON.parse(fs.readFileSync(this.filePath));
    } catch (err) {
      console.error(`Failed to parse the file as JSON: ${this.filePath}`, err);
    }
    return null;
  }

  write(contents) {
    try {
      fs.writeFileSync(this.filePath, contents);
    } catch (err) {
      throw new Error(`Failed to write contents to the file: ${this.filePath}, ${err}`);
    }
  }
}
