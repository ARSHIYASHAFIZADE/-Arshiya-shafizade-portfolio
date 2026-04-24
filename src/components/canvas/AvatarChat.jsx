import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Voice recognition hook
const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    // Check audio permission
    const checkPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());
        setHasPermission(true);
      } catch (err) {
        console.warn("Audio permission denied:", err);
        setHasPermission(false);
      }
    };

    checkPermission();

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

  return { isListening, transcript, hasPermission, startListening, stopListening };
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

  const { startListening, stopListening, hasPermission } = useSpeechRecognition();
  const { speak, stop: stopSpeaking } = useTextToSpeech();

  const handleMicClick = async () => {
    if (!hasPermission) {
      // Request permission on first click
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (err) {
        alert("Microphone access is required for voice chat. Please allow it in your browser.");
        return;
      }
    }

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
    <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-30 w-full max-w-md">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 bg-[rgba(9,9,31,0.85)] backdrop-blur-xl rounded-full border border-white/10 p-2"
      >
        {/* Mic button */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleMicClick}
          className={`
            w-16 h-16 rounded-full flex items-center justify-center
            ${isListening || isSpeaking
              ? "bg-white/10 border-white/30 shadow-[0_0_20px_rgba(255,255,255,0.15)]"
              : "bg-white/5 border-white/10 hover:bg-white/10"
            }
            border transition-all duration-300 backdrop-blur-md
          `}
        >
          <motion.div
            animate={isListening || isSpeaking ? { scale: [1, 1.15, 1], opacity: [1, 0.8, 1] } : {}}
            transition={{ duration: 1, repeat: isListening || isSpeaking ? Infinity : 0 }}
            className={`
              w-7 h-7 rounded-full flex items-center justify-center
              ${isListening || isSpeaking
                ? "bg-gradient-to-br from-red-500 to-pink-500"
                : "bg-gradient-to-br from-purple-500 to-indigo-500"
              }
            `}
          >
            <svg
              className="w-3.5 h-3.5 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              {isListening || isSpeaking ? (
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-6 6 3 3 0 0 0 3-3h1a3 3 0 0 0 0 6h1a3 3 0 0 0 0-6z" />
              ) : (
                <>
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-6 6 3 3 0 0 0 3-3h1a3 3 0 0 0 0 6h1a3 3 0 0 0 0-6z" />
                  <path d="M19 10v2a7 7 0 0 0-7 7h-4a7 7 0 0 0-7-7v-2" opacity={0.5} />
                </>
              )}
            </svg>
          </motion.div>
        </motion.button>

        {/* Status text - minimal */}
        <div className="text-white/60 text-xs font-medium">
          {isListening && "Listening..."}
          {isSpeaking && "Speaking..."}
          {!isListening && !isSpeaking && "Tap to talk"}
        </div>
      </motion.div>

      {/* Transcript/AI response - positioned above button */}
      <AnimatePresence mode="wait">
        {(transcript || aiResponse) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute -top-20 left-1/2 -translate-x-1/2 w-max max-w-xs"
          >
            <div className="bg-[rgba(9,9,31,0.95)] backdrop-blur-lg rounded-xl border border-white/10 px-4 py-3">
              {transcript && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-white/80 text-sm mb-1"
                >
                  {transcript}
                </motion.div>
              )}
              {aiResponse && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-cyan-300/90 text-sm"
                >
                  {aiResponse}
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AvatarChat;
