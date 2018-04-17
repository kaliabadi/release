const generateBodyContent = (scheduled, approved, changeLogContents) => {
    const scheduledContent = scheduled ? `**Release has been scheduled for: ${scheduled}**` : '**No release time has been scheduled at this poing**';
    if(!changeLogContents) '**No change log has been provided for this release**'

    return `
    
    ${scheduledContent}

    **This release has been approved by the PO: ${approved}**

    ------------------------------------------------------------------------------------

    ${changeLogContents}

    `
}

module.exports = {
    generateBodyContent
}
