#!/usr/bin/env node

import program from 'commander';
import latestReleaseAction from './actions/latestReleaseAction';
import newReleaseAction from './actions/newReleaseAction';
import updateReleaseAction from './actions/updateReleaseAction';
import generateChangeLog from './generateChangelog';

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
    .action(async () => {
        await latestReleaseAction(getUserDetails())
    });

program
    .command('new')
    .option('-p, --patch', 'Release a patch version')
    .option('-m, --minor', 'Release a minor version')
    .option('-M, --major', 'Release a major version')
    .action(async (options) => {
        const { patch, minor, major } = options

        if(patch) generateChangeLog('patch');
        if(minor) generateChangeLog('minor');
        if(major) generateChangeLog('major');

        await newReleaseAction(getUserDetails())
    });

program
    .command('update')
    .action(async () => {
        updateReleaseAction(getUserDetails())
    });

program.parse(process.argv);
