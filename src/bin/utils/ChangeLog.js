import changeLog from 'generate-changelog';
import fs from 'fs';
import gitTags from 'git-tags';

export default class ChangeLog {
  constructor(path) {
    this._path = path;
  }

  get path() {
    return this._path;
  }

  async create() {
    const version = await getVersionRange();
    const contents = await changeLog.generate({ tag: version.toString() });

    fs.writeFileSync(this.path, contents);
  }
}

const getVersionRange = () =>
  new Promise(resolve =>
    gitTags.get((err, tags) => {
      const versionRange = tags[1] ? `${tags[1]}..${tags[0]}` : tags[0];
      resolve(versionRange);
    })
  );
