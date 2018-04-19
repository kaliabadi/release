import request from 'superagent';
import fs from 'fs';
import gitTags from 'git-tags';
import generateBodyContent from './contentConstruction';

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

const githubRequest = async (path, httpMethod, releaseDetails, userDetails) => {
  const authDetails = `Basic ${Buffer.from(`${userDetails.username}:${userDetails.accessToken}`).toString('base64')}`;
  
  try {
    const response = await request[httpMethod](`https://api.github.com/${path}`)
    .set('Authorization', authDetails)
    .send(releaseDetails);
    
    return response.body;
  } catch (error) {
    console.error('Bad response from Github: ', error.response.body);
    return { error };
  }
}

const latestRelease = async (userDetails, { repo, org }) => {
  const latestReleasePath = `repos/${org}/${repo}/releases/latest`;
  return await githubRequest(latestReleasePath, 'get', '', userDetails);
};

const newRelease = async (userDetails, {repo, org, approved, scheduled}) => {
  const newReleasePath = `repos/${org}/${repo}/releases`;
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

  return githubRequest(newReleasePath, 'post', releaseDetails, userDetails);
};

const updateRelease = async (userDetails, {
  repo, org, approved, scheduled,
}) => {
  const latestReleaseResponse = await latestRelease(userDetails, { repo, org });
  const changeLogContents = readFileAsString('./CHANGELOG.md');
  const releaseDetails = { prerelease: !approved };
  const updatePath = `repos/${org}/${repo}/releases/${latestReleaseResponse.id}`;

  if(changeLogContents) {
    const releaseBody = generateBodyContent(scheduled, approved, changeLogContents);
    Object.assign(releaseDetails, { body: releaseBody });
  }
  
  return githubRequest(updatePath, 'patch', releaseDetails, userDetails)
};

export {
  latestRelease,
  newRelease,
  updateRelease,
};
