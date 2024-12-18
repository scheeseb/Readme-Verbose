import inquirer from 'inquirer';


export default function generateInstallSection(gitHTTPS) {
    const repositoryLink = gitHTTPS.slice(0, -4)

    // Generate a Markdown
    const installSection = `
## Installation

\`\`\`git clone ${gitHTTPS}\`\`\`

\`\`\`npm install\`\`\`
        
## Usage

Run the following command to be prompted to create a custom readme.md file.

\`\`\`node index.js\`\`\`

## Contributing                                                                           

You can open a pull request or issue on [Github](${repositoryLink})
        `

    return installSection
}
