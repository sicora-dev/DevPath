import React, {useEffect, useState} from "react";
import MainIAComp from "./components/MainIAComp";
import { Switch } from "@nextui-org/switch";
import { MoonIcon } from "./switch/MoonIcon";
import { SunIcon } from "./switch/SunIcon";
import Header from "./components/Header";

const App = () => {

  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <>
      <Header />
      <MainIAComp />
      <div className="absolute bottom-5 right-5">
        <Switch
          defaultSelected
          size="lg"
          color="warning"
          thumbIcon={({ isSelected, className }) =>
            isSelected ? (
              <SunIcon className={className} />
            ) : (
              <MoonIcon className={className} />
            )
          }
          onClick={() => setDarkMode(!darkMode)}
        ></Switch>
      </div>
    </>
  );
};

export default App;
