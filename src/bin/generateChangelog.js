import mversion from 'mversion';
import changeLog from 'generate-changelog'
import fs from 'fs';

const generateChangeLog = (version) => {
    mversion.update(version, function (err, data) { });

    changeLog.generate({ [version]: true })
        .then(function (changelog) {
            fs.writeFileSync('./CHANGELOG.md', changelog);
        });
};

module.exports = generateChangeLog;
