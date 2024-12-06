
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
  
  async function run(stack, experience) {
    const chatSession = model.startChat({
      generationConfig,
      history: [
      ],
    });
  
    const result = await chatSession.sendMessage("Eres un programador con el siguiente stack tecnológico: "+ stack + ". Tu experiencia con dichas tecnologias es: " + experience + ". Debes crear una ruta de aprendizaje con 5 proyectos para mejorar tus habilidades. Tendrás que varias entre las tecnologías para aprender sobre todas, ademas debes ajustarte a tu experiencia e ir subiendo la dificultad progresivamente pero siempre ciñiéndote a tu experiencia");
    return(result.response.text())
    
  }
  
  export default run;