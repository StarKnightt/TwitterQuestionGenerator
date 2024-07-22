import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = 'AIzaSyCPm_To_fQUngECbsyqEyh0RDHLuZHAbBM'; // Your actual API key

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 256, // Limit the number of tokens to get shorter responses
  responseMimeType: 'text/plain',
};

const RandomQuestion = () => {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);

  const generateQuestion = async (retryCount = 3) => {
    setLoading(true);
    try {
      const chatSession = model.startChat({
        generationConfig,
        history: [],
      });

      const result = await chatSession.sendMessage('Generate one simple, easy, humanly, one-liner question to get more engagement on Twitter about web development or programming:');
      setQuestion(result.response.text().trim());
    } catch (error) {
      if (retryCount > 0) {
        console.warn('Model overloaded, retrying...', retryCount);
        setTimeout(() => generateQuestion(retryCount - 1), 2000); // Retry after 2 seconds
      } else {
        console.error('Error generating question:', error);
        setQuestion('Failed to generate a question. The model is currently overloaded. Please try again later.');
      }
    }
    setLoading(false);
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      {/* <h1>Random Tech Question Generator</h1> */}
      <button onClick={() => generateQuestion()} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Question'}
      </button>
      <p style={{ marginTop: '20px', fontSize: '20px' }}>{question}</p>
    </div>
  );
};

export default RandomQuestion;
