import changeLog from 'generate-changelog';
import fs from 'fs';
import gitTags from 'git-tags';

export default async () => {
  const version = await new Promise(resolve =>
    gitTags.get((err, tags) => {
      const versionRange = tags[1] ? `${tags[1]}..${tags[0]}` : tags[0];
      resolve(versionRange);
    })
  );

  const contents = await changeLog.generate({ tag: version.toString() })

  fs.writeFileSync('./CHANGELOG.md', contents);
};
