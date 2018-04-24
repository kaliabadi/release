import { prompt } from 'inquirer';
import gitTags from 'git-tags';
import { updateRelease, getOrgRepo } from '../github/gitInteractions';

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
  const updateVersion = version ?
    version :
    await new Promise((resolve) => gitTags.get((err, tags) => resolve(tags[0])));

  const getReleaseDetails = await prompt(updateLatestReleaseQuestions);
  const updateReleaseResponse = await updateRelease(userDetails, updateVersion, getReleaseDetails);
  const repoDetails = getOrgRepo();

  console.log(`The release notes for ${updateReleaseResponse.name} have been updated! \n` +
        `You can see the new release notes here: https://github.com/${repoDetails}/releases`);
};
