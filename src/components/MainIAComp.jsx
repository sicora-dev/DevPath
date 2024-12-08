import React, { useState, useContext, useEffect } from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import { Button, ButtonGroup } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import { Image } from "@nextui-org/image";
import { ScrollShadow } from "@nextui-org/scroll-shadow";
import { Skeleton } from "@nextui-org/skeleton";
import { Context } from "../context/Context";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { CameraIcon } from "../photobutton/CameraIcon";
import ProjectCarousel from "./ProjectCarousel";
import ExampleProjectCarousel from "./ExampleProjectCarousel";

import ReactMarkdown from "react-markdown";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import SkeletonCards from "./SkeletonCards";

const MainIAComp = () => {
  const {
    stack,
    setStack,
    experience,
    setExperience,
    observations,
    setObservations,
    recentPrompt,
    setRecentPrompt,
    previousPrompts,
    setPreviousPrompts,
    loading,
    output,
    onSent,
  } = useContext(Context);

  const [outputSections, setOutputSections] = useState({
    intro: {
      title: "# Proyectos Recomendados",
      body: "Bienvenido/a al mundo de la programación. Como mentor, te guiaré en tu viaje de aprendizaje con una serie de proyectos prácticos diseñados para principiantes sin experiencia previa. Estos proyectos te ayudarán a construir una base sólida y a desarrollar habilidades clave.",
    },
    analysis: {
      title: "## Análisis de Stack Tecnológico",
      body: "Dado que no has especificado un stack tecnológico, te recomendaré proyectos utilizando Python, un lenguaje popular, versátil y con una gran comunidad, ideal para principiantes. Posteriormente, podrás explorar otras tecnologías basándote en tus intereses.",
    },
    roadmap: {
      title: "## Ruta de Aprendizaje",
      body: "La ruta de aprendizaje se centrará en la progresión gradual de la complejidad. Comenzaremos con conceptos básicos de programación en Python, pasando por aplicaciones interactivas simples, gestión de datos, aplicaciones multi-función y culminando con un pequeño proyecto integrador. Cada proyecto te preparará para el siguiente, fortaleciendo tus habilidades de forma gradual.",
    },
    projects: [
      {
        title: "Proyecto 1: Calculadora Básica",
        body: "|||\n- Descripción: Una calculadora que realiza operaciones aritméticas básicas (suma, resta, multiplicación, división).\n|||\n- Objetivos de aprendizaje:\n    - Familiarización con la sintaxis básica de Python.\n    - Uso de variables y operadores.\n    - Entrada y salida de datos por consola.\n    - Manejo de errores (e.g., división por cero).\n|||\n- ⏱️ Tiempo estimado: 2-3 días\n|||\n- 🛠️ Tecnologías: Python\n|||\n- 💡 Valor profesional: Demuestra comprensión de variables, operadores y manejo básico de entrada/salida.",
      },
      {
        title: "Proyecto 2: Adivina el Número",
        body: "|||\n- Descripción: Un juego donde la computadora genera un número aleatorio y el usuario debe adivinarlo en un número limitado de intentos.\n|||\n- Objetivos de aprendizaje:\n    - Uso de estructuras de control (bucles, condicionales).\n    - Generación de números aleatorios.\n    - Interacción con el usuario a través de la consola.\n    - Implementación de lógica de juego.\n|||\n- ⏱️ Tiempo estimado: 3-4 días\n|||\n- 🛠️ Tecnologías: Python\n|||\n- 💡 Valor profesional: Demuestra comprensión de lógica de programación, bucles y condicionales.",
      },
      {
        title: "Proyecto 3: Lista de Tareas",
        body: "|||\n- Descripción: Una aplicación sencilla para gestionar una lista de tareas. Permite añadir, eliminar y marcar tareas como completadas.\n|||\n- Objetivos de aprendizaje:\n    - Uso de listas o arrays.\n    - Persistencia de datos (guardar y cargar la lista desde un archivo).\n    - Mejoras en la interacción con el usuario.\n|||\n- ⏱️ Tiempo estimado: 5-7 días\n|||\n- 🛠️ Tecnologías: Python\n|||\n- 💡 Valor profesional: Muestra manejo de datos, persistencia y mejora de la experiencia de usuario.",
      },
      {
        title: "Proyecto 4: Conversor de Unidades",
        body: "|||\n- Descripción: Un conversor que permite convertir entre diferentes unidades de medida (e.g., Celsius a Fahrenheit, metros a pulgadas).\n|||\n- Objetivos de aprendizaje:\n    - Creación de funciones.\n    - Uso de diccionarios o estructuras de datos similares.\n    - Implementación de múltiples opciones de conversión.\n    - Diseño de una interfaz de usuario más amigable.\n|||\n- ⏱️ Tiempo estimado: 7-10 días\n|||\n- 🛠️ Tecnologías: Python\n|||\n- 💡 Valor profesional: Demuestra capacidad para modular el código, usar estructuras de datos complejas y mejorar la interfaz de usuario.",
      },
      {
        title: "Proyecto 5: Generador de Contraseñas",
        body: "|||\n- Descripción: Un programa que genera contraseñas aleatorias que cumplen con ciertos criterios de seguridad (longitud, caracteres especiales, etc.).\n|||\n- Objetivos de aprendizaje:\n    - Manejo de cadenas de texto.\n    - Generación de caracteres aleatorios específicos.\n    - Implementación de validación de contraseñas.\n    - Integración de todos los conceptos aprendidos en proyectos anteriores.\n|||\n- ⏱️ Tiempo estimado: 10-14 días\n|||\n- 🛠️ Tecnologías: Python\n|||\n- 💡 Valor profesional: Proyecto completo que demuestra un amplio conocimiento de programación en Python y aplicación práctica de varios conceptos.",
      },
    ],
    tips: {
      title: "## Consejos Finales",
      body: "* **Practica consistentemente:** Dedica tiempo regularmente a la programación, incluso si son solo 30 minutos al día.\n* **Busca recursos online:** Utiliza plataformas como Codecademy, freeCodeCamp, Coursera o edX para aprender Python y complementar estos proyectos.\n* **No tengas miedo de buscar ayuda:** Si te atascas, busca ayuda en foros, comunidades online o pregúntame a mí.\n* **Documenta tu código:** Acostúmbrate a escribir comentarios en tu código para facilitar su comprensión.\n* **¡Diviértete!** La programación debe ser un proceso de aprendizaje y disfrute.",
    },
  });

  const extractSection = (output, startTag, endTag) => {
    const text = Array.isArray(output) ? output.join("") : output;
    const start = text.indexOf(startTag) + startTag.length;
    const end = text.indexOf(endTag);
    // Remove the tags from content
    return start !== -1 && end !== -1
      ? text.slice(start, end).replace(startTag, "").replace(endTag, "").trim()
      : "";
  };

  const extractTitle = (text) => {
    const lines = text.split("\n");
    return lines[0] || "";
  };

  const extractBody = (text) => {
    const lines = text.split("\n");
    return lines.slice(1).join("\n").trim();
  };

  const extractProjectDetails = (text) => {
    const projects = text.split("§§§").map((project) => {
      const lines = project.trim().split("\n");
      const projectTitle = lines[0]?.trim() || "";
      // Remove title line and join rest for body
      const projectBody = lines.slice(1).join("\n").trim();

      return {
        title: projectTitle,
        body: projectBody,
      };
    });
    return projects;
  };

  const downloadPDF = async () => {
    const markdownElement = document.getElementById("markdown-content");

    if (!markdownElement) {
      console.error("Markdown element not found");
      return;
    }

    // Temporarily make visible for capture
    markdownElement.classList.remove("hidden");

    try {
      const canvas = await html2canvas(markdownElement, {
        scale: 2, // Better quality
        useCORS: true,
        logging: false,
      });

      // Explicitly specify PNG format in data URL
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("output.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      markdownElement.classList.add("hidden");
    }
  };

  useEffect(() => {
    if (output) {
      // console.log("Raw output:", output); // Verificar el output inicial

      const introSection = extractSection(
        output,
        "--INTRO_START--",
        "--INTRO_END--"
      );
      // Verificar la sección extraída

      const introTitle = extractTitle(introSection);

      const sections = {
        intro: {
          title: extractTitle(
            extractSection(output, "--INTRO_START--", "--INTRO_END--")
          ),
          body: extractBody(
            extractSection(output, "--INTRO_START--", "--INTRO_END--")
          ),
        },
        analysis: {
          title: extractTitle(
            extractSection(output, "--ANALYSIS_START--", "--ANALYSIS_END--")
          ),
          body: extractBody(
            extractSection(output, "--ANALYSIS_START--", "--ANALYSIS_END--")
          ),
        },
        roadmap: {
          title: extractTitle(
            extractSection(output, "--ROADMAP_START--", "--ROADMAP_END--")
          ),
          body: extractBody(
            extractSection(output, "--ROADMAP_START--", "--ROADMAP_END--")
          ),
        },
        projects: extractProjectDetails(
          extractSection(output, "--PROJECTS_START--", "--PROJECTS_END--")
        ),
        tips: {
          title: extractTitle(
            extractSection(output, "--TIPS_START--", "--TIPS_END--")
          ),
          body: extractBody(
            extractSection(output, "--TIPS_START--", "--TIPS_END--")
          ),
        },
      };
      console.log(output)
      setOutputSections(sections);
      // console.log("Output sections:", sections);
    }
  }, [output]);

  const handleClick = (e) => {
    e.preventDefault();
    setRecentPrompt();
    setPreviousPrompts([...previousPrompts]);
    onSent();
  };

  

  return (
    <div
      className={`flex flex-col items-center ${
        output || loading ? "" : "justify-center"
      } `}
    >
      <form onSubmit={handleClick} className="flex flex-col w-fit">
        <label
          htmlFor="stack"
          className="text-center text-light-highlight dark:text-dark-highlight font-bold"
        >
          Stack Tecnológico
        </label>
        <input
          id="stack"
          type="text"
          onChange={(e) => setStack(e.target.value)}
          value={stack}
          className="rounded-md p-2 m-2 bg-light-secondary dark:bg-dark-secondary"
        />
        <label
          htmlFor="experience"
          className="text-center text-light-highlight dark:text-dark-highlight font-bold"
        >
          Experiencia
        </label>
        <input
          id="experience"
          type="text"
          onChange={(e) => setExperience(e.target.value)}
          className="rounded-md p-2 m-2 bg-light-secondary dark:bg-dark-secondary"
          value={experience}
        ></input>
        <label
          htmlFor="experience"
          className="text-center text-light-highlight dark:text-dark-highlight font-bold"
        >
          Observaciones
        </label>
        <input
          id="observations"
          type="text"
          onChange={(e) => setObservations(e.target.value)}
          className="rounded-md p-2 m-2 bg-light-secondary dark:bg-dark-secondary"
          value={observations}
        ></input>
        <button
          type="submit"
          className="px-2 py-1 bg-light-highlight dark:bg-dark-highlight rounded-md m-2"
        >
          Enviar
        </button>
      </form>
      <section className="relative min-w-[300px] w-fit flex flex-col items-center">
        <div
          id="output"
          className="w-full h-full rounded-md overflow-y-scroll scrollbar-hide p-5"
        >
      
          {loading && (
            <SkeletonCards />
          )}
          {output && (
            <section className="grid lg:grid-cols-2 grid-cols-1 lg:grid-rows-2 gap-5 w-full ">
              <Card className="w-full h-fit lg:h-full max-w-[400px] dark:bg-dark-secondary bg-light-secondary lg:place-self-end place-self-center">
                <CardHeader className="flex gap-3 justify-center">
                  <Image
                    alt="nextui logo"
                    height={40}
                    radius="sm"
                    src="https://img.icons8.com/emoji/48/bullseye.png"
                    width={40}
                  />
                  <div className="flex flex-col">
                    <p className="text-lg font-bold">
                      <ReactMarkdown className="text-center">
                        {outputSections.intro.title}
                      </ReactMarkdown>
                    </p>
                  </div>
                </CardHeader>
                <Divider />
                <CardBody>
                  <ReactMarkdown className="text-center">
                    {outputSections.intro.body}
                  </ReactMarkdown>
                </CardBody>
                <Divider />
              </Card>

              {/**/}

              <Card className="w-full h-fit lg:h-full max-w-[400px] dark:bg-dark-secondary bg-light-secondary lg:place-self-start place-self-center">
                <CardHeader className="flex gap-3 justify-center">
                  <Image
                    alt="nextui logo"
                    height={40}
                    radius="sm"
                    src="https://img.icons8.com/emoji/96/bar-chart-emoji.png"
                    width={40}
                  />
                  <div className="flex flex-col">
                    <p className="text-lg font-bold">
                      <ReactMarkdown className="text-center">
                        {outputSections.analysis.title}
                      </ReactMarkdown>
                    </p>
                  </div>
                </CardHeader>
                <Divider />
                <CardBody>
                  <ReactMarkdown className="text-center">
                    {outputSections.analysis.body}
                  </ReactMarkdown>
                </CardBody>
                <Divider />
              </Card>

              {/*  */}

              <Card className="w-full h-fit lg:h-full max-w-[400px] dark:bg-dark-secondary bg-light-secondary lg:place-self-end place-self-center">
                <CardHeader className="flex gap-3 justify-center">
                  <Image
                    alt="nextui logo"
                    height={40}
                    radius="sm"
                    src="https://img.icons8.com/emoji/96/motorway.png"
                    width={40}
                  />
                  <div className="flex flex-col">
                    <p className="text-lg font-bold">
                      <ReactMarkdown className="text-center">
                        {outputSections.roadmap.title}
                      </ReactMarkdown>
                    </p>
                  </div>
                </CardHeader>
                <Divider />
                <CardBody>
                  <ReactMarkdown className="text-center">
                    {outputSections.roadmap.body}
                  </ReactMarkdown>
                </CardBody>

                <Divider />
              </Card>

              {/*  */}

              <Card className="w-full h-fit lg:h-full max-w-[400px] dark:bg-dark-secondary bg-light-secondary lg:place-self-start place-self-center">
                <CardHeader className="flex gap-3 justify-center">
                  <Image
                    alt="nextui logo"
                    height={40}
                    radius="sm"
                    src="https://img.icons8.com/emoji/96/old-key.png"
                    width={40}
                  />
                  <div className="flex flex-col">
                    <p className="text-lg font-bold">
                      <ReactMarkdown className="text-center">
                        {outputSections.tips.title}
                      </ReactMarkdown>
                    </p>
                  </div>
                </CardHeader>
                <Divider />
                <CardBody>
                  <ReactMarkdown className="text-center">
                    {outputSections.tips.body}
                  </ReactMarkdown>
                </CardBody>
                <Divider />
              </Card>

              {/*  */}

              
            </section>
          )}
        </div>
        {output && (
          <Button
            isIconOnly
            aria-label="Take a photo"
            color="currentColor"
            variant="faded"
            className="absolute z-20 right-2 top-2"
            onClick={downloadPDF}
          >
            <CameraIcon />
          </Button>
        )}
      </section>
      {output && (
        <ProjectCarousel projects={outputSections.projects} />
      )}
      {!output && (
        <ExampleProjectCarousel />
        )}
      
      <div
        id="markdown-content"
        className="hidden space-y-5 w-[80%] text-black"
      >
        <ReactMarkdown className="font-bold text-center text-2xl">
          {outputSections.analysis.title.toUpperCase() + " 📊"}
        </ReactMarkdown>
        <ReactMarkdown className="text-center">
          {outputSections.analysis.body}
        </ReactMarkdown>
        <ReactMarkdown className="font-bold text-center text-2xl">
          {outputSections.roadmap.title.toUpperCase() + " 🛣️"}
        </ReactMarkdown>
        <ReactMarkdown className="text-center">
          {outputSections.roadmap.body}
        </ReactMarkdown>
        {outputSections.projects.map((project, index) => (
          <div key={index}>
            <ReactMarkdown className="font-bold text-center text-2xl">
              {project.title.replace(/\|\|\|/g, "").trim() + " 🚀"}
            </ReactMarkdown>
            <ReactMarkdown className="text-center">
              {project.body.replace(/\|\|\|/g, "").trim()}
            </ReactMarkdown>
          </div>
        ))}
        <ReactMarkdown className="font-bold text-center text-2xl">
          {outputSections.tips.title.toUpperCase() + " 🗝️"}
        </ReactMarkdown>
        <ReactMarkdown className="text-center">
          {outputSections.tips.body}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default MainIAComp;
