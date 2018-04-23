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
];

export default async (userDetails) => {
  console.log('Remember to tag your commit with the release version first 🔖')
  generateChangelog();

  const getReleaseDetails = await prompt(newReleaseQuestions);
  const repoDetails = getOrgRepo();

  await newRelease(userDetails, getReleaseDetails);

  console.log(`A new release has been publised! 🎉 \n` +
    `Go to https://github.com/${repoDetails}/releases to see the details`);
};
