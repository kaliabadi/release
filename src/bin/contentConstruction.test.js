import fs from 'fs';
import contentConstruction from './contentConstruction';

describe('contentConstruction', () => {

    it('should return a expected content', () => {
        const expectedContent = fs.readFileSync('./src/bin/templates/expectedTemplate.test.txt').toString();
        const scheduled = '13:00 18th April 2018';
        const approved = true;
        const changeLog = 'Super awesome stuff'

        const content = contentConstruction(scheduled, approved, changeLog);
        
        content.should.equal(expectedContent);
    });
});
