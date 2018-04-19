import request from 'superagent';

export default class GithubApi {

    constructor(userDetails) {
        this._userDetails = userDetails;
    }

    get userDetails() {
        return this._userDetails;
    }

    latestRelease(org, repo) {
        const path = `repos/${org}/${repo}/releases/latest`;
        return githubRequest('get', path, null, this.userDetails);
    }

    updateRelease(org, repo, releaseId, releaseDetails) {
        const path = `repos/${org}/${repo}/releases/${releaseId}`;
        return githubRequest('patch', path, releaseDetails, this.userDetails);
    }

    newRelease(org, repo, releaseDetails) {
        const path = `repos/${org}/${repo}/releases`;
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
        console.error('Bad response from Github: ', error.response.body);
        return {error};
    }
}
