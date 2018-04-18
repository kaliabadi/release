import {prompt} from 'inquirer';
import {latestRelease} from '../gitInteractions';

const latestQuestions = [
  {
    type: 'input',
    name: 'repo',
    message: 'Enter repository name ...'
  }, {
    type: 'input',
    name: 'org',
    message: 'Enter organisation or user for repository ...'
  }
];

export default async (userDetails) => {
  const getReleaseDetails = await prompt(latestQuestions);

  const {org, repo} = getReleaseDetails;

  if (!repo) 
    console.error('Please specify repository');
  if (!org) 
    console.error('Please specify organisation or user that owns the repository');
  
  const latestReleaseResponse = await latestRelease(userDetails, getReleaseDetails);

  console.log(`The latest release version for ${repo} is ${latestReleaseResponse.name}`);
};
