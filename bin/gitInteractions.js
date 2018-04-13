const request = require('superagent');
const fs = require('fs');

const latestRelease = async (userDetails, repo, org) => {

    const authDetails = 'Basic ' + new Buffer(`${userDetails.username}:${userDetails.accessToken}`).toString('base64');

    let response = await request
        .get(`https://api.github.com/repos/${org}/${repo}/releases/latest`)
        .set('Authorization', authDetails)

    return response.body;
};

const newRelease = async (userDetails, repo, org, changeLogPath) => {
    const authDetails = 'Basic ' + new Buffer(`${userDetails.username}:${userDetails.accessToken}`).toString('base64');
    const changeLogContents = fs.readFileSync(changeLogPath, 'utf8').toString();

    var releaseDetails = {
        "tag_name": "v1.0.3",
        "target_commitish": "master",
        "name": "v1.0.3",
        "body": changeLogContents,
        "draft": false,
        "prerelease": true
    };

    let response = await request
        .post(`https://api.github.com/repos/${org}/${repo}/releases`)
        .set('Authorization', authDetails)
        .send(releaseDetails);

    return response.body;
}

const updateRelease = async (userDetails, repo, org) => {
    const authDetails = 'Basic ' + new Buffer(`${userDetails.username}:${userDetails.accessToken}`).toString('base64');

    const latestReleaseBody = await latestRelease(userDetails, repo, org);
    
    console.log(latestReleaseBody);

    const response = await request
        .patch(`https://api.github.com/repos/${org}/${repo}/releases/${latestReleaseBody.id}`)
        .set('Authorization', authDetails)
        .send({
            "tag_name": "v1.0.2",
            "target_commitish": "master",
            "name": "v1.0.1",
            "body": "Patched release",
            "draft": false,
            "prerelease": true
        });
    
    return response.body;
}

module.exports = {
    latestRelease,
    newRelease,
    updateRelease
}

