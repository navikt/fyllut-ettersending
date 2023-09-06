const exampleEttersending = require("../data/ettersending.json");

module.exports = [
  {
    id: "get-ettersendingssoknader",
    url: "/frontend/v1/skjema/*/soknader",
    method: "GET",
    variants: [
      {
        id: "none",
        type: "json",
        options: {
          status: 200,
          body: [],
        },
      },
      {
        id: "one",
        type: "json",
        options: {
          status: 200,
          body: [exampleEttersending],
        },
      },
      {
        id: "two",
        type: "json",
        options: {
          status: 200,
          body: [exampleEttersending, exampleEttersending],
        },
      },
    ],
  },
];
