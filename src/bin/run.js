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
  .action(latestReleaseAction(getUserDetails()));

program
  .command('new')
  .action(newReleaseAction(getUserDetails()));

program
  .command('update')
  .action(updateReleaseAction(getUserDetails()));

program.parse(process.argv);
