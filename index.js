import inquirer from "inquirer";
import renderLicenseSection from "./utils/generateBadges.js";
import generateVerboseDescription from "./utils/generateDescription.js";
import generateInstallSection from "./utils/generateInstructions.js";
import { readFile, writeFile } from 'node:fs/promises'

async function createReadme() {
    // Pull all of the existing badge data
    const existingLicenseString = await readFile("./assets/data/badges.json");
    const existingLicenseData = JSON.parse(existingLicenseString)
    const existingLicenses = []

    // Create an array of all the known license names
    Object.keys(existingLicenseData).forEach(license => {
        existingLicenses.push(license)
    })

    // Ask the user for the relevant information
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

    // Extract the title and url from the provided https address
    // Save the license selected by the user
    const repositoryTitle = answers.gitHTTPS.split("/").pop().slice(0, -4);
    const repositoryCloneURL = answers.gitHTTPS
    const licenses = answers.license;
    // Use the users answers to craft a custom prompt for the AI
    const customPrompt = `
Provided Description: ${answers.description};
The platform will run on: ${answers.useCase};
Technology used to build application: ${answers.tech};
        `
    // Render the licenses and the description
    const licenseSection = await renderLicenseSection(licenses)
    const descriptionText = await generateVerboseDescription(customPrompt)



    // Craft the final template that will be returned
    const finalTemplate = `
# ${repositoryTitle}

## Table of Contents

1. [Overview](#Overview)
2. [Installation](#Installation)
3. [Usage](#Usage)
4. [Contributing](#Contributing)
5. [License](#License)

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

// Call the function to write a new file
writeNewFile(createReadme())