const forms = require('../data/fyllut/forms.json');
const form1 = require('../data/fyllut/form1.json');
const form2 = require('../data/fyllut/form2.json');
const form2En = require('../data/fyllut/form2-en.json');
const form3 = require('../data/fyllut/form3.json');
const archiveSubjectsNb = require('../data/fyllut/archiveSubjects-nb.json');
const archiveSubjectsNn = require('../data/fyllut/archiveSubjects-nn.json');
const archiveSubjectsEn = require('../data/fyllut/archiveSubjects-en.json');
const navUnits = require('../data/fyllut/navUnits.json');

module.exports = [
  {
    id: 'get-forms',
    url: '/fyllut/api/forms',
    method: 'GET',
    variants: [
      {
        id: 'all',
        type: 'json',
        options: {
          status: 200,
          body: forms,
        },
      },
    ],
  },
  {
    id: 'get-form-1',
    url: '/fyllut/api/forms/form1',
    method: 'GET',
    variants: [
      {
        id: 'success',
        type: 'json',
        options: {
          status: 200,
          body: form1,
        },
      },
      {
        id: 'not-found',
        type: 'text',
        options: {
          status: 404,
          body: 'NOT FOUND',
        },
      },
    ],
  },
  {
    id: 'get-form-2',
    url: '/fyllut/api/forms/form2',
    method: 'GET',
    variants: [
      {
        id: 'success',
        type: 'middleware',
        options: {
          middleware: (req, res) => {
            const { lang } = req.query;
            res.status(200);
            if (lang === 'en') {
              return res.send(form2En);
            }
            res.send(form2);
          },
        },
      },
      {
        id: 'not-found',
        type: 'text',
        options: {
          status: 404,
          body: 'NOT FOUND',
        },
      },
    ],
  },
  {
    id: 'get-form-3',
    url: '/fyllut/api/forms/form3',
    method: 'GET',
    variants: [
      {
        id: 'success',
        type: 'json',
        options: {
          status: 200,
          body: form3,
        },
      },
      {
        id: 'not-found',
        type: 'text',
        options: {
          status: 404,
          body: 'NOT FOUND',
        },
      },
    ],
  },
  {
    id: 'get-archive-subjects',
    url: '/fyllut/api/common-codes/archive-subjects',
    method: 'GET',
    variants: [
      {
        id: 'all',
        type: 'middleware',
        options: {
          middleware: (req, res) => {
            res.status(200);
            res.contentType('application/json; charset=UTF-8');
            const acceptLanguage = req.headers['accept-language'] || 'nb';
            switch (acceptLanguage) {
              case 'nn':
                res.send(archiveSubjectsNn);
                return;
              case 'en':
                res.send(archiveSubjectsEn);
                return;
              case 'nb':
              default:
                res.send(archiveSubjectsNb);
                return;
            }
          },
        },
      },
    ],
  },
  {
    id: 'get-nav-units',
    url: '/fyllut/api/enhetsliste',
    method: 'GET',
    variants: [
      {
        id: 'all',
        type: 'json',
        options: {
          status: 200,
          body: navUnits,
        },
      },
    ],
  },
  {
    id: 'download-frontpage',
    url: '/fyllut/api/foersteside',
    method: 'POST',
    variants: [
      {
        id: 'success',
        type: 'json',
        options: {
          status: 200,
          body: {},
        },
      },
      {
        id: 'error',
        type: 'json',
        options: {
          status: 500,
          body: {
            message: 'Internal server error',
          },
        },
      },
    ],
  },
];
