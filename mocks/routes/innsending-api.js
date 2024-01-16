const exampleEttersending = require('../data/ettersending.json');

const errorResponse = {
  message: 'Something went wrong, try again later',
  timestamp: '2024-01-08T12:38:25.645477+01:00',
  errorCode: 'somethingFailedTryLater',
};

module.exports = [
  {
    id: 'get-ettersendingssoknader',
    url: '/frontend/v1/skjema/*/soknader',
    method: 'GET',
    variants: [
      {
        id: 'none',
        type: 'json',
        options: {
          status: 200,
          body: [],
        },
      },
      {
        id: 'one',
        type: 'json',
        options: {
          status: 200,
          body: [exampleEttersending],
        },
      },
      {
        id: 'two',
        type: 'json',
        options: {
          status: 200,
          body: [exampleEttersending, exampleEttersending],
        },
      },
    ],
  },
  {
    id: 'post-ettersending',
    url: '/fyllut/v1/ettersending',
    method: 'POST',
    variants: [
      {
        id: 'success',
        type: 'json',
        options: {
          status: 200,
          body: exampleEttersending,
        },
      },
      {
        id: 'failure',
        type: 'json',
        options: {
          status: 500,
          body: errorResponse,
        },
      },
    ],
  },
];
