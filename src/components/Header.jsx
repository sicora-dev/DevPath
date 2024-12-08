import React, { useEffect, useState } from "react";
import { Button, ButtonGroup } from "@nextui-org/button";
import { GithubIcon } from "../githubbutton/GithubIcon";
import { Switch } from "@nextui-org/switch";
import { MoonIcon } from "../switch/MoonIcon";
import { SunIcon } from "../switch/SunIcon";

const Header = () => {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "enabled"
  );
  const [isScrolled, setIsScrolled] = useState(false);

  const handleGithubClick = () => {
    window.open("https://github.com/sicora-dev/DevPath", "_blank");
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("darkMode", "enabled");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("darkMode", "disabled");
    }
  }, [darkMode]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`
      items-center p-2 text-1xl 
      text-light-heading dark:text-dark-heading 
      flex h-fit justify-around sticky 
      bg-light-secondary/80 dark:bg-dark-secondary/20 
      top-0 z-50 transition-all duration-300
      ${isScrolled ? "backdrop-blur-sm" : ""}
    `}
      >
        <h1 className="font-bold text-center font-title text-light-heading dark:text-dark-heading">
          DevPath (v1.0)
        </h1>
        <section className="flex gap-5">
          <button
            onClick={() => handleGithubClick()}
            className="rounded-xl p-2 border-light-highlight/30 dark:border-dark-highlight/30 border-2 hover:border-light-highlight
            dark:hover:border-dark-highlight transition ease-in-out"
          >
            <GithubIcon />
          </button>

          <Switch
            defaultSelected={localStorage.getItem("darkMode") != "enabled"}
            size="md"
            color="success"
            thumbIcon={({ isSelected, className }) =>
              isSelected ? (
                <SunIcon className={className} />
              ) : (
                <MoonIcon className={className} />
              )
            }
            onClick={() => setDarkMode(!darkMode)}
          ></Switch>
        </section>
      </nav>
      <main className="flex flex-col items-center py-5 px-1 my-5">
        <h2 className="w-[70%] text-xl text-center mt-2 font-semibold">
          Tu{" "}
          <span className="text-light-highlight dark:text-dark-highlight">
            mentor personal
          </span>{" "}
          de programación impulsado por{" "}
          <span className="text-light-highlight dark:text-dark-highlight inline-block">
            IA{" "}
            <svg
              width="20px"
              height="20px"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="inline-block"
            >
              <path
                d="M18.5 8V3M5.5 21V16M16 5.5H21M3 18.5H8M6.5 2L5.71554 3.56892C5.45005 4.09989 5.31731 4.36538 5.13997 4.59545C4.98261 4.79959 4.79959 4.98261 4.59545 5.13997C4.36538 5.31731 4.0999 5.45005 3.56892 5.71554L2 6.5L3.56892 7.28446C4.0999 7.54995 4.36538 7.68269 4.59545 7.86003C4.79959 8.01739 4.98261 8.20041 5.13997 8.40455C5.31731 8.63462 5.45005 8.9001 5.71554 9.43108L6.5 11L7.28446 9.43108C7.54995 8.9001 7.68269 8.63462 7.86003 8.40455C8.01739 8.20041 8.20041 8.01739 8.40455 7.86003C8.63462 7.68269 8.9001 7.54995 9.43108 7.28446L11 6.5L9.43108 5.71554C8.9001 5.45005 8.63462 5.31731 8.40455 5.13997C8.20041 4.98261 8.01739 4.79959 7.86003 4.59545C7.68269 4.36538 7.54995 4.0999 7.28446 3.56892L6.5 2ZM17 12L16.0489 13.9022C15.7834 14.4332 15.6506 14.6987 15.4733 14.9288C15.3159 15.1329 15.1329 15.3159 14.9288 15.4733C14.6987 15.6506 14.4332 15.7834 13.9023 16.0489L12 17L13.9023 17.9511C14.4332 18.2166 14.6987 18.3494 14.9288 18.5267C15.1329 18.6841 15.3159 18.8671 15.4733 19.0712C15.6506 19.3013 15.7834 19.5668 16.0489 20.0977L17 22L17.9511 20.0978C18.2166 19.5668 18.3494 19.3013 18.5267 19.0712C18.6841 18.8671 18.8671 18.6841 19.0712 18.5267C19.3013 18.3494 19.5668 18.2166 20.0977 17.9511L22 17L20.0977 16.0489C19.5668 15.7834 19.3013 15.6506 19.0712 15.4733C18.8671 15.3159 18.6841 15.1329 18.5267 14.9288C18.3494 14.6987 18.2166 14.4332 17.9511 13.9023L17 12Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>{" "}
          - Obtén una ruta personalizada de{" "}
          <span className="text-light-highlight dark:text-dark-highlight">
            5 proyectos
          </span>{" "}
          adaptada a tu{" "}
          <span className="text-light-highlight dark:text-dark-highlight">
            stack y habilidades
          </span>
        </h2>
      </main>
    </>
  );
};

export default Header;
