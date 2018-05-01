import { prompt } from 'inquirer';
import { newRelease, getOrgRepo } from '../github/gitInteractions';
import ChangeLog from '../utils/ChangeLog';

const newReleaseQuestions = [
  {
    type: 'confirm',
    name: 'approved',
    message: 'Has this release been approved by the product owner?'
  },
  {
    type: 'input',
    name: 'scheduled',
    message: 'What is the scheduled release time?'
  },
  {
    type: 'input',
    name: 'freeText',
    message:
      'Is there anything else you want to add in the release documentation?'
  }
];

export default async userDetails => {
  console.log('Remember to tag your commit with the release version first 🔖');
  await new ChangeLog('./CHANGELOG.md').create();

  const getReleaseDetails = await prompt(newReleaseQuestions);
  const repoDetails = getOrgRepo();

  try {
    await newRelease(userDetails, getReleaseDetails);
    console.log(
      'A new release has been publised! 🎉 \n' +
        `Go to https://github.com/${repoDetails}/releases to see the details`
    );
  } catch (err) {
    console.error('Failed to create a new release: ', err);
  }
};
