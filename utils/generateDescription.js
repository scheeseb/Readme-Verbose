import ollama from 'ollama'
import inquirer from 'inquirer';


function promptForDescription() {
    return inquirer.prompt([
        {
            "name": "description",
            "type": "input",
            "message": "Enter a description of your application"
        },
        {
            "name": "useCase",
            "type": "input",
            "message": "List a few possible use cases for your application"
        },
        {
            "name": "tech",
            "type": "input",
            "message": "What technologys are used in your application"
        },

    ]).then(answers => {
        // Generate a prompt for the AI
        const customPrompt = `
        Provided Description: ${answers.description};
        Provided use cases: ${answers.useCase};
        Technology used to build application: ${answers.tech};
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
        SYSTEM "Take the following brief description and expand it into a detailed description, 1-3 paragraphs, for a README file. The expanded content should include a clear and concise explanation and any relevant details to help users understand the purpose and functionality. Ensure the tone is professional and the content is beginner-friendly but informative. Do not use any special formatting or linebreaks"
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
