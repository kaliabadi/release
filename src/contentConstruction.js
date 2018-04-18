export default (scheduled, approved, changeLog) => {
  const scheduledContent = scheduled ? `Release has been scheduled for: ${scheduled}` : 'No release time has been scheduled at this point';
  const changeLogContents = changeLog || 'No change log has been provided for this release';

  return `
    
${scheduledContent}

This release has been approved by the PO: ${approved}

------------------------------------------------------------------------------------

${changeLogContents}

    `;
};
