import changeLog from 'generate-changelog'
import fs from 'fs';

export default () => {
    changeLog.generate({ patch: false })
        .then((changelog) => {
            fs.writeFileSync('./CHANGELOG.md', changelog);
        });
};
