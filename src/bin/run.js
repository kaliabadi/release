#!/usr/bin/env node

import program from 'commander';
import latestReleaseAction from './actions/latestReleaseAction';
import newReleaseAction from './actions/newReleaseAction';
import updateReleaseAction from './actions/updateReleaseAction';

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
  .version('0.1.0')
  .command('latest')
  .action(async () => await latestReleaseAction(getUserDetails()));

program
  .command('new')
  .action(async () => await newReleaseAction(getUserDetails()));

program
  .command('update') 
  .option('-v, --versionTag', 'specify the version in your git tag')
  .action(async (options) => {
    const version = options.constructor === String ? options : undefined;
    await updateReleaseAction(getUserDetails(), version);    
  });

program.parse(process.argv);
