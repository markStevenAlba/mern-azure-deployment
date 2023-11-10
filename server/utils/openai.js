
const { Configuration, OpenAIApi } = require('openai');

// Initialize OpenAI API
const configuration = new Configuration({
    apiKey: process.env.openApiKey,
});

const openai = new OpenAIApi(configuration);




const ChatGPTFunction = async (text) => {
    try {

        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: text,
            temperature: .1,
            max_tokens: 2048,
            top_p: 1,
            // frequency_penalty: 1,
            // presence_penalty: 1,
        });;
        return response.data.choices[0].text;
    } catch (err) {
        console.log(err.response.data)
        return err
    }

};

module.exports = ChatGPTFunction;
