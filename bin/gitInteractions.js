const request = require('superagent');
const fs = require('fs');

const latestRelease = async (userDetails, {repo, org}) => {
    
    const authDetails = 'Basic ' + new Buffer(`${userDetails.username}:${userDetails.accessToken}`).toString('base64');
    
    let response = await request
        .get(`https://api.github.com/repos/${org}/${repo}/releases/latest`)
        .set('Authorization', authDetails)

    return response.body;
};

const readFileAsString = (file) => {
    try{
        return fs.readFileSync(file, 'utf8').toString();
    }catch (err) {
        console.err(`Failed to read the file: ${file}, Error: `, err);
        return 'No change log provided.'
    }
};

const newRelease = async (userDetails, {repo, org, changeLog, version, approved, scheduled}) => {
    const authDetails = 'Basic ' + new Buffer(`${userDetails.username}:${userDetails.accessToken}`).toString('base64');
    const changeLogContents = readFileAsString(changeLog);
    const releaseBody = `   Release has been scheduled for: ${scheduled}
    
    This release has been approved by the PO: ${approved}

    ${changeLogContents}
    `

    var releaseDetails = {
        "tag_name": version,
        "target_commitish": "master",
        "name": version,
        "body": changeLogContents,
        "draft": false,
        "prerelease": !approved
    };

    try{
        let response = await request
            .post(`https://api.github.com/repos/${org}/${repo}/releases`)
            .set('Authorization', authDetails)
            .send(releaseDetails);
        return response.body;
    }catch (err){
        console.error('Bad response from Github: ', err.response.body);
    }
}

const updateRelease = async (userDetails, {repo, org, approved, scheduled, changeLog}) => {
    const authDetails = 'Basic ' + new Buffer(`${userDetails.username}:${userDetails.accessToken}`).toString('base64');
    const latestReleaseResponse = await latestRelease(userDetails, {repo, org});
    const changeLogContents = readFileAsString(changeLog);
    const releaseBody = `   Release has been scheduled for: ${scheduled}
    
This release has been approved by the PO: ${approved}

------------------------------------------------------------------------------------

${changeLogContents}
    `

    try{
        const response = await request
            .patch(`https://api.github.com/repos/${org}/${repo}/releases/${latestReleaseResponse.id}`)
            .set('Authorization', authDetails)
            .send({
                "body": releaseBody,
                "prerelease": !approved
            });

        return response.body;
    }catch (err){
        console.error('Bad response from Github: ', err.response.body);
    }
}


module.exports = {
    latestRelease,
    newRelease,
    updateRelease
}
