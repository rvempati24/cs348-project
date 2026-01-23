"use client";

import { useState, useEffect } from 'react';

export default function Home() {
  const [message, setMessage] = useState("Hello World");

  useEffect(() => {
    fetch('http://127.0.0.1:8080/')
      .then(res => res.json())
      .then(data => {
        if (data.message) {
          setMessage(data.message);
        }
      })
      .catch(err => {
        console.log("Backend not connected, using default message");
      });
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <main className="text-center">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">{message}</h1>
        <p className="text-xl text-gray-700">CS348 Stage 1 - Next.js Frontend</p>
      </main>
    </div>
  );
}
