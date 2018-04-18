import { prompt } from 'inquirer';
import { newRelease } from '../gitInteractions';

const newReleaseQuestions = [
    {
        type : 'input',
        name : 'repo',
        message : 'Enter repository name ...'
    },
    {
        type : 'input',
        name : 'org',
        message : 'Enter organisation or user for repository ...'
    },
    {
        type : 'confirm',
        name : 'approved',
        message : 'Has this release been approved by the product owner?'
    },
    {
        type: 'input',
        name : 'scheduled',
        message: 'What is the scheduled release time?'
    }
];

module.exports = async (userDetails) => {
    const getReleaseDetails = await prompt(newReleaseQuestions);

    const { repo, org } = getReleaseDetails; 

    if(!repo) console.log('Please specify repository');
    if(!org) console.log('Please specify organisation or user that owns the repository');
    
    await newRelease(userDetails, getReleaseDetails);

    console.log(`A new release has been publised! 🎉
Go to https://github.com/${org}/${repo}/releases to see the details`);
};