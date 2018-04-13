#!/usr/bin/env node

const program = require('commander');
const request = require('superagent');
const { latestRelease, newRelease, updateRelease } = require('./gitInteractions');

program
    .version('0.1.0')
    .command('latest')
    .option('-o, --org [organisatio name]', 'Name of organisation or user that owns the repo')
    .option('-r, --repo [repository name]', 'Name of repository you want to release too')
    .option('-c, --changeLog [changelog path]', 'Path to the changelog')
    .action(async (options) => {
        const { repo, org } = options;
        const userDetails = {
            username: process.env.GIT_USERNAME,
            accessToken: process.env.GIT_ACCESS_TOKEN
        };
        
        if(!userDetails.username) console.log('Please set the variable GIT_USERNAME in your terminal. e.g export GIT_USERNAME=username')
        if(!userDetails.accessToken) console.log('Please set the variable GIT_ACCESS_TOKEN in your terminal. e.g export GIT_ACCESS_TOKEN=accessToken')
        if(!repo) console.log('Please specify repository');
        if(!org) console.log('Please specify organisation or user that owns the repository');

        const latestReleaseResponse = await latestRelease(userDetails, repo, org);
        
        console.log(`The latest release version for ${repo} is ${latestReleaseResponse.name}`)
    })

program
    .command('new')
    .option('-o, --org [organisatio name]', 'Name of organisation or user that owns the repo')
    .option('-r, --repo [repository name]', 'Name of repository you want to release too')
    .option('-c, --changeLog [changelog path]', 'Path to the changelog')
    .action(async (options) => {
        const { repo, org, changeLog } = options;
        if(!changeLog) console.log('Please specify a change log file')
        const userDetails = {
            username: process.env.GIT_USERNAME,
            accessToken: process.env.GIT_ACCESS_TOKEN
        };

        if(!changeLog) console.log('Please specify a change log file')
        if(!userDetails.username) console.log('Please set the variable GIT_USERNAME in your terminal. e.g export GIT_USERNAME=username')
        if(!userDetails.accessToken) console.log('Please set the variable GIT_ACCESS_TOKEN in your terminal. e.g export GIT_ACCESS_TOKEN=accessToken')
        if(!repo) console.log('Please specify repository');
        if(!org) console.log('Please specify organisation or user that owns the repository');
        
        const newReleaseResponse = await newRelease(userDetails, repo, org, changeLog);

        console.log(`A new release has been publised! 🎉
Go to ${newReleaseResponse.url} to see the details`)
    })

program
    .command('update')
    .option('-o, --org [organisatio name]', 'Name of organisation or user that owns the repo')
    .option('-r, --repo [repository name]', 'Name of repository you want to release too')
    .action(async (options) => {
        const { repo, org } = options;
        const userDetails = {
            username: process.env.GIT_USERNAME,
            accessToken: process.env.GIT_ACCESS_TOKEN
        };

        if(!userDetails.username) console.log('Please set the variable GIT_USERNAME in your terminal. e.g export GIT_USERNAME=username')
        if(!userDetails.accessToken) console.log('Please set the variable GIT_ACCESS_TOKEN in your terminal. e.g export GIT_ACCESS_TOKEN=accessToken')
        if(!repo) console.log('Please specify repository');
        if(!org) console.log('Please specify organisation or user that owns the repository');
        
        console.log(await updateRelease(userDetails, repo, org));
    })

program.parse(process.argv)
