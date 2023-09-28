const forms = require("../data/fyllut/forms.json");
const form1 = require("../data/fyllut/form1.json");
const form2 = require("../data/fyllut/form2.json");
const archiveSubjects = require("../data/fyllut/archiveSubjects.json");
const navUnits = require("../data/fyllut/navUnits.json");

module.exports = [
  {
    id: "get-forms",
    url: "/fyllut/api/forms",
    method: "GET",
    variants: [
      {
        id: "all",
        type: "json",
        options: {
          status: 200,
          body: forms,
        },
      },
    ],
  },
  {
    id: "get-form",
    url: "/fyllut/api/forms/*",
    method: "GET",
    variants: [
      {
        id: "not-found",
        type: "text",
        options: {
          status: 404,
          body: "NOT FOUND",
        }
      },
      {
        id: "form1",
        type: "json",
        options: {
          status: 200,
          body: form1,
        }
      },
      {
        id: "form2",
        type: "json",
        options: {
          status: 200,
          body: form2,
        }
      },
    ]
  },
  {
    id: "get-archive-subjects",
    url: "/fyllut/api/common-codes/archive-subjects",
    method: "GET",
    variants: [
      {
        id: "all",
        type: "json",
        options: {
          status: 200,
          body: archiveSubjects,
        }
      }
    ]
  },
  {
    id: "get-nav-units",
    url: "/fyllut/api/enhetsliste",
    method: "GET",
    variants: [
      {
        id: "all",
        type: "json",
        options: {
          status: 200,
          body: navUnits,
        }
      }
    ]
  }
];