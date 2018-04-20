import { prompt } from 'inquirer';
import gitTags from 'git-tags';
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
  {
    type: 'input',
    name: 'freeText',
    message: 'Is there anything else you want to add in the release documentation?',
  }
];

export default async (userDetails, version) => {
  const getReleaseDetails = await prompt(updateLatestReleaseQuestions);
  const repoDetails = getOrgRepo();
  let updateReleaseResponse;

  gitTags.get((err, tags) => {
    if (!(version instanceof String)) {
      version = tags[0];
    }

    updateReleaseResponse = updateRelease(userDetails, version, getReleaseDetails);
  })
  

  console.log(`The release notes for ${updateReleaseResponse.name} have been updated! \n` +
        `You can see the new release notes here: https://github.com/${repoDetails}/releases`);
};
