import { validateQueryParams } from '../../../src/utils/queryParams';

describe('queryParams', () => {
  describe('validateQueryParams', () => {
    it('should return success true for valid params', () => {
      const params = { tema: 'PEN', gjelder: 'Utbetaling', sub: 'digital' };
      const result = validateQueryParams(params);
      expect(result.success).to.equal(true);
    });

    describe('tema', () => {
      it('is not required', () => {
        const params = { tema: undefined };
        const result = validateQueryParams(params);
        expect(result.success).to.equal(true);
      });

      it('should not allow empty value', () => {
        const params = { tema: '' };
        const result = validateQueryParams(params);
        expect(result.success).to.equal(false);
      });

      it('should return error for invalid tema', () => {
        const params = { tema: 'INVALID', gjelder: 'Utbetaling', sub: 'digital' };
        const result = validateQueryParams(params);
        expect(result.success).to.equal(false);
      });
    });
    describe('gjelder', () => {
      it('is not required', () => {
        const params = { gjelder: undefined };
        const result = validateQueryParams(params);
        expect(result.success).to.equal(true);
      });

      it('should not allow empty value', () => {
        const params = { gjelder: '' };
        const result = validateQueryParams(params);
        expect(result.success).to.equal(false);
      });

      it('should return error for invalid gjelder', () => {
        const params = { tema: 'PEN', gjelder: '(select * from user)', sub: 'digital' };
        const result = validateQueryParams(params);
        expect(result.success).to.equal(false);
      });

      it('should allow spaces in value', () => {
        const params = { gjelder: 'sykmelding del D' };
        const result = validateQueryParams(params);
        expect(result.success).to.equal(true);
      });
    });
    describe('sub', () => {
      it('is not required', () => {
        const params = { sub: undefined };
        const result = validateQueryParams(params);
        expect(result.success).to.equal(true);
      });

      it('should allow paper', () => {
        const params = { sub: 'paper' };
        const result = validateQueryParams(params);
        expect(result.success).to.equal(true);
      });

      it('should allow digital', () => {
        const params = { sub: 'digital' };
        const result = validateQueryParams(params);
        expect(result.success).to.equal(true);
      });

      it('should not allow empty value', () => {
        const params = { sub: '' };
        const result = validateQueryParams(params);
        expect(result.success).to.equal(false);
      });

      it('should not allow invalid sub', () => {
        const params = { sub: '(select * from user)' };
        const result = validateQueryParams(params);
        expect(result.success).to.equal(false);
      });
    });
  });
});
