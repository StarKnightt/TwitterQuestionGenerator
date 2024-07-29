import React, { useState, useRef, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { motion, AnimatePresence } from "framer-motion";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 256,
  responseMimeType: "text/plain",
};

const categories = [
  "General",
  "Frontend",
  "Backend",
  "DevOps",
  "Mobile Development",
];

const RandomQuestion = () => {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [category, setCategory] = useState("General");
  const questionRef = useRef(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://cdn.jsdelivr.net/npm/tsparticles@2.9.3/tsparticles.bundle.min.js";
    script.async = true;
    script.onload = () => {
      window.tsParticles.load("tsparticles", {
        fullScreen: { enable: true },
        background: { color: { value: "#0f172a" } },
        fpsLimit: 60,
        interactivity: {
          events: {
            onHover: { enable: true, mode: "repulse" },
            resize: true,
          },
          modes: {
            repulse: { distance: 100, duration: 0.4 },
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
            speed: 1,
            straight: false,
          },
          number: { density: { enable: true, area: 800 }, value: 70 },
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
      const result = await chatSession.sendMessage(
        `Generate one simple, easy, humanly, one-liner question to get more engagement on Twitter about ${category} web development or programming, new questions every time:`
      );
      setQuestion(result.response.text().trim());
    } catch (error) {
      if (retryCount > 0) {
        console.warn("Model overloaded, retrying...", retryCount);
        setTimeout(() => generateQuestion(retryCount - 1), 2000);
      } else {
        console.error("Error generating question:", error);
        setQuestion(
          "Failed to generate a question. The model is currently overloaded. Please try again later."
        );
      }
    }
    setLoading(false);
  };

  const copyToClipboard = () => {
    if (questionRef.current) {
      navigator.clipboard
        .writeText(questionRef.current.innerText)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch((err) => console.error("Failed to copy text: ", err));
    }
  };

  const shareOnTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      question
    )}`;
    window.open(twitterUrl, "_blank");
  };

  const shareOnLinkedIn = () => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      window.location.href
    )}&title=${encodeURIComponent(question)}`;
    window.open(linkedInUrl, "_blank");
  };

  return (
    <div className="relative h-screen flex flex-col">
      <div id="tsparticles" className="absolute inset-0 z-0"></div>
      <main className="relative z-10 flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl overflow-hidden"
        >
          <div className="p-6 sm:p-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-4 text-center text-white">
              Tech Question Generator
            </h1>
            <p className="text-lg sm:text-xl text-gray-200 mb-6 text-center">
              Generate engaging questions about web development and programming
              for your social media posts.
            </p>
            <div className="mb-4">
              <label htmlFor="category" className="block text-white mb-2">
                Select Category:
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-white bg-opacity-20 text-white rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  color: "white",
                }}
              >
                {categories.map((cat) => (
                  <option
                    key={cat}
                    value={cat}
                    style={{
                      backgroundColor: "#4a5568", // Dark blue-gray background
                      color: "white",
                      padding: "8px",
                    }}
                  >
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-center mb-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => generateQuestion()}
                disabled={loading}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold py-2 px-6 rounded-full shadow-lg hover:from-purple-700 hover:to-indigo-700 transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Generating..." : "Generate Question"}
              </motion.button>
            </div>
            <AnimatePresence>
              {question && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white bg-opacity-20 rounded-lg p-4 shadow-inner min-h-[80px] relative mb-4"
                >
                  <p
                    ref={questionRef}
                    className="text-lg sm:text-xl text-white font-medium text-center pr-12"
                  >
                    {question}
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={copyToClipboard}
                    className="absolute top-2 right-2 bg-white text-indigo-600 hover:bg-indigo-100 font-medium py-1 px-3 rounded-full text-sm transition duration-300 ease-in-out"
                  >
                    {copied ? "Copied!" : "Copy"}
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
            {question && (
              <div className="flex justify-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={shareOnTwitter}
                  className="bg-blue-400 text-white font-semibold py-2 px-4 rounded-full shadow-lg hover:bg-blue-500 transition duration-300 ease-in-out"
                >
                  Share on Twitter
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={shareOnLinkedIn}
                  className="bg-blue-700 text-white font-semibold py-2 px-4 rounded-full shadow-lg hover:bg-blue-800 transition duration-300 ease-in-out"
                >
                  Share on LinkedIn
                </motion.button>
              </div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default RandomQuestion;
