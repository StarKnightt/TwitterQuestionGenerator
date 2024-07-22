import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { motion, AnimatePresence } from 'framer-motion';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 256,
  responseMimeType: 'text/plain',
};

const RandomQuestion = () => {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const questionRef = useRef(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/tsparticles@2.9.3/tsparticles.bundle.min.js';
    script.async = true;
    script.onload = () => {
      window.tsParticles.load("tsparticles", {
        fullScreen: { enable: true },
        background: { color: { value: "#0f172a" } },
        fpsLimit: 60,
        interactivity: {
          events: {
            onClick: { enable: true, mode: "push" },
            onHover: { enable: true, mode: "repulse" },
            resize: true,
          },
          modes: {
            push: { quantity: 4 },
            repulse: { distance: 200, duration: 0.4 },
          },
        },
        particles: {
          color: { value: ["#6366f1", "#8b5cf6", "#d946ef"] },
          links: {
            color: "#ffffff",
            distance: 150,
            enable: true,
            opacity: 0.5,
            width: 1,
          },
          move: {
            direction: "none",
            enable: true,
            outModes: { default: "bounce" },
            random: false,
            speed: 2,
            straight: false,
          },
          number: { density: { enable: true, area: 800 }, value: 80 },
          opacity: { value: 0.5 },
          shape: { type: "circle" },
          size: { value: { min: 1, max: 5 } },
        },
        detectRetina: true,
      });
    };
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  const generateQuestion = async (retryCount = 3) => {
    setLoading(true);
    setCopied(false);
    try {
      const chatSession = model.startChat({ generationConfig, history: [] });
      const result = await chatSession.sendMessage('Generate one simple, easy, humanly, one-liner question to get more engagement on Twitter about web development or programming:');
      setQuestion(result.response.text().trim());
    } catch (error) {
      if (retryCount > 0) {
        console.warn('Model overloaded, retrying...', retryCount);
        setTimeout(() => generateQuestion(retryCount - 1), 2000);
      } else {
        console.error('Error generating question:', error);
        setQuestion('Failed to generate a question. The model is currently overloaded. Please try again later.');
      }
    }
    setLoading(false);
  };

  const copyToClipboard = () => {
    if (questionRef.current) {
      navigator.clipboard.writeText(questionRef.current.innerText)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(err => console.error('Failed to copy text: ', err));
    }
  };

  return (
    <div className="relative h-screen flex flex-col">
      <div id="tsparticles" className="absolute inset-0 z-0"></div>
      <nav className="relative z-10 bg-opacity-10 backdrop-filter backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0">
              <span className="text-white text-lg font-semibold">TechQuest</span>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a href="#" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Home</a>
                <a href="#" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">About</a>
                <a href="#" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Contact</a>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <main className="relative z-10 flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl overflow-hidden"
          >
            <div className="p-8">
              <h1 className="text-4xl font-extrabold mb-6 text-center text-white">
                Tech Question Generator
              </h1>
              <p className="text-xl text-gray-200 mb-8 text-center">
                Generate engaging questions about web development and programming for your social media posts.
              </p>
              <div className="flex justify-center mb-8">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => generateQuestion()}
                  disabled={loading}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:from-purple-700 hover:to-indigo-700 transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Generating...' : 'Generate Question'}
                </motion.button>
              </div>
              <AnimatePresence>
                {question && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white bg-opacity-20 rounded-lg p-6 shadow-inner min-h-[100px] relative"
                  >
                    <p ref={questionRef} className="text-xl text-white font-medium text-center">
                      {question}
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={copyToClipboard}
                      className="absolute top-2 right-2 bg-white text-indigo-600 hover:bg-indigo-100 font-medium py-1 px-3 rounded-full text-sm transition duration-300 ease-in-out"
                    >
                      {copied ? 'Copied!' : 'Copy'}
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </main>
      <footer className="relative z-10 bg-opacity-10 backdrop-filter backdrop-blur-lg py-4">
        <p className="text-center text-white text-sm">
          © 2024 Tech Question Generator. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default RandomQuestion;