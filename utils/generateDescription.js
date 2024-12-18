import ollama from 'ollama'


async function createAIModel() {
    const list = await ollama.list()
    const models = list.models;

    if (!models.some(model => model.name === "CodeGeneration:latest")) {
        const modelfile = `
        FROM codellama
        SYSTEM "Take the following brief description and expand it into a single, continuous paragraph with no headers, section breaks, or formatting. Ensure the explanation is clear and beginner-friendly, providing relevant details about the purpose and functionality. Do not use lists, bullet points, or any structural elements; return only a plain block of text."
        `
        await ollama.create({ model: 'CodeGeneration', modelfile: modelfile })
        console.log("Downloaded code generation AI")
    }
}


export default async function generateVerboseDescription(prompt) {
    await createAIModel()

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
