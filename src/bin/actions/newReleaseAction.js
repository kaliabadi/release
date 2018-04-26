import { prompt } from 'inquirer';
import { newRelease, getOrgRepo } from '../github/gitInteractions';
import generateChangelog from '../utils/generateChangelog';

const newReleaseQuestions = [
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

export default async (userDetails) => {
  console.log('Remember to tag your commit with the release version first 🔖')
  generateChangelog();
  
  const getReleaseDetails = await prompt(newReleaseQuestions);
  const repoDetails = getOrgRepo();

  newRelease(userDetails, getReleaseDetails).catch((error) => console.error(error));

  console.log('A new release has been publised! 🎉 \n' +
    `Go to https://github.com/${repoDetails}/releases to see the details`);
};
