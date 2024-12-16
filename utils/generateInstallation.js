import ollama from 'ollama'
import inquirer from 'inquirer';


function promptForInstallInstruction() {
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

        return customPrompt
    })
}




async function createAIModel() {
    const list = await ollama.list()
    const models = list.models;

    if (!models.some(model => model.name === "CodeGeneration:latest")) {
        const modelfile = `
        FROM codellama
        SYSTEM "Take the following brief description and expand it into a detailed description, 3-5 paragraphs, for a README file. The expanded content should include a clear and concise explanation and any relevant details to help users understand the purpose and functionality. Ensure the tone is professional and the content is beginner-friendly but informative. Do not use any special formatting or linebreaks"
        `
        await ollama.create({ model: 'CodeGeneration', modelfile: modelfile })
        console.log("Downloaded code generation AI")
    }
}


async function generateVerboseDescription(prompt) {
    const response = await ollama.chat({
        model: 'CodeGeneration:latest',
        messages: [{ role: 'user', content: prompt }],
    })
    return response.message.content
}

export default function generateDescription() {
    createAIModel()

    return promptForDescription()
        .then(prompt => {
            console.log(`prompt: ${prompt}`)
            generateVerboseDescription(prompt)
                .then(description => {
                    console.log(`Description: ${description}`)
                    return description
                })
        })
}
