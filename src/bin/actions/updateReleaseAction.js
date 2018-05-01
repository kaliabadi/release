import { prompt } from 'inquirer';
import gitTags from 'git-tags';
import {
  updateRelease,
  getOrgRepo,
  taggedRelease
} from '../github/gitInteractions';

export default async (userDetails, version, release) => {
  const repoDetails = getOrgRepo();

  if (!version) {
    version = await new Promise(resolve =>
      gitTags.get((err, tags) => resolve(tags[0]))
    );
  }

  await taggedRelease(userDetails, version);
  await prompt([
    {
      type: 'confirm',
      name: 'postUpdate',
      message: 'have you completed updating the release notes?'
    }
  ]);

  try {
    const updateReleaseResponse = await updateRelease(
      userDetails,
      version,
      release
    );

    console.log(
      `The release notes for ${
        updateReleaseResponse.name
      } have been updated! \n` +
        `You can see the new release notes here: https://github.com/${repoDetails}/releases`
    );
  } catch (err) {
    console.error('Failed to update the release: ', err);
  }
};
