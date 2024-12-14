import React, { useState, useContext, useEffect } from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import { Button, ButtonGroup } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import { Image } from "@nextui-org/image";
import { ScrollShadow } from "@nextui-org/scroll-shadow";
import { Skeleton } from "@nextui-org/skeleton";
import { Switch } from "@nextui-org/react";
import { Context } from "../context/Context";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { CameraIcon } from "../photobutton/CameraIcon";
import ProjectCarousel from "./ProjectCarousel";
import ExampleProjectCarousel from "./ExampleProjectCarousel";
import { Tooltip } from "react-tooltip";

import ReactMarkdown from "react-markdown";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import SkeletonCards from "./SkeletonCards";
import ChatBot from "./ChatBot";
import { use } from "react";

const MainIAComp = () => {
  const {
    stack,
    setStack,
    skill,
    setSkill,
    observations,
    setObservations,
    history,
    setHistory,
    selectedProject,
    setSelectedProject,
    loading,
    output,
    setOutput,
    outputLoaded,
    outputSections,
    setOutputSections,
    setOutputLoaded,
    onSent,
  } = useContext(Context);

  const [restricted, setRestricted] = useState(false);

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
    const savedOutput = sessionStorage.getItem("output");
    if (savedOutput && !output) {
      // Set the output in context instead of reassigning
      setOutput(savedOutput);
    }

    if (output) {
      // console.log("Raw output:", output); // Verificar el output inicial
      sessionStorage.setItem("output", output);

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
      setOutputSections(sections);
      setOutputLoaded(true);
      // console.log("Output sections:", sections);
    }
  }, [output, setOutput]);

  const handleClick = (e) => {
    e.preventDefault();
    onSent(restricted);
  };

  return (
    <div
      className={`flex flex-col items-center ${
        output || loading ? "" : "justify-center"
      } `}
    >
      {!selectedProject && (
        <form onSubmit={(e) => handleClick(e)} className="flex flex-col w-fit">
          <label
            htmlFor="stack"
            className="text-center text-light-highlight dark:text-dark-highlight font-bold"
          >
            Stack Tecnológico
          </label>
          <input
            id="stack"
            type="text"
            required
            data-tooltip-id="stack-tooltip"
            data-tooltip-content="El stack ayuda a filtrar proyectos según las tecnologías que manejas"
            onChange={(e) => setStack(e.target.value)}
            value={stack}
            className="rounded-md p-2 m-2 bg-light-secondary dark:bg-dark-secondary peer focus:outline outline-light-highlight"
            placeholder="Ej: JavaScript"
          />
          <Tooltip
            id="stack-tooltip"
            className="peer-focus:hidden"
            style={{
              backgroundColor: "#333",
              color: "white",
              borderRadius: "6px",
              padding: "10px",
              fontSize: "14px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
            }}
          />
          <div className="my-2 flex flex-col items-center justify-center w-full">
            <label
              className="p-2 text-light-highlight dark:text-dark-highlight font-bold"
              htmlFor="strict-switch"
            >
              Modo estricto
            </label>
            <Switch
              id="strict-switch"
              isSelected={restricted}
              onValueChange={() => setRestricted(!restricted)}
              data-tooltip-id="strict-tooltip"
              data-tooltip-content="En modo estricto, la IA solo sugerirá proyectos con las tecnologías del stack. Siempre que sea posible"
              color="success"
              className="w-full justify-center z-0 "
            ></Switch>
          </div>
          <Tooltip
            id="strict-tooltip"
            className="peer-focus:hidden"
            style={{
              backgroundColor: "#333",
              color: "white",
              borderRadius: "6px",
              padding: "10px",
              fontSize: "14px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
            }}
          />

          <label
            htmlFor="skill"
            className="text-center text-light-highlight dark:text-dark-highlight font-bold"
          >
            Habilidad
          </label>
          <input
            id="skill"
            type="text"
            title="" // evita el tooltip nativo
            data-tooltip-id="skill-tooltip"
            data-tooltip-content="La habilidad le sirve a la IA a sugerir proyectos más acordes a tu nivel"
            required
            onChange={(e) => setSkill(e.target.value)}
            className="rounded-md p-2 m-2 bg-light-secondary dark:bg-dark-secondary peer focus:outline outline-light-highlight"
            value={skill}
            placeholder="Ej: JavaScript-Medio"
          ></input>
          <Tooltip
            id="skill-tooltip"
            className="peer-focus:hidden"
            style={{
              backgroundColor: "#333",
              color: "white",
              borderRadius: "6px",
              padding: "10px",
              fontSize: "14px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
            }}
          />
          <label
            htmlFor="experience"
            className="text-center text-light-highlight dark:text-dark-highlight font-bold"
          >
            Observaciones
          </label>
          <input
            id="observations"
            type="text"
            data-tooltip-id="obervations-tooltip"
            data-tooltip-content="Las observaciones ayudan a la IA a personalizar mejor las sugerencias"
            onChange={(e) => setObservations(e.target.value)}
            className="rounded-md p-2 m-2 bg-light-secondary dark:bg-dark-secondary peer focus:outline outline-light-highlight"
            value={observations}
            placeholder="Ej: Proyectos cortos"
          ></input>
          <Tooltip
            id="obervations-tooltip"
            className="peer-focus:hidden"
            style={{
              backgroundColor: "#333",
              color: "white",
              borderRadius: "6px",
              padding: "10px",
              fontSize: "14px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
            }}
          />
          <button
            type="submit"
            className="px-2 py-1 bg-light-highlight dark:bg-dark-highlight rounded-md m-2"
          >
            Enviar
          </button>
        </form>
      )}

      <section className="relative min-w-[300px] w-fit flex flex-col items-center">
        <div
          id="output"
          className="w-full h-full rounded-md overflow-y-scroll scrollbar-hide p-5"
          data-testid="skeleton-loader"
        >
          {loading && <SkeletonCards />}
          {output && !selectedProject && !loading && (
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
        {output && !selectedProject && !loading && (
          <button
            aria-label="Take a photo"
            color="currentColor"
            className="absolute z-20 right-2 top-2 rounded-xl p-2 border-light-highlight/30 dark:border-dark-highlight/30 border-2 hover:border-light-highlight
            dark:hover:border-dark-highlight transition ease-in-out bg-light-secondary/20 dark:bg-dark-secondary/20 text-light-highlight"
            onClick={downloadPDF}
          >
            <CameraIcon />
          </button>
        )}
      </section>
      {output && !selectedProject && !loading && (
        <ProjectCarousel projects={outputSections.projects} />
      )}
      {!output && <ExampleProjectCarousel />}
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

      {output && selectedProject && <ChatBot></ChatBot>}
    </div>
  );
};

export default MainIAComp;
