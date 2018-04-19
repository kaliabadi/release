import {latestRelease, getOrgRepo} from '../gitInteractions';


export default async (userDetails) => {
  const repoDetails = getOrgRepo();  
  const latestReleaseResponse = await latestRelease(userDetails);

  console.log(`The latest release version for ${repoDetails} is ${latestReleaseResponse.name}`);
};
