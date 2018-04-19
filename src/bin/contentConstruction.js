import fs from 'fs';

export default (scheduled, approved, changelog) => {
  const releaseTemplate = fs.readFileSync('./src/bin/templates/releaseTemplate.txt', 'utf8').toString();

  let releaseContent = releaseTemplate.replace('##scheduledContent', scheduled);
  releaseContent = releaseContent.replace('##approved', approved);
  releaseContent = releaseContent.replace('##changeLogContents', changelog);
  
  return releaseContent;
}



// export default (scheduled, approved, changeLog) => {
//   const scheduledContent = scheduled ? `Release has been scheduled for: ${scheduled}` : 'No release time has been scheduled at this point';
//   const changeLogContents = changeLog || 'No change log has been provided for this release';

//   return `
    
// ${scheduledContent}

// This release has been approved by the PO: ${approved}

// ------------------------------------------------------------------------------------

// ${changeLogContents}

//     `;
// };
