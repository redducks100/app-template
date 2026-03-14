// @ts-check

/** @type {import("syncpack").RcFile} */
module.exports = {
  versionGroups: [
    {
      label: "React packages use named catalog",
      dependencies: ["react", "react-dom", "@types/react", "@types/react-dom"],
      pinVersion: "catalog:react19",
    },
    {
      label: "Local packages use workspace protocol",
      dependencies: ["@app/*"],
      pinVersion: "workspace:*",
    },
    {
      label: "All dependencies use caret range",
      dependencies: ["**"],
      preferVersion: "highestSemver",
      policy: "sameRange",
    },
  ],
};
