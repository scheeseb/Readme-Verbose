import inquirer from "inquirer";
import renderLicenseSection from "./utils/generateBadges.js";
import generateVerboseDescription from "./utils/generateDescription.js";
import generateInstallSection from "./utils/generateInstructions.js";
import { readFile, writeFile } from 'node:fs/promises'

async function createReadme() {
    const existingLicenseString = await readFile("./assets/data/badges.json");
    const existingLicenseData = JSON.parse(existingLicenseString)
    const existingLicenses = []

    Object.keys(existingLicenseData).forEach(license => {
        existingLicenses.push(license)
    })


    const answers = await inquirer.prompt([
        {
            name: "gitHTTPS",
            type: "input",
            message: 'Enter the Github repository https address (Ends in ".git")',
        },
        {
            name: "license",
            type: "checkbox",
            message: 'What license is the project under',
            choices: existingLicenses
        },
        {
            name: "description",
            type: "input",
            message: "Enter a description of your application"
        },
        {
            name: "deployment",
            type: "list",
            message: "Where will this application run",
            choices: ["Node", "Browser"]
        },
        {
            name: "tech",
            type: "input",
            message: "What technologies are implemented in this application (ie. NPM packages, JavaScript Libraries)"
        },

    ]);


    const repositoryTitle = answers.gitHTTPS.split("/").pop().slice(0, -4);
    const repositoryLink = answers.gitHTTPS.slice(0, -4);
    const repositoryCloneURL = answers.gitHTTPS
    const licenses = answers.license;
    const customPrompt = `
Provided Description: ${answers.description};
The platform will run on: ${answers.useCase};
Technology used to build application: ${answers.tech};
        `

    const licenseSection = await renderLicenseSection(licenses)
    const descriptionText = await generateVerboseDescription(customPrompt)




    const finalTemplate = `
# ${repositoryTitle}

## Table of Contents

1. [Overview](#overview)
2. [Installation](#installation)
3. [Usage](#usage)
4. [Contributing](#contributing)
5. [License](#license)

## Overview

${licenseSection}

${descriptionText}

${generateInstallSection(repositoryCloneURL)}

## License

${repositoryTitle} is licensed under ${licenses.pop()}
    `;

    return finalTemplate

}

async function writeNewFile(promise) {
    const data = await promise
    writeFile(`./output/README.md`, data, "utf-8")
}
writeNewFile(createReadme())