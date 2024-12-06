import React, {useEffect, useState} from "react";
import MainIAComp from "./components/MainIAComp";
import { Switch } from "@nextui-org/switch";
import { MoonIcon } from "./switch/MoonIcon";
import { SunIcon } from "./switch/SunIcon";
import Header from "./components/Header";

const App = () => {

  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'enabled');

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'enabled');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'disabled');
    }
  }, [darkMode]);

  return (
    <div className="min-h-[100vh]">
      <Header />
      <MainIAComp />
      <div className="absolute bottom-5 right-5">
        <Switch
          defaultSelected={localStorage.getItem('darkMode') != 'enabled'}
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
    </div>
  );
};

export default App;
