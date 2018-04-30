import request from 'superagent';

export default class GithubApi {

  constructor(userDetails) {
    this._userDetails = userDetails;
  }

  get userDetails() {
    return this._userDetails;
  }

  latestRelease(repoDetails) {
    const path = `repos/${repoDetails}/releases/latest`;
    return githubRequest('get', path, null, this.userDetails);
  }

  taggedRelease(repoDetails, tag) {
    const path = `repos/${repoDetails}/releases/tags/${tag}`;
    return githubRequest('get', path, null, this.userDetails);
  }

  updateRelease(repoDetails, releaseId, releaseDetails) {
    const path = `repos/${repoDetails}/releases/${releaseId}`;
    return githubRequest('patch', path, releaseDetails, this.userDetails);
  }

  newRelease(repoDetails, releaseDetails) {
    const path = `repos/${repoDetails}/releases`;
    return githubRequest('post', path, releaseDetails, this.userDetails);
  }

}

const githubRequest = async(httpMethod, path, releaseDetails, userDetails) => {
  const authDetails = `Basic ${Buffer
    .from(`${userDetails.username}:${userDetails.accessToken}`)
    .toString('base64')}`;

  try {
    const response = await request[httpMethod](`https://api.github.com/${path}`)
      .set('Authorization', authDetails)
      .send(releaseDetails);

    return response.body;
  } catch (error) {
    throw error.response.body;
  }
}
