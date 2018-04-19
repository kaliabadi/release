import { prompt } from 'inquirer';
import { updateRelease, getOrgRepo } from '../gitInteractions';

const updateLatestReleaseQuestions = [
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

export default async (userDetails, version) => {
  const getReleaseDetails = await prompt(updateLatestReleaseQuestions);
  const updateReleaseResponse = await updateRelease(userDetails, version, getReleaseDetails);
  const repoDetails = getOrgRepo();

  console.log(`The release notes for ${updateReleaseResponse.name} have been updated! \n` +
        `You can see the new release notes here: https://github.com/${repoDetails}/releases`);
};
