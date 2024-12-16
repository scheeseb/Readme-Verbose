import inquirer from 'inquirer';
import { appendFile } from 'node:fs/promises';

function askMe() {
    inquirer.prompt([
        {
            type: "input",
            message: "Enter the title",
            name: "title"
        },
        {
            type: "input",
            message: "Enter the SVG link",
            name: "svgLink"
        },
        {
            type: "input",
            message: "Enter the Url link",
            name: "urlLink"
        }
    ])
        .then(answers => {

            // The new entry
            const jsonObject =
                `,
            "${answers.title}": {
                "svg": "${answers.svgLink}",
                "url": "${answers.urlLink}"
            }`;
            // Adds the new entry
            appendFile("/data/badges.json", jsonObject, "utf-8")
        })
        .then(() => {
            askMe()
        })
}
askMe()