import inquirer from 'inquirer';


export default function generateInstallSection() {
    return inquirer.prompt([
        {
            "name": "gitHTTPS",
            "type": "input",
            "message": "What is the HTTPS address of the Git repository"
        }

    ]).then(answers => {
        // Generate a prompt for the AI
        const installSection = `
        # Installation

       \`\`\`git clone ${answers.gitHTTPS}\`\`\`

       \`\`\`npm install\`\`\`
        `

        return installSection
    })
}