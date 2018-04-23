import {latestRelease, getOrgRepo} from '../github/gitInteractions';

export default async (userDetails) => {
  const repoDetails = getOrgRepo();
  const latestReleaseResponse = await latestRelease(userDetails);

  if (latestReleaseResponse.error) {
    console.error('Failed to get the latest release version', latestReleaseResponse.error);
  } else {
    console.log(`The latest release version for ${repoDetails} is ${latestReleaseResponse.name}`);
  }
};