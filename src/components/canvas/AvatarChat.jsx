import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Voice recognition hook
const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("Speech recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const result = event.results[0][0].transcript;
      setTranscript(result);
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    window.recognitionRef = recognition;
  }, []);

  const startListening = useCallback(() => {
    if (window.recognitionRef) {
      window.recognitionRef.start();
      setIsListening(true);
    }
  }, []);

  const stopListening = useCallback(() => {
    if (window.recognitionRef) {
      window.recognitionRef.stop();
      setIsListening(false);
    }
  }, []);

  return { isListening, transcript, startListening, stopListening };
};

// TTS hook using browser TTS (free, can be upgraded to ElevenLabs/OpenAI)
const useTextToSpeech = () => {
  const speakRef = useRef(null);

  const speak = useCallback((text, onEnd) => {
    if (speakRef.current) {
      speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onend = () => {
      onEnd?.();
    };

    speakRef.current = utterance;
    speechSynthesis.speak(utterance);
  }, []);

  const stop = useCallback(() => {
    speechSynthesis.cancel();
  }, []);

  return { speak, stop };
};

// Lip-sync analyzer - extracts audio features for mouth animation
const useLipSync = (isSpeaking) => {
  const [viseme, setViseme] = useState(0);

  useEffect(() => {
    if (!isSpeaking) {
      setViseme(0); // Closed mouth
      return;
    }

    // Simple simulated lip-sync - cycles through visemes when speaking
    const interval = setInterval(() => {
      setViseme(prev => (prev + 1) % 10); // 10 basic viseme positions
    }, 100);

    return () => clearInterval(interval);
  }, [isSpeaking]);

  return viseme;
};

// Groq API integration
const RESUME_CONTEXT = `ARSHIYA SHAFIZADE
Full Stack Engineer & AI Developer

CONTACT:
Email: shafizadearshiya@gmail.com
LinkedIn: linkedin.com/in/arshiya-shafizade
GitHub: github.com/ARSHIYASHAFIZADE
Portfolio: arshiyashafizade-portfolio.vercel.app

EDUCATION:
Taylor's University - Bachelor of Computer Science (AI & Data Science), Expected June 2026
Sunway College - CIMP Diploma (Canadian)

WORK EXPERIENCE:
1. CoolRiots - Full Stack Developer (Feb 2025 - Present)
   - 600-file/102K LOC React + TypeScript SPA, 290-file/28K LOC Node.js + Express backend for BeX AI platform
   - Designed OpCode V2 CPIE schema (JSON workflow language with llm, api, memory, rag steps)
   - Integrated 8+ LLM providers (OpenAI, Groq, Gemini, WatsonX, Mistral, SambaNova, Cerebras, Novita)
   - Built LangChain + Neo4j GraphRAG pipeline, Milvus vector DB, IBM Cloud Object Storage
   - Multi-tenant provisioning: Azure AD SSO, IBM Cloud Broker, RBAC across orgs
   - GitOps deployment: ArgoCD, GitHub Actions, IBM Cloud IKS, Playwright E2E tests

2. LeedAlways - Backend Developer WBL (Sep 2025 - Present)
   - Architected ECM middleware: Python 3.12 FastAPI, 181 REST endpoints, 26 service modules
   - 8-service Docker Compose stack: Nextcloud, Elasticsearch, MongoDB, MariaDB, Redis, LibreSign
   - Dual-layer auth: Basic Auth + JWT, RBAC, secure env variable isolation
   - OmniScribe: Real-time AI transcription with Whisper, pyannote.audio diarization
   - 3-tier Elasticsearch pipeline, Temporal workflow engine for async job orchestration

3. Vogue Steel Factory LLC - Freelance Frontend Developer
   - High-performance corporate web platform using React 19 and Vite
   - Sticky galleries, micro-animations, responsive layouts for UAE steel fabrication company

PROJECTS & RESEARCH:
1. SamAi - AI Medical Diagnosis System (Python, Scikit-Learn, Flask, Next.js)
   - Breast cancer tumor classification using ML pipelines
   - Research paper "Diagnosis of Breast Cancer Tumor Type" accepted at 7th Int'l Conference (Tbilisi 2024)

2. Ashxcribe - AI-Powered SCRUM Standup Platform
   - Real-time transcription (Web Speech API + Groq Whisper), LLaMA 3.3 70B for document generation
   - Multi-tenant SaaS, Supabase Row-Level Security, Cloudflare Turnstile protection
   - PDF/DOCX/audio export, Vercel deployment with Next.js App Router

3. ALF (Ash Loves Files) - Universal File Converter
   - 120+ formats across 8 categories, no account required, auto-delete after 1 hour
   - FastAPI + Celery + Redis pipeline, Docker Compose, Railway deployment

TECHNICAL SKILLS:
Languages/Frameworks: Python, JavaScript, TypeScript, Node.js, FastAPI, Express.js, React, Next.js
AI/Data: LLMs (LLaMA, GPT, Gemini, Groq, WatsonX, Mistral, SambaNova, Cerebras, Novita), RAG, GraphRAG, LangChain, Neo4j, Whisper, pyannote.audio, HuggingFace, TensorFlow, Scikit-Learn, Computer Vision
Databases/Search: MongoDB, MySQL, PostgreSQL, Redis, Milvus/Zilliz, Elasticsearch, Neo4j
Infra/DevOps: Docker, Nginx, GitHub Actions, GitLab CI/CD, ArgoCD, IBM Cloud, Cloudflare, Linux, Temporal
Security: JWT, OAuth2, Azure AD SSO, HashiCorp Vault, Passport.js, WebSockets, Stripe`;

const GroqAPI = {
  async chat(userMessage) {
    const API_KEY = import.meta.env.VITE_GROQ_API_KEY;

    if (!API_KEY) {
      console.error("VITE_GROQ_API_KEY not found in .env");
      return "Please add your Groq API key to the .env file.";
    }

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content: `You are Arshiya Shafizade's AI assistant. Be friendly, professional, and helpful.

RESUME CONTEXT:
${RESUME_CONTEXT}

When asked about skills, experience, or projects, reference the resume above. Keep responses conversational and under 150 words unless asked for more details. Be concise but informative.`,
            },
            {
              role: "user",
              content: userMessage,
            },
          ],
          temperature: 0.7,
          max_tokens: 300,
        }),
      });

      const data = await response.json();
      return data.choices?.[0]?.message?.content || "I couldn't process that response.";
    } catch (error) {
      console.error("Groq API error:", error);
      return "Sorry, I'm having trouble connecting right now.";
    }
  },
};

// Main Avatar Chat Component
const AvatarChat = ({ onVisemeUpdate }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [conversation, setConversation] = useState([]);

  const { startListening, stopListening } = useSpeechRecognition();
  const { speak, stop: stopSpeaking } = useTextToSpeech();

  const handleMicClick = async () => {
    if (isListening) {
      stopListening();
      return;
    }

    setIsListening(true);
    startListening();

    // Wait for speech result
    setTimeout(async () => {
      if (transcript) {
        const response = await GroqAPI.chat(transcript);
        setAiResponse(response);
        setConversation(prev => [...prev, { user: transcript, ai: response }]);
        setIsSpeaking(true);
        speak(response, () => {
          setIsSpeaking(false);
        });
      }
      setIsListening(false);
    }, 5000); // 5 second timeout for speech
  };

  // Send mouth animation data to parent (3D model)
  useEffect(() => {
    if (onVisemeUpdate) {
      onVisemeUpdate(isSpeaking ? 1 : 0); // 1 = open mouth, 0 = closed
    }
  }, [isSpeaking, onVisemeUpdate]);

  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-md">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[rgba(9,9,31,0.9)] backdrop-blur-lg rounded-2xl border border-purple-500/30 p-4"
      >
        {/* Transcript display */}
        <AnimatePresence mode="wait">
          {transcript && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-3 text-purple-200 text-sm"
            >
              You: {transcript}
            </motion.div>
          )}
          {aiResponse && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-3 text-cyan-200 text-sm"
            >
              AI: {aiResponse}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mic button */}
        <div className="flex items-center justify-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleMicClick}
            className={`
              w-16 h-16 rounded-full flex items-center justify-center
              ${isListening || isSpeaking
                ? "bg-red-500/20 border-red-500/50"
                : "bg-purple-500/20 border-purple-500/50"
              }
              border-2 backdrop-blur-md transition-all duration-300
            `}
          >
            <motion.div
              animate={isListening || isSpeaking ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.8, repeat: isListening || isSpeaking ? Infinity : 0 }}
              className={`text-2xl ${isListening || isSpeaking ? "text-red-400" : "text-purple-400"}`}
            >
              {isListening || isSpeaking ? "🔴" : "🎤"}
            </motion.div>
          </motion.button>

          <div className="text-xs text-purple-300/60">
            {isListening && "Listening..."}
            {isSpeaking && "Speaking..."}
            {!isListening && !isSpeaking && "Tap to talk"}
          </div>
        </div>

        {/* Status indicator */}
        <div className="mt-2 text-center">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs ${
            isListening || isSpeaking ? "bg-green-500/20 text-green-300" : "bg-slate-500/20 text-slate-400"
          }`}>
            <span className={`w-2 h-2 rounded-full ${isListening || isSpeaking ? "bg-green-400 animate-pulse" : "bg-slate-400"}`} />
            {isSpeaking ? "Speaking" : isListening ? "Listening" : "Idle"}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AvatarChat;
