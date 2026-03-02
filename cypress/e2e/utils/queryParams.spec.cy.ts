import { addParamsToReferrer, buildQueryString, validateQueryParams } from '../../../src/utils/queryParams';

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

  describe('buildQueryString', () => {
    it('builds query string from params', () => {
      const qs = buildQueryString({ sub: 'paper', tema: 'SYK' });
      const params = new URLSearchParams(qs);
      expect(params.get('sub')).to.equal('paper');
      expect(params.get('tema')).to.equal('SYK');
    });

    it('skips empty values', () => {
      const qs = buildQueryString({ tema: '', gjelder: 'Utbetaling' });
      const params = new URLSearchParams(qs);
      expect(params.get('tema')).to.equal(null);
      expect(params.get('gjelder')).to.equal('Utbetaling');
    });
  });

  describe('addParamsToReferrer', () => {
    it('adds params to URL when missing', () => {
      const result = addParamsToReferrer('https://nav.no/page', { tema: 'SYK', gjelder: 'Utbetaling' });
      expect(result).to.equal('https://nav.no/page?tema=SYK&gjelder=Utbetaling');
    });

    it('skips params that already exist in URL', () => {
      const result = addParamsToReferrer('https://nav.no/page?tema=BIL', { tema: 'SYK', gjelder: 'Utbetaling' });
      const url = new URL(result);
      expect(url.searchParams.get('tema')).to.equal('BIL');
      expect(url.searchParams.get('gjelder')).to.equal('Utbetaling');
    });

    it('skips undefined param values', () => {
      const result = addParamsToReferrer('https://nav.no/page', { tema: 'SYK', gjelder: undefined });
      expect(result).to.equal('https://nav.no/page?tema=SYK');
    });

    it('handles malformed URLs gracefully by returning original', () => {
      const result = addParamsToReferrer('/relative/path', { tema: 'SYK' });
      expect(result).to.equal('/relative/path');
    });

    it('handles empty string gracefully', () => {
      const result = addParamsToReferrer('', { tema: 'SYK' });
      expect(result).to.equal('');
    });

    it('preserves existing query params and hash', () => {
      const result = addParamsToReferrer('https://nav.no/page?existing=value#section', { tema: 'SYK' });
      const url = new URL(result);
      expect(url.searchParams.get('existing')).to.equal('value');
      expect(url.searchParams.get('tema')).to.equal('SYK');
      expect(url.hash).to.equal('#section');
    });
  });
});
