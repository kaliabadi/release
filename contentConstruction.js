const generateBodyContent = (scheduled, preReleaseValue, changeLogContents) => {
    const scheduledContent = scheduled ? `**Release has been scheduled for: ${scheduled}**` : '**No release time has been scheduled at this poing**';
    if(!changeLogContents) '**No change log has been provided for this release**'
    if(!preReleaseValue) preReleaseValue = 'false';

    return `
    
    ${scheduledContent}

    **This release has been approved by the PO: ${preReleaseValue}**

    ------------------------------------------------------------------------------------

    ${changeLogContents}

    `
}

module.exports = {
    generateBodyContent
}
