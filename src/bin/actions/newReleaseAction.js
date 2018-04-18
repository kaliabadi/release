import { prompt } from 'inquirer';
import { newRelease } from '../gitInteractions';

const newReleaseQuestions = [
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
  const getReleaseDetails = await prompt(newReleaseQuestions);

  const { repo, org } = getReleaseDetails; 

  if (!repo) console.error('Please specify repository');
  if (!org) console.error('Please specify organisation or user that owns the repository');

  await newRelease(userDetails, getReleaseDetails);

  console.log(`A new release has been publised! 🎉 \n` +
    `Go to https://github.com/${org}/${repo}/releases to see the details`);
};
