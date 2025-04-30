import { isValidFormPath } from '../../../src/utils/formDataUtil';

describe('utils/formDataUtil', () => {
  describe('isValidFormPath', () => {
    it('should return false for undefined', () => {
      expect(isValidFormPath(undefined)).to.eq(false);
    });
    it('should return false for empty string', () => {
      expect(isValidFormPath('')).to.eq(false);
    });
    it('should return false for invalid form paths', () => {
      expect(isValidFormPath('index.js')).to.eq(false);
      expect(isValidFormPath('NAV123456')).to.eq(false);
      expect(isValidFormPath('(select%20198766*667891%20from%20DUAL)')).to.eq(false);
      expect(isValidFormPath("lospostBDgd1qkI'))%20OR%20886=(SELECT%20886%20FROM%20PG_SLEEP(15))--")).to.eq(false);
      expect(isValidFormPath('if(now()=sysdate(),sleep(15),0)')).to.eq(false);
    });
    it('should return true for valid form paths', () => {
      expect(isValidFormPath('nav123456')).to.eq(true);
      expect(isValidFormPath('testskjemagruppe')).to.eq(true);
    });
  });
});
