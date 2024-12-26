import inquirer from "inquirer";
import renderLicenseSection from "./utils/generateBadges.js";
import generateVerboseDescription from "./utils/generateDescription.js";
import gatherInfo from "./utils/prompt.js";
import { writeFile } from 'node:fs/promises'

async function createReadme() {


    // Ask the user for the relevant information
    const answers = await gatherInfo()
    console.log(answers)

    // Extract the title and url from the provided https address
    // Save the license selected by the user
    const repositoryTitle = answers.gitHTTPS.split("/").pop().slice(0, -4);
    const repositoryLink = answers.gitHTTPS.slice(0, -4);
    const repositoryCloneURL = answers.gitHTTPS
    const licenses = answers.license;
    // Use the users answers to craft a custom prompt for the AI
    const customPrompt = `
Repository Title: ${repositoryTitle}
Provided Description: ${answers.description};
The platform will run on: ${answers.useCase};
Technology used to build application: ${answers.tech};
        `
    // Render the licenses and the description
    const licenseSection = await renderLicenseSection(licenses)
    const descriptionText = await generateVerboseDescription(customPrompt)
    const installCommand = () => {
        if (answers.deployment === "Node") {
            return `\`\`\`npm install\`\`\``
        } else if (answers.deployment === "Other") {
            return answers.required
        }

        return ``
    }
    const usage = () => {
        if (answers.deployment === "Browser") {
            return `Open the index.html in your browser or see our deployment on [Githib](${repositoryLink})`
        } else {
            return `
Run the following command to run the script.

\`\`\`${answers.usage}\`\`\``
        }
    }


    // Craft the final template that will be returned
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

## Installation

\`\`\`git clone ${repositoryCloneURL}\`\`\`

${installCommand()}

        
## Usage

${usage()}

## Contributing                                                                           

You can open a pull request or issue on [Github](${repositoryLink})

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