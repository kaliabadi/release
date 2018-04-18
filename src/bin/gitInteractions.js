import request from 'superagent';
import fs from 'fs';
import generateBodyContent from '../contentConstruction';

const latestRelease = async (userDetails, { repo, org }) => {
  const authDetails = `Basic ${Buffer.from(`${userDetails.username}:${userDetails.accessToken}`).toString('base64')}`;

  const response = await request
    .get(`https://api.github.com/repos/${org}/${repo}/releases/latest`)
    .set('Authorization', authDetails);

  return response.body;
};

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

const newRelease = async (userDetails, {
  repo, org, changeLog, version, approved, scheduled,
}) => {
  const authDetails = `Basic ${Buffer.from(`${userDetails.username}:${userDetails.accessToken}`).toString('base64')}`;
  const changeLogContents = readFileAsString(changeLog);
  const releaseBody = generateBodyContent(scheduled, approved, changeLogContents);

  console.log(releaseBody);

  const releaseDetails = {
    tag_name: version,
    target_commitish: 'master',
    name: version,
    body: changeLogContents,
    draft: false,
    prerelease: !approved,
  };

  try {
    const response = await request
      .post(`https://api.github.com/repos/${org}/${repo}/releases`)
      .set('Authorization', authDetails)
      .send(releaseDetails);
    return response.body;
  } catch (error) {
    console.error('Bad response from Github: ', error.response.body);
    return { error };
  }
};

const updateRelease = async (userDetails, {
  repo, org, approved, scheduled, changeLog,
}) => {
  const authDetails = `Basic ${Buffer.from(`${userDetails.username}:${userDetails.accessToken}`).toString('base64')}`;
  const latestReleaseResponse = await latestRelease(userDetails, { repo, org });
  const changeLogContents = readFileAsString(changeLog);
  const releaseBody = generateBodyContent(scheduled, approved, changeLogContents);

  try {
    const response = await request
      .patch(`https://api.github.com/repos/${org}/${repo}/releases/${latestReleaseResponse.id}`)
      .set('Authorization', authDetails)
      .send({
        body: releaseBody,
        prerelease: !approved,
      });

    return response.body;
  } catch (error) {
    console.error('Bad response from Github: ', error.response.body);
    return { error };
  }
};


export {
  latestRelease,
  newRelease,
  updateRelease,
};
