import { prompt } from 'inquirer';
import { updateRelease } from '../gitInteractions';

const updateLatestReleaseQuestions = [
  {
    type: 'input',
    name: 'repo',
    message: 'Enter repository name ...',
  },
  {
    type: 'input',
    name: 'org',
    message: 'Enter organisation or user for repository ...',
  },
  {
    type: 'confirm',
    name: 'approved',
    message: 'Has this release been approved by the product owner?',
  },
  {
    type: 'input',
    name: 'scheduled',
    message: 'What is the scheduled release time?',
  },
];

export default async (userDetails) => {
  const getReleaseDetails = await prompt(updateLatestReleaseQuestions);

  const { repo, org } = getReleaseDetails;

  if (!repo) console.error('Please specify repository');
  if (!org) console.error('Please specify organisation or user that owns the repository');

  const updateReleaseResponse = await updateRelease(userDetails, getReleaseDetails);

  console.log(`The release notes for ${updateReleaseResponse.name} have been updated! \n` +
        `You can see the new release notes here: https://github.com/${org}/${repo}/releases`);
};
