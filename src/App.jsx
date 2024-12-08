import React, { useEffect, useState } from "react";
import MainIAComp from "./components/MainIAComp";
import Header from "./components/Header";
import ErrorBoundary from "./components/ErrorBoundary";
import { SpeedInsights } from "@vercel/speed-insights/react"

const App = () => {
  return (
    <ErrorBoundary>
      <div className="min-h-[100vh]">
        <ErrorBoundary>
          <Header />
        </ErrorBoundary>
        <ErrorBoundary>
          <MainIAComp />
        </ErrorBoundary>
      </div>
    </ErrorBoundary>
  );
};

export default App;
