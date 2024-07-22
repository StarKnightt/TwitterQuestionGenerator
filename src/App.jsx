import React from 'react';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import RandomQuestion from './RandomQuestion';

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          <RandomQuestion />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;
