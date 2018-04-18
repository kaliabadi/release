const { newRelease } = require('../gitInteractions');
const { prompt } = require('inquirer');

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
        type : 'input',
        name : 'version',
        message : 'Enter version number ...'
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
    },
    {
        type: 'input',
        name: 'changeLog',
        message: 'What is the path to the project CHANGELOG.MD?'
    }
];

module.exports = (userDetails) => async() => {
    const getReleaseDetails = await prompt(newReleaseQuestions);

    const { repo, org, changeLog } = getReleaseDetails; 

    if(!changeLog) console.log('Please specify a change log file')
    if(!repo) console.log('Please specify repository');
    if(!org) console.log('Please specify organisation or user that owns the repository');
    
    await newRelease(userDetails, getReleaseDetails);

    console.log(`A new release has been publised! 🎉
Go to https://github.com/${org}/${repo}/releases to see the details`);
};