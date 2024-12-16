import renderLicenseSection from "./utils/generateBadges.js";
import generateInstallSection from "./utils/generateInstallation.js";
import generateDescription from "./utils/generateDescription.js";

generateDescription("A Readme generator")
    .then(response => console.log(response))