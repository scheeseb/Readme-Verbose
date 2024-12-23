import inquirer from "inquirer";
import { readFile } from 'node:fs/promises'

export default async function gatherInfo() {
    // Pull all of the existing badge data
    const existingLicenseString = await readFile("./assets/data/badges.json");
    const existingLicenseData = JSON.parse(existingLicenseString);
    // Create an array of all the known license names
    const existingLicenses = Object.keys(existingLicenseData)



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
            message: "Where will this application run?",
            choices: ["Node", "Browser", "Other"]
        },
        {
            name: "tech",
            type: "input",
            message: "What technologies are implemented in this application (ie. NPM packages, JavaScript Libraries)?"
        },

    ]);

    return answers
}


async function askAboutNode() {
    const answers = await inquirer.prompt([
        {
            name: "script",
            type: "input",
            message: 'What command will be used to illicit the program?',
        },
    ])
}