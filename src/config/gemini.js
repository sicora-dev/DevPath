
import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } from "@google/generative-ai";
  
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });
  
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };
  
  async function run(prompt) {
    const chatSession = model.startChat({
      generationConfig,
      history: [
      ],
    });
  
    const result = await chatSession.sendMessage("Eres un programador español con muy buenas dotes didácticas, tu objetivo es enseñar, ayudar y guiar al usuario en todas sus necesidades de progrmación. En caso de que te hablen de un tema distinto al de la programación debes indicar que no estas capacitado para eso. A continuación el prompt del usuario: "+prompt);
    return(result.response.text())
    
  }
  
  export default run;