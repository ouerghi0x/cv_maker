import { AzureOpenAI } from "openai";

const endpoint = "https://moham-mdvx8nav-eastus2.cognitiveservices.azure.com/";
const modelName = "gpt-4.1-mini";
const deployment = "gpt-4.1-mini";

export async function Azure_generateLatex(prompt:string,data:string) {

  const apiKey = process.env.azure_openai

  const apiVersion = "2024-04-01-preview";
  const options = { endpoint, apiKey, deployment, apiVersion }

  const client = new AzureOpenAI(options);

  const response = await client.chat.completions.create({
    messages: [
      { role:"system", content: prompt },
      { role:"user", content: data }
    ],
    max_completion_tokens: 13107,
      temperature: 1,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      model: modelName
  });
   console.log(response)

  
  return (response.choices[0].message.content);
}

