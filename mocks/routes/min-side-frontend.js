module.exports = [
  {
    id: "get-min-side-frontend",
    url: "/min-side-frontend/*",
    method: "GET",
    variants: [
      {
        id: "success",
        type: "static",
        options: {
          path: "mocks/data/min-side-frontend",
          headers: {
            "content-type": "text/html",
          },
        },
      },
    ],
  },
];
