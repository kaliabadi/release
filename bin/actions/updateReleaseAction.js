const { updateRelease } = require('../gitInteractions');
const { prompt } = require('inquirer');

const updateLatestReleaseQuestions = [
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
    },
    {
        type: 'input',
        name: 'changeLog',
        message: 'What is the path to the project CHANGELOG.MD?'
    }
];

module.exports = (userDetails) => async () => {
    const getReleaseDetails = await prompt(updateLatestReleaseQuestions);

    const { repo, org } = getReleaseDetails; 

    if (!repo) console.log('Please specify repository');
    if (!org) console.log('Please specify organisation or user that owns the repository');

    const updateReleaseResponse = await updateRelease(userDetails, getReleaseDetails);

    console.log(`The release notes for ${updateReleaseResponse.name} have been updated! \n` +
        `You can see the new release notes here: https://github.com/${org}/${repo}/releases`);
};