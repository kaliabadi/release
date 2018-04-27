import gitTags from 'git-tags';
import remoteOriginUrl from 'remote-origin-url';
import openInEditor from 'open-in-editor';
import generateBodyContent from '../utils/contentConstruction';
import GithubApi from './api/GithubApi';
import File from '../utils/File';

const getOrgRepo = () => {
  const fullUrl = remoteOriginUrl.sync();
  let trimmedUrl = fullUrl.replace('git@github.com:', '');
  trimmedUrl = trimmedUrl.replace('.git', '');

  return trimmedUrl;
};

const latestRelease = async userDetails => {
  const repoDetails = getOrgRepo();
  const api = new GithubApi(userDetails);
  return await api.latestRelease(repoDetails);
};

const newRelease = async (userDetails, { approved, scheduled, freeText }) => {
  const api = new GithubApi(userDetails);
  const changeLogContents = new File('./CHANGELOG.md').asString;
  let releaseBody;

  const versionNumber = await new Promise(resolve =>
    gitTags.get((err, tags) => resolve(tags ? tags[0] : undefined))
  );

  if (!changeLogContents) console.error('❌ No changelog has been found! ❌');

  if (!versionNumber)
    console.error(
      '❌ No version number found, please update your commit with a git tag ❌'
    );

  if (!freeText) freeText = 'N/A';

  if (changeLogContents && versionNumber) {
    releaseBody = generateBodyContent(
      scheduled,
      approved,
      changeLogContents,
      freeText
    );
  } else {
    throw new Error(
      '❌ missing version number or changelog, please check you have tagged your content correctly ❌'
    );
  }

  const releaseDetails = {
    tag_name: versionNumber,
    target_commitish: 'master',
    name: versionNumber,
    body: releaseBody,
    draft: false,
    prerelease: !approved
  };

  const repoDetails = getOrgRepo();

  return await api.newRelease(repoDetails, releaseDetails);
};

const taggedRelease = async (userDetails, version) => {
  const api = new GithubApi(userDetails);
  const repoDetails = getOrgRepo();
  const taggedRelease = await api.taggedRelease(repoDetails, version);

  if (!taggedRelease) throw new Error('❌ No release found from that tag ❌');

  const tempReleaseFile = new File('./tmp/taggedRelease.json');
  tempReleaseFile.write(JSON.stringify(taggedRelease.body));

  const editor = openInEditor.configure({
    editor: process.env.EDITOR || 'vim'
  });
  editor.open(tempReleaseFile.filePath);
};

const updateRelease = async (userDetails, version, released) => {
  const api = new GithubApi(userDetails);
  const repoDetails = getOrgRepo();
  const taggedRelease = await api.taggedRelease(repoDetails, version);
  const taggedReleaseContent = new File('./tmp/taggedRelease.json').asJson;

  if (!taggedRelease) throw new Error('❌ No release found from that tag ❌');

  const releaseDetails = { body: taggedReleaseContent, prerelease: !released };

  return await api.updateRelease(repoDetails, taggedRelease.id, releaseDetails);
};

export { getOrgRepo, latestRelease, newRelease, updateRelease, taggedRelease };
