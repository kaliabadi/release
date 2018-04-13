const request = require('superagent');
const fs = require('fs');

const latestRelease = async (userDetails, repo, org) => {

    const authDetails = 'Basic ' + new Buffer(`${userDetails.username}:${userDetails.accessToken}`).toString('base64');

    let response = await request
        .get(`https://api.github.com/repos/${org}/${repo}/releases/latest`)
        .set('Authorization', authDetails)

    return response.body;
};

const newRelease = async (userDetails, repo, org, changeLogPath, version, approved, scheduled) => {
    const authDetails = 'Basic ' + new Buffer(`${userDetails.username}:${userDetails.accessToken}`).toString('base64');
    const changeLogContents = fs.readFileSync(changeLogPath, 'utf8').toString();
    const preReleaseValue = approved ? false : true;
    const releaseBody = `   Release has been scheduled for: ${scheduled}
    
    This release has been approved by the PO: ${preReleaseValue}

    ${changeLogContents}
    `

    var releaseDetails = {
        "tag_name": version,
        "target_commitish": "master",
        "name": version,
        "body": changeLogContents,
        "draft": false,
        "prerelease": preReleaseValue
    };

    let response = await request
        .post(`https://api.github.com/repos/${org}/${repo}/releases`)
        .set('Authorization', authDetails)
        .send(releaseDetails);

    return response.body;
}

const updateRelease = async (userDetails, repo, org, approved, scheduled, changeLogPath) => {
    const authDetails = 'Basic ' + new Buffer(`${userDetails.username}:${userDetails.accessToken}`).toString('base64');
    const latestReleaseResponse = await latestRelease(userDetails, repo, org);
    const preReleaseValue = approved ? false : true;
    const changeLogContents = fs.readFileSync(changeLogPath, 'utf8').toString();
    const releaseBody = `   Release has been scheduled for: ${scheduled}
    
This release has been approved by the PO: ${preReleaseValue}

------------------------------------------------------------------------------------

${changeLogContents}
    `

    const response = await request
        .patch(`https://api.github.com/repos/${org}/${repo}/releases/${latestReleaseResponse.id}`)
        .set('Authorization', authDetails)
        .send({
            "body": releaseBody,
            "prerelease": preReleaseValue
        });
    
    return response.body;
}

module.exports = {
    latestRelease,
    newRelease,
    updateRelease
}

