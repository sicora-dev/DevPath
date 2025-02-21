import { GoogleGenerativeAI } from "@google/generative-ai";
import i18n from "i18next";
import toast from 'react-hot-toast';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const STORAGE_KEY = 'gemini_rate_limit';

const RATE_LIMIT = {
  maxRequests: 10, // Maximum requests
  timeWindow: 60000, // Time window in milliseconds (1 minute)
  requests: [], // Array to store request timestamps
};

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const chatbotConfig = {
  temperature: 0.5,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

class RateLimitError extends Error {
  constructor(waitTime) {
    super(`Rate limit exceeded. Please wait ${Math.ceil(waitTime/1000)} seconds.`);
    this.name = 'RateLimitError';
    this.waitTime = waitTime;
  }
}

function getRateLimitData() {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : { requests: [] };
}

function saveRateLimitData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function checkRateLimit() {
  const now = Date.now();
  const timeWindow = now - RATE_LIMIT.timeWindow;
  
  // Get stored requests
  const storedData = getRateLimitData();
  let requests = storedData.requests;
  
  // Clean old requests
  requests = requests.filter(time => time > timeWindow);
  
  if (requests.length >= RATE_LIMIT.maxRequests) {
    const oldestRequest = requests[0];
    const waitTime = RATE_LIMIT.timeWindow - (now - oldestRequest);
    const error = new RateLimitError(waitTime);
    toast.error(error.message);
    throw error;
  }
  
  // Add new request and save
  requests.push(now);
  saveRateLimitData({ requests });
  return true;
}

async function runChat(history, userInput, project) {
  try {
    checkRateLimit();

    const language = i18n.language || "en";
    const chatSession = model.startChat({
      chatbotConfig,
      history,
    });
    const prompt = `You are TechMentor, an experienced software engineering coach.
  Provide all responses in ${language}.

  Context:
  - Selected project: ${project.title || "No project selected"}
  - Project description: ${project.body || "No description"}
  - User input: ${userInput || "No input"}

  Your role:
  As a mentor, guide the user through the selected project by:
  - Answering all questions related to the project
  - Providing step-by-step instructions when needed
  - Offering tips and best practices
  - Helping with troubleshooting and debugging
  - Suggesting additional resources if needed

  Focus only on the selected project and provide comprehensive support for it.

  Remember:
  - Ensure clarity and conciseness in explanations
  - Add line breaks to make the text more legible and comfortable to read;
  - Adapt complexity to the user's skill level
  - Use proper Markdown formatting
  - Maintain consistent spacing
  - Keep descriptions concise
  - Adapt complexity to experience level
  - Add decorations to make it even more friendly
  - Envolve code snippets in code blocks
  - Use text and make it clickable instead of displaying the full URL`;

    const result = await chatSession.sendMessage(prompt);
    const response = result.response.text();
    return response;
  } catch (error) {
    if (error.message.includes("Rate limit exceeded")) {
      
      throw error;
    }
    
    throw new Error("Chat request failed: " + error.message);
  }
}

async function autocomplete(pdfContent) {
  try {
    checkRateLimit();
    const language = i18n.language || "en";
    const chatSession = model.startChat({
      chatbotConfig,
      history: [],
    });
    const prompt = `You are TechMentor, an experienced software engineering coach.
    Provide all responses in ${language}.
  
    Context:
    - User input: ${pdfContent || "No input"}
  
    Your role:
    As a mentor, analyze the provided CV to extract:
    - The developer's tech stack
    - The developer's skill level for each technology
    - The developer's information that could be relevant to suggest projects
  
    If the CV is not related to IT, software development, or similar fields, or if it is not a CV at all, return ONLY "not-cv".
  
    Provide the tech stack, skill levels, and observations separated by a semicolon (|).
  
    Response Template:
    [Tech Stack]|[Skill Levels]|[Observations]
    
    Remember:
    - Stick to the template
    - If not a CV, return "not-cv" only
    `;
    const result = await chatSession.sendMessage(prompt);
    const response = await result.response.text();
    return response;
  } catch (error) {
    if (error.message.includes("Rate limit exceeded")) {
    
      throw error;
    }
    
    throw new Error("Request failed: " + error.message);
  }
}

async function run(stack, skill, observations, restricted) {
  try {
    checkRateLimit();
    const language = i18n.language || "en";
    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });
    const prompt = language.includes("es")
      ? `You are DevPath, an experienced software engineering coach.
    Provide all responses in Spanish, formatted in Markdown.
  
    Context:
    - Developer stack: ${stack || "Not defined"}
    - Skill level: ${skill || "No skill level"}
    - Observations: ${observations || "No observations"}
    - Strict mode: ${restricted ? "Enabled" : "Disabled"}
  
    Your role:
    As a mentor, analyze their skills and observations to suggest 5 practical projects that:
    - Progress in difficulty while staying within their skill level
    - Use different aspects of their tech stack
    - Are real-world focused and market-relevant
    - If strict mode is enabled, only use technologies mentioned in the stack, no extra frameworks, libraries or other stuff, only the mentioned stack, otherwise, feel free to suggest any relevant technology
    
    When processing observations:
    - Only consider technical observations related to coding experience
    - Filter out personal/unrelated comments (e.g. health issues, weather)
    - Use relevant observations to refine project suggestions by:
      * Learning style preferences
      * Technical interests
      * Career goals
      * Previous project experience
      * Specific challenges faced
  
    Project Complexity Guidelines:
  
    For No Experience:
    - Start with programming fundamentals
    - Focus on single technology/language
    - Build confidence through small wins
    - Include guided learning paths
    - Recommend foundational resources
  
    For Beginner with Stack:
    - Simple applications with basic features
    - Focus on stack fundamentals
    - Include basic CRUD operations
    - Build understanding of development workflow
    - Practice basic programming patterns
  
    For Full Stack Expert:
    - Complex distributed systems
    - Advanced architectural challenges
    - High-scale performance optimization
    - Innovation-focused projects
    - Industry best practices implementation
  
    Skill Level Adaptation:
    if (no_experience) {
      - Project 1: Basic programming concepts (40% difficulty)
      - Project 2: Simple interactive applications (50%)
      - Project 3: Basic data management (60%)
      - Project 4: Multi-feature application (65%)
      - Project 5: Small full project (70%)
    } else if (full_stack_expert) {
      - Project 1: Complex system design (85%)
      - Project 2: Advanced architecture (88%)
      - Project 3: High-scale solution (90%)
      - Project 4: Enterprise integration (93%)
      - Project 5: Innovation project (95%)
    }
  
    Response Parameters:
    - Ensure each project builds upon skills from previous ones
    - Include specific success metrics for each project
    - Add difficulty percentage for each project
    - Suggest realistic timeline based on experience level
    - Focus on portfolio-worthy deliverables
  
    Format your response using this template:
  
    --INTRO_START--
    # Introducción
    [Introducción]
    --INTRO_END--
  
    --ANALYSIS_START--
    ## Análisis de Stack Tecnológico
    [Análisis detallado]
    --ANALYSIS_END--
  
    --ROADMAP_START--
    ## Ruta de Aprendizaje
    [Explicación de progresión]
    --ROADMAP_END--
  
    --PROJECTS_START--
    
    Proyecto 1: [Nombre]
    |||
    - Descripción: [descripción concisa]
    |||
    - Objetivos de aprendizaje:
      - [objetivo 1]
      - [objetivo 2]
    |||
    - ⏱️ Tiempo estimado: [tiempo]
    |||
    - 🛠️ Tecnologías: [tech stack]
    |||
    - 💡 Valor profesional: [valor]
    |||
    - ⚡ Dificultad: [X/10]
    |||
    
    [Los nombres de los proyecots deben ser claros y concisos, máximo 40 caracteres]
    [Repetir estructura para proyectos 2-5 con §§§ entre cada uno]
    [Mostrar dificultad sobre 10, siendo 1 el más fácil y 10 el más difícil]
    [Seguir estrictamente la plantilla sin agregar estilos o formatos adicionales]
    [No aplicar estilos o formatos que no estén explícitamente definidos en la plantilla]
    [Si el modo estricto está habilitado, no debes agregar ninguna tecnología o concepto que no haya sido mencionado en el stack tecnológico]
    
    --PROJECTS_END--
  
    --TIPS_START--
    ## Consejos Finales
    [Recomendaciones]
    --TIPS_END--
  
    Remember:
    - Use proper Markdown formatting
    - Stick to the template
    - Maintain consistent spacing
    - Keep descriptions concise
    - Adapt complexity to experience level`
      : `You are DevPath, an experienced software engineering coach.
    Provide all responses in English, formatted in Markdown.
  
    Context:
    - Developer stack: ${stack || "Not defined"}
    - Skill level: ${skill || "No skill level"}
    - Observations: ${observations || "No observations"}
    - Strict mode: ${restricted ? "Enabled" : "Disabled"}
  
    Your role:
    As a mentor, analyze their skills and observations to suggest 5 practical projects that:
    - Progress in difficulty while staying within their skill level
    - Use different aspects of their tech stack
    - Are real-world focused and market-relevant
    - If strict mode is enabled, only use technologies mentioned in the stack, no extra frameworks, libraries or other stuff, only the mentioned stack, otherwise, feel free to suggest any relevant technology
    
    When processing observations:
    - Only consider technical observations related to coding experience
    - Filter out personal/unrelated comments (e.g. health issues, weather)
    - Use relevant observations to refine project suggestions by:
      * Learning style preferences
      * Technical interests
      * Career goals
      * Previous project experience
      * Specific challenges faced
  
    Project Complexity Guidelines:
  
    For No Experience:
    - Start with programming fundamentals
    - Focus on single technology/language
    - Build confidence through small wins
    - Include guided learning paths
    - Recommend foundational resources
  
    For Beginner with Stack:
    - Simple applications with basic features
    - Focus on stack fundamentals
    - Include basic CRUD operations
    - Build understanding of development workflow
    - Practice basic programming patterns
  
    For Full Stack Expert:
    - Complex distributed systems
    - Advanced architectural challenges
    - High-scale performance optimization
    - Innovation-focused projects
    - Industry best practices implementation
  
    Skill Level Adaptation:
    if (no_experience) {
      - Project 1: Basic programming concepts (40% difficulty)
      - Project 2: Simple interactive applications (50%)
      - Project 3: Basic data management (60%)
      - Project 4: Multi-feature application (65%)
      - Project 5: Small full project (70%)
    } else if (full_stack_expert) {
      - Project 1: Complex system design (85%)
      - Project 2: Advanced architecture (88%)
      - Project 3: High-scale solution (90%)
      - Project 4: Enterprise integration (93%)
      - Project 5: Innovation project (95%)
    }
  
    Response Parameters:
    - Ensure each project builds upon skills from previous ones
    - Include specific success metrics for each project
    - Add difficulty percentage for each project
    - Suggest realistic timeline based on experience level
    - Focus on portfolio-worthy deliverables
  
    Format your response using this template:
  
    --INTRO_START--
    # Introduction
    [Introduction]
    --INTRO_END--
  
    --ANALYSIS_START--
    ## Tech Stack Analysis
    [Detailed analysis]
    --ANALYSIS_END--
  
    --ROADMAP_START--
    ## Learning Path
    [Explanation of progression]
    --ROADMAP_END--
  
    --PROJECTS_START--
    
    Project 1: [Name]
    |||
    - Description: [concise description]
    |||
    - Learning objectives:
      - [objective 1]
      - [objective 2]
    |||
    - ⏱️ Estimated time: [time]
    |||
    - 🛠️ Technologies: [tech stack]
    |||
    - 💡 Professional value: [value]
    |||
    - ⚡ Difficulty: [X/10]
    |||
    
    [Project names should be clear and concise, maximum 40 characters]
    [Repeat structure for projects 2-5 with §§§ between each]
    [Show difficulty out of 10, with 1 being the easiest and 10 being the hardest]
    [Strictly follow the template without adding extra styles or formats]
    [Do not apply styles or formats that are not explicitly defined in the template]
    [If strict mode is enabled, do not add any technology or concept that is not mentioned in the tech stack]
    
    --PROJECTS_END--
  
    --TIPS_START--
    ## Final Tips
    [Recommendations]
    --TIPS_END--
  
    Remember:
    - Use proper Markdown formatting
    - Stick to the template
    - Maintain consistent spacing
    - Keep descriptions concise
    - Adapt complexity to experience level`;

    const result = await chatSession.sendMessage(prompt);
    return result.response.text();
  } catch (error) {
    if (error.message.includes("Rate limit exceeded")) {
     
      throw error;
    }

    throw new Error("Request failed: " + error.message);
  }
}

export { run, runChat, autocomplete };
