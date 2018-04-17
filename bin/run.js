#!/usr/bin/env node

const program = require('commander');
const latestReleaseAction = require('./actions/latestReleaseAction');
const newReleaseAction = require('./actions/newReleaseAction');
const updateReleaseAction = require('./actions/updateReleaseAction');

const validateUserDetails = (userDetails) => {
    if(!userDetails.username) throw 'Please set the variable GIT_USERNAME in your terminal. e.g export GIT_USERNAME=username';
    if(!userDetails.accessToken) throw 'Please set the variable GIT_ACCESS_TOKEN in your terminal. e.g export GIT_ACCESS_TOKEN=accessToken';
    return userDetails;
};

const getUserDetails = () => validateUserDetails({
    username: process.env.GIT_USERNAME,
    accessToken: process.env.GIT_ACCESS_TOKEN
});

program
    .version('0.1.0')
    .command('latest')
    .option('-o, --org [organisation name]', 'Name of organisation or user that owns the repo')
    .option('-r, --repo [repository name]', 'Name of repository you want to release too')
    .action(latestReleaseAction(getUserDetails()));

program
    .command('new')
    .action(newReleaseAction(getUserDetails()));

program
    .command('update')
    .option('-o, --org [organisatio name]', 'Name of organisation or user that owns the repo')
    .option('-r, --repo [repository name]', 'Name of repository you want to release too')
    .action(updateReleaseAction(getUserDetails()));

program.parse(process.argv)
