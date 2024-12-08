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
    setOutput,
    outputLoaded,
    setOutputLoaded,
    onSent,
  } = useContext(Context);

  const [outputSections, setOutputSections] = useState({
    intro: {
      title: "",
      body: "",
    },
    analysis: {
      title: "",
      body: "",
    },
    roadmap: {
      title: "",
      body: "",
    },
    projects: [
      {
        title: "",
        body: "",
      },
      {
        title: "",
        body: "",
      },
      {
        title: "",
        body: "",
      },
      {
        title: "",
        body: "",
      },
      {
        title: "",
        body: "",
      },
    ],
    tips: {
      title: "",
      body: "",
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
      console.log("hola");
      setOutputSections(sections);
      setOutputLoaded(true);
      // console.log("Output sections:", sections);
    }
  }, [output, setOutput]);

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
          {loading && <SkeletonCards />}
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
      {output && <ProjectCarousel projects={outputSections.projects} />}
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
    </div>
  );
};

export default MainIAComp;
