#!/usr/bin/env node

const program = require('commander');
const request = require('superagent');
const { prompt } = require('inquirer');
const { latestRelease, newRelease, updateRelease } = require('./gitInteractions');

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

const latestQuestions = [
    {
        type : 'input',
        name : 'repo',
        message : 'Enter repository name ...'
    },
    {
        type : 'input',
        name : 'org',
        message : 'Enter organisation or user for repository ...'
    }
];

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

program
    .version('0.1.0')
    .command('latest')
    .action(async () => {
        const userDetails = {
            username: process.env.GIT_USERNAME,
            accessToken: process.env.GIT_ACCESS_TOKEN
        };
        const getReleaseDetails = await prompt(latestQuestions);

        const { org, repo } = getReleaseDetails;

        if(!userDetails.username) console.log('Please set the variable GIT_USERNAME in your terminal. e.g export GIT_USERNAME=username')
        if(!userDetails.accessToken) console.log('Please set the variable GIT_ACCESS_TOKEN in your terminal. e.g export GIT_ACCESS_TOKEN=accessToken')
        if(!repo) console.log('Please specify repository');
        if(!org) console.log('Please specify organisation or user that owns the repository');

        const latestReleaseResponse = await latestRelease(userDetails, repo, org);
        
        console.log(`The latest release version for ${repo} is ${latestReleaseResponse.name}`)
    })

program
    .command('new')
    .action(async (options) => {
        const userDetails = {
            username: process.env.GIT_USERNAME,
            accessToken: process.env.GIT_ACCESS_TOKEN
        };

        const getReleaseDetails = await prompt(newReleaseQuestions);

        const { repo, org, version, approved, scheduled, changeLog } = getReleaseDetails; 

        if(!changeLog) console.log('Please specify a changelog file')
        if(!userDetails.username) console.log('Please set the variable GIT_USERNAME in your terminal. e.g export GIT_USERNAME=username')
        if(!userDetails.accessToken) console.log('Please set the variable GIT_ACCESS_TOKEN in your terminal. e.g export GIT_ACCESS_TOKEN=accessToken')
        if(!repo) console.log('Please specify repository');
        if(!org) console.log('Please specify organisation or user that owns the repository');
        
        await newRelease(userDetails, repo, org, changeLog, version, approved, scheduled);

        console.log(`A new release has been publised! 🎉
    Go to https://github.com/${org}/${repo}/releases to see the details`)
    });

program
    .command('update')
    .option('-o, --org [organisatio name]', 'Name of organisation or user that owns the repo')
    .option('-r, --repo [repository name]', 'Name of repository you want to release too')
    .action(async (options) => {
        const getReleaseDetails = await prompt(updateLatestReleaseQuestions);
        const { repo, org, approved, scheduled, changeLog } = getReleaseDetails;
        const userDetails = {
            username: process.env.GIT_USERNAME,
            accessToken: process.env.GIT_ACCESS_TOKEN
        };

        if(!userDetails.username) console.log('Please set the variable GIT_USERNAME in your terminal. e.g export GIT_USERNAME=username')
        if(!userDetails.accessToken) console.log('Please set the variable GIT_ACCESS_TOKEN in your terminal. e.g export GIT_ACCESS_TOKEN=accessToken')
        if(!repo) console.log('Please specify repository');
        if(!org) console.log('Please specify organisation or user that owns the repository');
        
        const updateReleaseResponse = await updateRelease(userDetails, repo, org, approved, scheduled, changeLog);

        console.log(`The release notes for ${updateReleaseResponse.name} has been updated!
        
You can see the new release notes here: https://github.com/${org}/${repo}/releases`)
    })

program.parse(process.argv)
