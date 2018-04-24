import fs from 'fs';

export default class File {

    constructor(filePath) {
        this._filePath = filePath;
    }

    get filePath() {
        return this._filePath;
    }

    get asString() {
        if (this.filePath) {
            try {
                return fs.readFileSync(this.filePath, 'utf8').toString();
            } catch (err) {
                console.error(`Failed to read the file: ${this.filePath}, Error: `, err);
            }
        }
        return null;
    }
    
}
