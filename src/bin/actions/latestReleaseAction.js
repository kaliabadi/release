import { latestRelease, getOrgRepo } from '../github/gitInteractions';

export default async userDetails => {
  const repoDetails = getOrgRepo();

  try {
    const latestReleaseResponse = await latestRelease(userDetails);
    console.log(
      `The latest release version for ${repoDetails} is ${
        latestReleaseResponse.name
      }`
    );
  } catch (err) {
    console.error('Failed to get the latest release version', err);
  }
};
