import mversion from 'mversion';
import changeLog from 'generate-changelog'
import fs from 'fs';

export default (version) => {
    mversion.update(version, () => {});

    changeLog.generate({ [version]: true })
        .then((changelog) => {
            fs.writeFileSync('./CHANGELOG.md', changelog);
        });
};
