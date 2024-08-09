import React from "react";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import RandomQuestion from "./RandomQuestion";

function App() {
  return (
    <div className="relative flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <RandomQuestion />
        </div>                    
      </main>
      <Footer />
    </div>
  );
}

export default App;
