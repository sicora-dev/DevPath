import MainIAComp from "./components/MainIAComp";
import Header from "./components/Header";
import ErrorBoundary from "./components/ErrorBoundary";

const App = () => {
  return (
    <ErrorBoundary>
      <div className="min-h-[100vh] pb-[40px]">
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
