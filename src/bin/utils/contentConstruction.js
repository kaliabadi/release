import fs from 'fs';

export default (scheduled, approved, changelog, freeText) => {
  const releaseTemplate = fs.readFileSync('./src/bin/templates/releaseTemplate.txt', 'utf8').toString();

  let releaseContent = releaseTemplate.replace('##scheduledContent', scheduled);
  releaseContent = releaseContent.replace('##approved', approved);
  releaseContent = releaseContent.replace('##changeLogContents', changelog);
  releaseContent = releaseContent.replace('##freeText', freeText);

  return releaseContent;
}
