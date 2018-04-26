import changeLog from 'generate-changelog'
import fs from 'fs';
import gitTags from 'git-tags';

export default () => {
  gitTags.get((err, tags) => {
    const versionRange = tags[1] ? `${tags[1]}..${tags[0]}` : tags[0]; 
        
    changeLog.generate({ tag: versionRange.toString() })
      .then((changelog) => {
        fs.writeFileSync('./CHANGELOG.md', changelog);
      });
  })
};
