import fs from 'fs';
import gitTags from 'git-tags';
import generateBodyContent from './contentConstruction';
import GithubApi from './api/GithubApi';

const readFileAsString = (filePath) => {
  if (filePath) {
    try {
      return fs.readFileSync(filePath, 'utf8').toString();
    } catch (err) {
      console.error(`Failed to read the file: ${filePath}, Error: `, err);
    }
  }
  return undefined;
};

const latestRelease = async (userDetails, { repo, org }) => {
  const api = new GithubApi(userDetails);
  return await api.latestRelease(org, repo);
};

const newRelease = async (userDetails, {repo, org, approved, scheduled}) => {
  const api = new GithubApi(userDetails);  
  let changeLogContents = readFileAsString('./CHANGELOG.md');
  let releaseBody;

  const versionNumber = await new Promise((resolve) => {
    gitTags.get((err, tags) => {
      if (err) throw err;
      if(!tags) 
        console.log('You have not tagged your commit with the release version!')

      resolve(tags[0]);
    })
  });

  if(!changeLogContents) {
    console.log('❌ No changelog has been found! ❌')
    changeLogContents = 'NO CHANGES FOUND';
  }

  if(!versionNumber)
    console.error('❌ No version number found, please update your commit with a git tag ❌')

  if(changeLogContents && versionNumber) {
    releaseBody = generateBodyContent(scheduled, approved, changeLogContents);
  } else {
    throw new Error('❌ missing version number or changelog, please check you have tagged your content correctly ❌');
  }
  
  const releaseDetails = {
    "tag_name": versionNumber,
    target_commitish: 'master',
    "name": versionNumber,
    body: releaseBody,
    draft: false,
    prerelease: !approved,
  };

  return api.newRelease(org, repo, releaseDetails);
};

const updateRelease = async (userDetails, {
  repo, org, approved, scheduled,
}) => {
  const api = new GithubApi(userDetails);
  const latestRelease = await api.latestRelease(org, repo);
  const changeLogContents = readFileAsString('./CHANGELOG.md');
  const releaseDetails = { prerelease: !approved };

  if(changeLogContents) {
    const releaseBody = generateBodyContent(scheduled, approved, changeLogContents);
    Object.assign(releaseDetails, { body: releaseBody });
  }

  return await api.updateRelease(org, repo, latestRelease.id, releaseDetails);
};

export {
  latestRelease,
  newRelease,
  updateRelease,
};
