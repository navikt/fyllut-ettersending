module.exports = [
  {
    id: 'get-send-inn-frontend',
    url: '/send-inn-frontend/*',
    method: 'GET',
    variants: [
      {
        id: 'success',
        type: 'static',
        options: {
          path: 'mocks/data/send-inn-frontend',
          headers: {
            'content-type': 'text/html',
          },
        },
      },
    ],
  },
];
