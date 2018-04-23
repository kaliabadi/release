import { prompt } from 'inquirer';
import gitTags from 'git-tags';
import { updateRelease, getOrgRepo, taggedRelease } from '../gitInteractions';

export default async (userDetails, options ) => {
  console.log(options.release);
  
  const repoDetails = getOrgRepo();

  if (!(options.version instanceof String)) {
    options.version = await new Promise((resolve) => gitTags.get((err, tags) => resolve(tags[0])));
  }

  if(!options.release) {
    options.release = false;
  }

  taggedRelease(userDetails, options.version);
  await prompt([ { type: 'confirm', name: 'postUpdate', message: 'have you completed updating the release notes?'}])

  const updateReleaseResponse = updateRelease(userDetails, options.version, options.release);

  console.log(`The release notes for ${updateReleaseResponse.name} have been updated! \n` +
        `You can see the new release notes here: https://github.com/${repoDetails}/releases`);
};
