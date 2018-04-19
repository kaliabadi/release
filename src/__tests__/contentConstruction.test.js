import 'chai/register-should';
import contentConstruction from '../contentConstruction';

describe('contentConstruction', () => {

    it('should return a string', () => {
        const scheduled = '13:00 18th April 2018';
        const approved = true;
        const changeLog = 'New Features\n - Super awesome stuff'

        const content = contentConstruction(scheduled, approved, changeLog);
        
        content.should.be.a('string');
    });

});