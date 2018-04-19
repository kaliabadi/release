import fs from 'fs';
import gitTags from 'git-tags';
import remoteOriginUrl from 'remote-origin-url';
import generateBodyContent from './contentConstruction';
import GithubApi from './api/GithubApi';

const getOrgRepo = () => {
  const fullUrl = remoteOriginUrl.sync();
  let trimmedUrl = fullUrl.replace('git@github.com:', '');
  trimmedUrl = trimmedUrl.replace('.git', '');

  return trimmedUrl
}

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

const latestRelease = async (userDetails) => {
  const repoDetails = getOrgRepo();
  const api = new GithubApi(userDetails);
  return await api.latestRelease(repoDetails);
};

const newRelease = async (userDetails, {approved, scheduled}) => {
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

  const repoDetails = getOrgRepo();

  return api.newRelease(repoDetails, releaseDetails);
};

const updateRelease = async (userDetails, { approved, scheduled }) => {
  const api = new GithubApi(userDetails);
  const repoDetails = getOrgRepo();
  const latestRelease = await api.latestRelease(repoDetails);
  const changeLogContents = readFileAsString('./CHANGELOG.md');
  const releaseDetails = { prerelease: !approved };

  if(changeLogContents) {
    const releaseBody = generateBodyContent(scheduled, approved, changeLogContents);
    Object.assign(releaseDetails, { body: releaseBody });
  }

  return await api.updateRelease(repoDetails, latestRelease.id, releaseDetails);
};

export {
  getOrgRepo,
  latestRelease,
  newRelease,
  updateRelease,
};
