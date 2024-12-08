import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Image,
  Link,
  Divider,
} from "@nextui-org/react";
import { Button, ButtonGroup } from "@nextui-org/button";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useState } from "react";
import ReactMarkdown from "react-markdown";
import DOMPurify from "dompurify";
import { ShowMoreicon } from "../showmorebutton/ShowMoreIcon";

const ProjectCarousel = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [showMore, setShowMore] = useState(false);
  const [projects, setProjects] = useState([
    {
      title: "Proyecto 1: Calculadora Básica",
      body: "|||\n- Descripción: Una calculadora simple que realiza operaciones aritméticas básicas (suma, resta, multiplicación, división).\n|||\n- Objetivos de aprendizaje:\n    - Familiarización con la sintaxis básica de Python.\n    - Uso de variables, operadores y funciones.\n    - Entrada y salida de datos por consola.\n|||\n- ⏱️ Tiempo estimado: 2-3 días\n|||\n- 🛠️ Tecnologías: Python\n|||\n- 💡 Valor profesional: Demuestra comprensión de conceptos básicos de programación y capacidad para resolver problemas sencillos.\n|||\n- ⚡ Dificultad: 4/10",
    },
    {
      title: "Proyecto 2: Juego de Adivinar el Número",
      body: "|||\n- Descripción: Un juego donde el usuario debe adivinar un número aleatorio generado por la computadora, con pistas sobre si el número es mayor o menor.\n|||\n- Objetivos de aprendizaje:\n    - Generación de números aleatorios.\n    - Uso de bucles y condicionales.\n    - Creación de una interfaz de usuario simple por consola.\n|||\n- ⏱️ Tiempo estimado: 3-4 días\n|||\n- 🛠️ Tecnologías: Python\n|||\n- 💡 Valor profesional: Demuestra comprensión de lógica de programación, control de flujo y manejo de entrada del usuario.\n|||\n- ⚡ Dificultad: 5/10",
    },
    {
      title: "Proyecto 3: Lista de Tareas",
      body: "|||\n- Descripción: Una aplicación que permite al usuario agregar, eliminar y marcar como completadas tareas en una lista. La información se guarda en un archivo de texto.\n|||\n- Objetivos de aprendizaje:\n    - Manejo de archivos de texto.\n    - Uso de listas y estructuras de datos.\n    - Implementación de funciones para gestionar la lista de tareas.\n|||\n- ⏱️ Tiempo estimado: 5-7 días\n|||\n- 🛠️ Tecnologías: Python\n|||\n- 💡 Valor profesional: Demuestra capacidad para gestionar datos, organizar código y crear una aplicación funcional, aunque simple.\n|||\n- ⚡ Dificultad: 6/10",
    },
    {
      title: "Proyecto 4: Conversor de Unidades",
      body: "|||\n- Descripción: Un conversor que permite convertir entre diferentes unidades de medida (ej: Celsius a Fahrenheit, metros a pulgadas).\n|||\n- Objetivos de aprendizaje:\n    - Creación de funciones con parámetros y valores de retorno.\n    - Manejo de excepciones.\n    - Diseño de una interfaz de usuario más robusta.\n|||\n- ⏱️ Tiempo estimado: 7-10 días\n|||\n- 🛠️ Tecnologías: Python\n|||\n- 💡 Valor profesional: Demuestra capacidad para diseñar una aplicación modular, manejando diferentes tipos de datos y posibles errores.\n|||\n- ⚡ Dificultad: 7/10",
    },
    {
      title: "Proyecto 5: Aplicación de Gestión de Libros",
      body: "|||\n- Descripción: Una aplicación sencilla para gestionar una biblioteca personal, permitiendo agregar, eliminar, buscar y listar libros con título, autor e ISBN. Los datos se almacenan en un archivo (ej: CSV o JSON).\n|||\n- Objetivos de aprendizaje:\n    - Trabajo con bases de datos sencillas (archivos CSV o JSON).\n    - Organización del código en módulos o clases (introducción a la programación orientada a objetos).\n    - Manejo de datos estructurados.\n|||\n- ⏱️ Tiempo estimado: 10-14 días\n|||\n- 🛠️ Tecnologías: Python\n|||\n- 💡 Valor profesional: Demuestra la capacidad para gestionar un proyecto más complejo, incluyendo el diseño, la implementación y el manejo de datos persistentes.\n|||\n- ⚡ Dificultad: 8/10",
    },
  ]);

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
      <h2 className="p-5 font-title text-2xl text-light-heading dark:text-dark-heading font-bold">
        Proyectos de ejemplo:
      </h2>
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
                <CardBody
                  className={`flex flex-col gap-4 overflow-hidden h-fit max-h-[300px] ${
                    showMore ? "max-h-[2000px]" : ""
                  }`}
                >
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
                  <button
                    aria-label="Take a photo"
                    color="currentColor"
                    className=""
                    onClick={(e) => handleShowMore(e)}
                  >
                    
                      {showMore ? (
                        <ShowMoreicon></ShowMoreicon>
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
