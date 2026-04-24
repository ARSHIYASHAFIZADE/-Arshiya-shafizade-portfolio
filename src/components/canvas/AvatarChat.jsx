import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Voice recognition hook
const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [speechSupported, setSpeechSupported] = useState(true);
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const supported = !!SpeechRecognition;
    setSpeechSupported(supported);

    if (supported) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event) => {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript;
        setTranscript(transcript);
        console.log("AvatarChat: Recognized speech:", transcript);

        if (event.results[current].isFinal) {
          setIsListening(false);
        }
      };

      recognition.onerror = (event) => {
        console.error("AvatarChat: Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        console.log("AvatarChat: Speech recognition ended");
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      window.recognitionRef = recognition;
    } else {
      console.warn("Speech recognition not supported on this browser");
    }

    return () => {
      recognitionRef.current?.abort();
    };
  }, []);

  const startListening = useCallback(() => {
    if (!speechSupported || !recognitionRef.current) {
      alert("Voice recognition is not supported. Please use Chrome, Edge, or Safari on desktop.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      return;
    }

    setTranscript("");
    setIsListening(true);
    recognitionRef.current.start();
    console.log("AvatarChat: Started listening...");
  }, [speechSupported, isListening]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  return { isListening, transcript, speechSupported, startListening, stopListening };
};

// TTS hook using browser TTS (free, can be upgraded to ElevenLabs/OpenAI)
const useTextToSpeech = () => {
  const speakRef = useRef(null);

  const speak = useCallback((text, onEnd) => {
    console.log("AvatarChat: Speaking text:", text);

    if (speakRef.current) {
      speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onend = () => {
      console.log("AvatarChat: Speech ended");
      onEnd?.();
    };

    speakRef.current = utterance;
    speechSynthesis.speak(utterance);
  }, []);

  const stop = useCallback(() => {
    console.log("AvatarChat: Stopping speech");
    speechSynthesis.cancel();
  }, []);

  return { speak, stop };
};

// Resume context - embedded directly
const RESUME_CONTEXT = `ARSHIYA SHAFIZADE
Full Stack Engineer & AI Developer

CONTACT:
Email: shafizadearshiya@gmail.com
LinkedIn: linkedin.com/in/arshiya-shafizade
GitHub: github.com/ARSHIYASHAFIZADE
Portfolio: arshiyashafizade-portfolio.vercel.app

EDUCATION:
Taylor's University - Bachelor of Computer Science (AI & Data Science), Expected June2026
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

// Groq API integration
const GroqAPI = {
  async chat(userMessage) {
    const API_KEY = import.meta.env.VITE_GROQ_API_KEY;
    console.log("AvatarChat: API key exists:", !!API_KEY);
    console.log("AvatarChat: User message:", userMessage);

    if (!API_KEY) {
      console.error("VITE_GROQ_API_KEY not found in .env");
      return "Please add your Groq API key to Vercel environment variables.";
    }

    try {
      console.log("AvatarChat: Calling Groq API...");
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

When asked about skills, experience, or projects, reference to resume above. Keep responses conversational and under 150 words unless asked for more details. Be concise but informative.`,
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
      console.log("AvatarChat: Groq response:", data);

      if (!data.choices?.[0]?.message?.content) {
        console.error("AvatarChat: No valid response from Groq API");
        return "Sorry, I couldn't process that request.";
      }

      return data.choices[0].message.content || "I couldn't process that request.";
    } catch (error) {
      console.error("AvatarChat: Groq API error:", error);
      console.error("AvatarChat: Error details:", {
        message: error.message,
        status: error.status || "unknown",
      });
      return "Sorry, I'm having trouble connecting right now.";
    }
  },
};

// Main Avatar Chat Component
const AvatarChat = ({ onVisemeUpdate }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const [conversation, setConversation] = useState([]);
  const [isThinking, setIsThinking] = useState(false);
  const lastHandledRef = useRef("");

  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    speechSupported,
  } = useSpeechRecognition();
  const { speak } = useTextToSpeech();

  const handleMicClick = () => {
    if (!speechSupported) {
      alert("Voice recognition is not supported. Please use Chrome, Edge, or Safari on desktop.");
      return;
    }
    if (isListening) {
      stopListening();
      return;
    }
    setAiResponse("");
    startListening();
  };

  // When listening ends with a transcript, send it to Groq
  useEffect(() => {
    if (isListening || isThinking) return;
    const text = transcript?.trim();
    if (!text || text === lastHandledRef.current) return;
    lastHandledRef.current = text;

    (async () => {
      setIsThinking(true);
      const response = await GroqAPI.chat(text);
      setAiResponse(response);
      setConversation((prev) => [...prev, { user: text, ai: response }]);
      setIsThinking(false);
      setIsSpeaking(true);
      speak(response, () => setIsSpeaking(false));
    })();
  }, [isListening, transcript, isThinking, speak]);

  // Send mouth animation data to parent (3D model)
  useEffect(() => {
    if (onVisemeUpdate) {
      onVisemeUpdate(isSpeaking ? 1 : 0); // 1 = open mouth, 0 = closed
    }
  }, [isSpeaking, onVisemeUpdate]);

  return (
    <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-50 w-full max-w-md pointer-events-auto">
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
          disabled={!speechSupported}
          className={`
            w-16 h-16 rounded-full flex items-center justify-center
            ${!speechSupported
              ? "opacity-50 cursor-not-allowed"
              : ""
            } ${
              isListening || isSpeaking
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
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <rect x="9" y="2" width="6" height="12" rx="3" />
              <path d="M5 10v2a7 7 0 0 0 14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="8" y1="23" x2="16" y2="23" />
            </svg>
          </motion.div>
        </motion.button>

        {/* Status text - minimal */}
        <div className="text-white/60 text-xs font-medium">
          {!speechSupported && "Voice not supported"}
          {speechSupported && isListening && "Listening..."}
          {speechSupported && isThinking && "Thinking..."}
          {speechSupported && isSpeaking && "Speaking..."}
          {speechSupported && !isListening && !isThinking && !isSpeaking && "Tap to talk"}
        </div>

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
      </motion.div>
    </div>
  );
};

export default AvatarChat;
