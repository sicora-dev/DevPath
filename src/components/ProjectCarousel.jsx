import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
} from "@nextui-org/react";
import { Context } from "../context/Context";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useContext, useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { ShowMoreicon } from "../showmorebutton/ShowMoreIcon";
import { Tooltip } from "react-tooltip";
import { useTranslation } from "react-i18next";

const ProjectCarousel = ({ projects }) => {
  const { t } = useTranslation();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, jump: true });
  const [showMore, setShowMore] = useState(false);
  const { 
    outputLoaded, 
    setSelectedProject, 
    setShowModal,
    actualProject,
    setActualProject,
    setHistory
  } = useContext(Context);
 

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();

    setShowMore(false);
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();

    setShowMore(false);
  }, [emblaApi]);

  const handleShowMore = (e) => {
    e.preventDefault();
    setShowMore(!showMore);
  };

  const handleChat = () => {
    const storedProject = parseInt(sessionStorage.getItem("selectedProject"));
    const chatHistory = JSON.parse(sessionStorage.getItem("chatHistory"));
    console.log(storedProject, actualProject);
    if (!storedProject || !chatHistory) {
      sessionStorage.setItem("selectedProject", actualProject);
    }else if(storedProject !== actualProject && chatHistory){
      setShowModal(true);
    }else if(storedProject === actualProject){
      setShowModal(false);
      setHistory(chatHistory);
    }
   setSelectedProject(actualProject);
  };

  useEffect(() => {
    if (emblaApi) {
      const onSelect = () => {
        const selectedIndex = emblaApi.selectedScrollSnap();
        setActualProject(selectedIndex + 1);
       
      };
      emblaApi.on("select", onSelect);
      onSelect();
      
    }
  }, [actualProject, emblaApi]);

  return (
    <div className="w-full max-w-[800px] place-self-center relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex relative">
          {projects.map((project, index) => (
            <div
              className="sm:flex-[0_0_85%] flex-[0_0_99%] rounded-md"
              key={index}
            >
              <Card
                className={`m-4 overflow-hidden dark:bg-dark-secondary bg-light-secondary relative items-center`}
              >
                <CardHeader className="flex gap-3 justify-center items-center text-center relative w-[80%]">
                  
                  <div className="flex flex-col">
                    <p className="text-lg font-bold">
                      {outputLoaded && project.title}
                    </p>
                  </div>
                </CardHeader>
                <Divider />
                <CardBody
                  className={`flex flex-col gap-4 overflow-hidden h-fit max-h-[300px] ${
                    showMore ? "max-h-[2000px]" : ""
                  }`}
                >
                  <div>
                    <h4 className="font-semibold mb-2 text-center">
                      📝{t('description')}📝
                    </h4>
                    <ReactMarkdown className="text-center">
                      {outputLoaded &&
                        project.body.split("|||")[1].split(":")[1]}
                    </ReactMarkdown>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-center">
                      📍{t('objectives')}📍
                    </h4>
                    <section>
                      <ul>
                        {outputLoaded &&
                          project.body
                            .split("|||")[2]
                            .split(":")[1]
                            .split("-")
                            .map((objetivo) => {
                              return (
                                <li key={objetivo}>
                                  <ReactMarkdown className="text-center">
                                    {objetivo}
                                  </ReactMarkdown>
                                </li>
                              );
                            })}
                      </ul>
                    </section>
                  </div>
                  <div className="flex flex-col justify-evenly w-full gap-5">
                    <div className="flex flex-col items-center text-center">
                      <h4 className="font-semibold mb-2">⌛{t('value')}⌛</h4>
                      <section>
                        {outputLoaded &&
                          project.body.split("|||")[5].split(":")[1]}
                      </section>
                    </div>
                    <div className="flex flex-col items-center text-center">
                      <h4 className="font-semibold mb-2 text-center">
                        🛠️Stack🛠️
                      </h4>
                      <section>
                        {outputLoaded &&
                          project.body.split("|||")[4].split(":")[1]}
                      </section>
                    </div>
                  </div>
                </CardBody>
                <Divider />
                <CardFooter className="w-full h-fit flex text-end justify-between">
                  <button
                    aria-label="Take a photo"
                    color="currentColor"
                    className=""
                    onClick={(e) => handleShowMore(e)}
                  >
                    {showMore ? (
                      <div className="rotate-180">
                        <ShowMoreicon></ShowMoreicon>
                      </div>
                    ) : (
                      <ShowMoreicon></ShowMoreicon>
                    )}
                  </button>
                  <div className="flex-col sm:flex-row flex items-center">
                    <p>⏳</p>
                    <p>{project.body.split("|||")[3]?.split(":")[1]}</p>
                  </div>
                  <div className="flex-col sm:flex-row flex items-center">
                    <p>⚡</p>
                    <p>{project.body.split("|||")[6]?.split(":")[1]}</p>
                  </div>
                </CardFooter>
                <button
                  className={`absolute z-50 right-0 top-0 w-12 h-12 p-2 cursor-pointer sm:block hidden`}
                  onClick={() => handleChat()}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    alt="Chatea con la IA sobre este proyecto"
                    data-tooltip-id="chat-tooltip"
                    data-tooltip-content="Chatea con la IA sobre este proyecto"
                  >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      {" "}
                      <path
                        d="M12 17H12.01M12 14C12.8906 12.0938 15 12.2344 15 10C15 8.5 14 7 12 7C10.4521 7 9.50325 7.89844 9.15332 9M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>{" "}
                    </g>
                  </svg>
                </button>
              </Card>
            </div>
          ))}
        </div>
        <div className="flex justify-center">
          <button className="z-10 p-2" onClick={scrollPrev}>
            <svg
              width="30px"
              height="30px"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="rotate-90"
            >
              <path
                d="M16 11L12 15L8 11M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            className={`w-14 h-14 p-2 cursor-pointer sm:hidden block`}
            onClick={() => handleChat()}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              alt="Chatea con la IA sobre este proyecto"
              data-tooltip-id="chat-tooltip"
              data-tooltip-content="Chatea con la IA sobre este proyecto"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                {" "}
                <path
                  d="M12 17H12.01M12 14C12.8906 12.0938 15 12.2344 15 10C15 8.5 14 7 12 7C10.4521 7 9.50325 7.89844 9.15332 9M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>{" "}
              </g>
            </svg>
          </button>
          <Tooltip
            id="chat-tooltip"
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
          <button className=" z-10 p-2" onClick={scrollNext}>
            <svg
              width="30px"
              height="30px"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="-rotate-90"
            >
              <path
                d="M16 11L12 15L8 11M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCarousel;
