import inquirer from "inquirer";
import renderLicenseSection from "./utils/generateBadges.js";
import generateVerboseDescription from "./utils/generateDescription.js";
import generateInstallSection from "./utils/generateInstructions.js";
import { readFile } from 'node:fs/promises'

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
        }
    ]);


    const repositoryTitle = answers.gitHTTPS.split("/").pop().slice(0, -4);
    const repositoryLink = answers.gitHTTPS.slice(0, -4);
    const repositoryCloneURL = answers.gitHTTPS
    const licenses = answers.license;
    const badgeRequest = [];
    const customPrompt = `
        Provided Description: ${answers.description};
        Provided use cases: ${answers.useCase};
        Technology used to build application: ${answers.tech};
        `
    let finalTemplate = `
# ${repositoryTitle}

## Table of Contents

1. [Overview](#overview)
2. [Installation](#Installation)
3. [Usage](#Usage)
4. [Licenses](#Licenses)
5. [Contributing](#Contributing)
6. [Tests](#tests)

    `;

    licenses.forEach(license => {
        badgeRequest.push(existingLicenseData[license])
    });


    finalTemplate += await renderLicenseSection(licenses)

    const descriptionText = answers.description
    const section = `
## Overview

${descriptionText}
`;

    finalTemplate += section


    finalTemplate += generateInstallSection(repositoryCloneURL)

    finalTemplate += `
## license

${repositoryTitle} is licensed under the ${licenses.pop()}
    `

    console.log(finalTemplate)

}
createReadme()