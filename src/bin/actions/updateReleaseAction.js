import { prompt } from 'inquirer';
import gitTags from 'git-tags';
import { updateRelease, getOrgRepo, taggedRelease } from '../github/gitInteractions';

export default async (userDetails, version, release) => {
  const repoDetails = getOrgRepo();

  if (!(version instanceof String)) {
    version = await new Promise((resolve) => gitTags.get((err, tags) => resolve(tags[0])));
  }

  taggedRelease(userDetails, version);
  await prompt([ { type: 'confirm', name: 'postUpdate', message: 'have you completed updating the release notes?'}])

  const updateReleaseResponse = updateRelease(userDetails, version, release);

  console.log(`The release notes for ${updateReleaseResponse.name} have been updated! \n` +
        `You can see the new release notes here: https://github.com/${repoDetails}/releases`);
};
