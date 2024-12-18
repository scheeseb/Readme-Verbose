import ollama from 'ollama'


async function createAIModel() {
    const list = await ollama.list()
    const models = list.models;

    if (!models.some(model => model.name === "CodeGeneration:latest")) {
        const modelfile = `
        FROM codellama
        SYSTEM "Take the following brief description and expand it into a detailed description for a README file. The expanded content should include a clear and concise explanation and any relevant details to help users understand the purpose and functionality. Ensure the tone is professional and the content is beginner-friendly but informative. Do not use any formatting or linebreaks, return a simple string"
        `
        await ollama.create({ model: 'CodeGeneration', modelfile: modelfile })
        console.log("Downloaded code generation AI")
    }
}


export default async function generateVerboseDescription(prompt) {
    createAIModel()

    const response = await ollama.chat({
        model: 'CodeGeneration:latest',
        messages: [{ role: 'user', content: prompt }],
    })
    return response.message.content
}

// function generateDescription() {


//     return promptForDescription()
//         .then(prompt => {
//             console.log(`prompt: ${prompt}`)
//             generateVerboseDescription(prompt)
//                 .then(description => {
//                     console.log(`Description: ${description}`)
//                     return description
//                 })
//         })
// }
