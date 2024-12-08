import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Image,
  Link,
  Divider,
} from "@nextui-org/react";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useState } from "react";
import ReactMarkdown from "react-markdown";
import DOMPurify from "dompurify";

const ProjectCarousel = ({ projects }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [showMore, setShowMore] = useState(false);

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
                className={`m-4 overflow-hidden dark:bg-dark-secondary bg-light-secondary `}
              >
                <CardHeader className="flex gap-3 justify-center relative">
                  <Image
                    alt="Project pin"
                    radius="sm"
                    src="https://img.icons8.com/emoji/96/pushpin-emoji.png"
                    width={40}
                  />
                  <div className="flex flex-col">
                    <p className="text-lg font-bold">{project.title}</p>
                  </div>
                </CardHeader>
                <Divider />
                <CardBody className={`flex flex-col gap-4 overflow-hidden h-fit max-h-[300px] ${
                  showMore ? "max-h-[2000px]" : ""
                }`}>
                  <div>
                    <h4 className="font-semibold mb-2 text-center">
                      📝Descripción📝
                    </h4>
                    <ReactMarkdown className="text-center">
                      {project.body.split("|||")[1].split(":")[1]}
                    </ReactMarkdown>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-center">
                      📍Objetivos de aprendizaje📍
                    </h4>
                    <section>
                      <ul>
                        {project.body
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
                      <h4 className="font-semibold mb-2">⌛Valor⌛</h4>
                      <section>
                        {project.body.split("|||")[5].split(":")[1]}
                      </section>
                    </div>
                    <div className="flex flex-col items-center text-center">
                      <h4 className="font-semibold mb-2 text-center">
                        🛠️Stack🛠️
                      </h4>
                      <section>
                        {project.body.split("|||")[4].split(":")[1]}
                      </section>
                    </div>
                  </div>
                </CardBody>
                <Divider />
                <CardFooter className="w-full h-fit flex text-end justify-between">
                  <Link
                    isExternal
                    onClick={(e) => {
                      handleShowMore(e);
                    }}
                    className="cursor-pointer text-light-text dark:text-dark-text"
                  >
                    <p>
                      {showMore ? (
                        <svg
                          width="20px"
                          height="20px"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="rotate-180"
                        >
                          <path
                            d="M4 8L12 16L20 8"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      ) : (
                        <svg
                          width="20px"
                          height="20px"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M4 8L12 16L20 8"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      )}
                    </p>
                  </Link>
                  <div className="flex-col sm:flex-row flex items-center">
                    <p>⏳</p>
                    <p>{project.body.split("|||")[3]?.split(":")[1]}</p>
                  </div>
                  <div className="flex-col sm:flex-row flex items-center">
                    <p>⚡</p>
                    <p>{project.body.split("|||")[6]?.split(":")[1]}</p>
                  </div>
                </CardFooter>
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
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
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
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCarousel;
