#!/usr/bin/env node

import program from 'commander';
import latestReleaseAction from './actions/latestReleaseAction';
import newReleaseAction from './actions/newReleaseAction';
import updateReleaseAction from './actions/updateReleaseAction';
import generateChangelog from './generateChangelog';

const validateUserDetails = (userDetails) => {
  if (!userDetails.username) throw new Error('Please set the variable GIT_USERNAME in your terminal. e.g export GIT_USERNAME=username');
  if (!userDetails.accessToken) throw new Error('Please set the variable GIT_ACCESS_TOKEN in your terminal. e.g export GIT_ACCESS_TOKEN=accessToken');
  return userDetails;
};

const getUserDetails = () => validateUserDetails({
  username: process.env.GIT_USERNAME,
  accessToken: process.env.GIT_ACCESS_TOKEN,
});

program
  .version('1.3.0')
  .command('latest')
  .action(async () => {
    await latestReleaseAction(getUserDetails())
  });

program
  .command('new')
  .action(async () => {
    console.log('Remember to tag your commit with the release version first 🔖')
    generateChangelog();
    await newReleaseAction(getUserDetails())
  });

program
  .command('update') 
  .option('-v, --versionTag', 'specify the version in your git tag')
  .option('-r, --release', 'update to be latest release')
  .action(async (options) => {
    await updateReleaseAction(getUserDetails(), options);
  });

program.parse(process.argv);
