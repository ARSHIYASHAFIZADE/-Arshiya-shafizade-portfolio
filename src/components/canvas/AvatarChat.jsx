import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [finalTranscript, setFinalTranscript] = useState("");
  const [speechSupported, setSpeechSupported] = useState(true);
  const [speechError, setSpeechError] = useState("");
  const [browserInfo, setBrowserInfo] = useState({ name: "", supported: false });
  const recognitionRef = useRef(null);
  const manualStopRef = useRef(false);

  useEffect(() => {
    const detectBrowser = () => {
      const ua = navigator.userAgent;
      let name = "unknown";
      if (ua.includes("Chrome") && !ua.includes("Edg")) name = "Chrome";
      else if (ua.includes("Safari") && !ua.includes("Chrome")) name = "Safari";
      else if (ua.includes("Edg")) name = "Edge";
      else if (ua.includes("Firefox")) name = "Firefox";

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const supported = !!SpeechRecognition;

      setBrowserInfo({ name, supported });
      setSpeechSupported(supported);

      return { SpeechRecognition, supported };
    };

    const { SpeechRecognition, supported } = detectBrowser();
    if (!supported) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.maxAlternatives = 1;

    let interim = "";
    let finalBuf = "";

    recognition.onresult = (event) => {
      interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        if (res.isFinal) finalBuf += res[0].transcript + " ";
        else interim += res[0].transcript;
      }
      const combined = (finalBuf + interim).trim();
      setTranscript(combined);
    };

    recognition.onerror = (event) => {
      console.error("AvatarChat: Speech recognition error:", event.error);
      const errorMap = {
        "network": "Speech service unreachable — please type instead.",
        "not-allowed": "Microphone blocked — allow it in browser settings.",
        "service-not-allowed": "Speech service not allowed — try another browser.",
        "no-speech": "Didn't catch that — try again.",
        "audio-capture": "No microphone found — check your device.",
        "aborted": "Listening stopped.",
      };
      setSpeechError(errorMap[event.error] || `Error: ${event.error}`);
      setIsListening(false);
    };

    recognition.onend = () => {
      const text = (finalBuf + interim).trim();
      if (text) setFinalTranscript(text);
      finalBuf = "";
      interim = "";
      setIsListening(false);
    };

    recognition.onstart = () => {
      console.log("AvatarChat: Speech recognition started");
      setSpeechError("");
    };

    recognitionRef.current = recognition;
    return () => recognition.abort();
  }, []);

  const startListening = useCallback(() => {
    if (!speechSupported || !recognitionRef.current) {
      const browserSupportMsg = browserInfo.name === "unknown"
        ? "Voice not supported — use Chrome, Edge, or Safari."
        : `${browserInfo.name} may not support voice — try Chrome or Edge.`;
      setSpeechError(browserSupportMsg);
      return;
    }
    if (isListening) {
      manualStopRef.current = true;
      recognitionRef.current.stop();
      return;
    }
    setTranscript("");
    setFinalTranscript("");
    setSpeechError("");
    manualStopRef.current = false;
    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch (e) {
      try { recognitionRef.current.stop(); } catch {}
      setSpeechError("Mic busy — try again.");
    }
  }, [speechSupported, isListening, browserInfo]);

  const stopListening = useCallback(() => {
    manualStopRef.current = true;
    try { recognitionRef.current?.stop(); } catch {}
    setIsListening(false);
  }, []);

  return {
    isListening,
    transcript,
    finalTranscript,
    speechSupported,
    speechError,
    browserInfo,
    startListening,
    stopListening
  };
};

const useTextToSpeech = () => {
  const speakRef = useRef(null);
  const voiceRef = useRef(null);
  const [voicesLoaded, setVoicesLoaded] = useState(false);

  const pickMaleVoice = useCallback(() => {
    const voices = speechSynthesis.getVoices();
    if (!voices.length) return null;
    const prefs = [
      /google uk english male/i,
      /google us english.*male/i,
      /microsoft david/i,
      /microsoft guy/i,
      /microsoft mark/i,
      /microsoft george/i,
      /daniel/i,
      /^alex$/i,
      /^fred$/i,
      /^thomas$/i,
      /james/i,
      /robert/i,
      /male/i,
    ];
    for (const p of prefs) {
      const v = voices.find(x => p.test(x.name) && /^en/i.test(x.lang));
      if (v) return v;
    }
    const englishVoice = voices.find(v => /^en/i.test(v.lang));
    return englishVoice || voices[0];
  }, []);

  useEffect(() => {
    const load = () => {
      const voice = pickMaleVoice();
      voiceRef.current = voice;
      setVoicesLoaded(true);
      console.log("AvatarChat: TTS voice selected:", voice?.name || "default");
    };

    load();
    speechSynthesis.onvoiceschanged = load;

    return () => {
      speechSynthesis.onvoiceschanged = null;
    };
  }, [pickMaleVoice]);

  // Chrome's TTS engine pauses after being idle; keep it alive
  useEffect(() => {
    const id = setInterval(() => {
      if (!speechSynthesis.speaking && !speechSynthesis.pending) {
        speechSynthesis.pause();
        speechSynthesis.resume();
      }
    }, 10000);
    return () => clearInterval(id);
  }, []);

  const speak = useCallback((text, onEnd, onViseme) => {
    if (!window.speechSynthesis) {
      onEnd?.();
      return;
    }

    // Cancel any current speech and clear the ref
    speechSynthesis.cancel();
    speakRef.current = null;

    // Chrome silently drops speak() called immediately after cancel() —
    // a 50ms gap gives the engine time to reset before the new utterance.
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 0.95;
      utterance.volume = 1.0;

      const voice = voiceRef.current || pickMaleVoice();
      if (voice) utterance.voice = voice;

      const vowelCount = (word) => (word.match(/[aeiouAEIOU]/g) || []).length;

      let decayTimer = null;
      const pulse = (strength) => {
        onViseme?.(Math.max(0, Math.min(1, strength)));
        if (decayTimer) clearTimeout(decayTimer);
        decayTimer = setTimeout(() => onViseme?.(0.05), 120);
      };

      utterance.onstart = () => { pulse(0.4); };

      utterance.onboundary = (e) => {
        if (e.name !== "word") return;
        const word = text.slice(e.charIndex, e.charIndex + (e.charLength || 4));
        const vowels = vowelCount(word);
        const wordLen = word.length;
        let strength = 0.35;
        if (/[aeiouyAEIOUY]/.test(word)) strength = 0.45 + vowels * 0.12;
        if (/[pbtdkg]/g.test(word)) strength += 0.15;
        if (/[fszv]/g.test(word))   strength += 0.08;
        if (/[mn]/g.test(word))     strength -= 0.08;
        if (wordLen <= 3) strength += 0.1;
        if (wordLen >= 7) strength += 0.15;
        strength += wordLen * 0.02;
        pulse(Math.min(1, strength));
      };

      utterance.onend = () => {
        if (decayTimer) clearTimeout(decayTimer);
        onViseme?.(0);
        onEnd?.();
      };

      utterance.onerror = (e) => {
        if (e.error === "interrupted") return; // expected when we cancel mid-speech
        if (decayTimer) clearTimeout(decayTimer);
        onViseme?.(0);
        onEnd?.();
      };

      speakRef.current = utterance;
      speechSynthesis.speak(utterance);
    }, 50);
  }, [pickMaleVoice]);

  const stop = useCallback(() => {
    if (window.speechSynthesis) {
      speechSynthesis.cancel();
    }
  }, []);

  return { speak, stop, voiceName: voiceRef.current?.name };
};

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
   - 600-file React + TypeScript SPA, 290-file Node.js + Express backend for BeX AI platform
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
      return "API key not configured. Please add your Groq API key.";
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
              content: `You are Arshiya's AI assistant on his portfolio. You speak directly with visitors.

CRITICAL RULES:
- Arshiya is male (he/him). Use "he", "him", "his" never "they" or asterisks.
- Address the visitor naturally, no role-play stage directions.
- Never use markdown asterisks or formatting symbols.
- Keep responses under 100 words, conversational and concise.

RESUME CONTEXT:
${RESUME_CONTEXT}`,
            },
            {
              role: "user",
              content: userMessage,
            },
          ],
          temperature: 0.7,
          max_tokens: 250,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      if (!data.choices?.[0]?.message?.content) {
        return "I couldn't process that request.";
      }

      const raw = data.choices[0].message.content;
      return raw.replace(/\*+/g, "").replace(/\s{2,}/g, " ").trim();
    } catch (error) {
      console.error("AvatarChat: Groq API error:", error);
      return "Sorry, I'm having trouble connecting right now.";
    }
  },
};

const ChatMessage = ({ type, content, isLast }) => {
  const isUser = type === "user";
  const isAi = type === "ai";
  const isSystem = type === "system";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className={`
        w-full mb-2 last:mb-0
        ${isUser ? "flex justify-end" : "flex justify-start"}
      `}
    >
      <div
        className={`
          max-w-[90%] px-4 py-2.5 rounded-2xl text-sm
          ${isUser
            ? "bg-gradient-to-r from-purple-600/80 to-indigo-600/80 text-white rounded-br-md"
            : isAi
            ? "bg-white/10 text-cyan-100/90 backdrop-blur-sm rounded-bl-md border border-white/5"
            : "text-white/60 text-xs"
          }
        `}
      >
        {content}
      </div>
    </motion.div>
  );
};

const ChatBubble = ({ messages, isListening, transcript, isThinking, error }) => {
  return (
    <div className="w-full max-h-[280px] overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent pr-1 space-y-1">
      {error && !isListening && (
        <ChatMessage type="system" content={error} />
      )}

      {isListening && transcript && (
        <ChatMessage type="ai" content={transcript} isLast />
      )}

      {isThinking && (
        <ChatMessage
          type="ai"
          content={
            <span className="flex items-center gap-1.5">
              <span className="flex gap-0.5">
                <motion.span
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: 0 }}
                  className="w-1.5 h-1.5 bg-cyan-400/80 rounded-full"
                />
                <motion.span
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
                  className="w-1.5 h-1.5 bg-cyan-400/80 rounded-full"
                />
                <motion.span
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
                  className="w-1.5 h-1.5 bg-cyan-400/80 rounded-full"
                />
              </span>
              Thinking...
            </span>
          }
          isLast={!messages.length}
        />
      )}

      {messages.map((msg, idx) => (
        <ChatMessage
          key={`${msg.type}-${idx}`}
          type={msg.type}
          content={msg.content}
          isLast={idx === messages.length - 1}
        />
      ))}
    </div>
  );
};

const GREETING = "Hey! I'm Arshiya. Ask me anything about my projects, experience, or skills.";

const AvatarChat = ({ onVisemeUpdate }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isThinking, setIsThinking] = useState(false);
  const [inputText, setInputText] = useState("");
  const [error, setError] = useState("");
  const lastHandledRef = useRef("");
  const onVisemeRef = useRef(onVisemeUpdate);
  useEffect(() => { onVisemeRef.current = onVisemeUpdate; }, [onVisemeUpdate]);

  const {
    isListening,
    transcript,
    finalTranscript,
    startListening,
    stopListening,
    speechSupported,
    speechError,
    browserInfo,
  } = useSpeechRecognition();

  const { speak, stop } = useTextToSpeech();

  const speakResponse = useCallback((text) => {
    setIsSpeaking(true);
    speak(
      text,
      () => { setIsSpeaking(false); onVisemeRef.current?.(0); },
      (level) => onVisemeRef.current?.(level)
    );
  }, [speak]);

  // Auto-greeting with lip sync when chat first appears
  useEffect(() => {
    const t = setTimeout(() => {
      setMessages([{ type: "ai", content: GREETING }]);
      speakResponse(GREETING);
    }, 500);
    return () => clearTimeout(t);
  }, [speakResponse]);

  const sendToGroq = useCallback(async (text) => {
    if (!text?.trim() || isThinking) return;
    if (isSpeaking) {
      stop();
      setIsSpeaking(false);
      onVisemeRef.current?.(0);
    }
    const clean = text.trim();
    setInputText("");
    setError("");
    setMessages(prev => [...prev, { type: "user", content: clean }]);
    setIsThinking(true);
    const response = await GroqAPI.chat(clean);
    setIsThinking(false);
    setMessages(prev => [...prev, { type: "ai", content: response }]);
    speakResponse(response);
  }, [isThinking, isSpeaking, speakResponse, stop]);

  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (inputText.trim()) sendToGroq(inputText);
  };

  useEffect(() => {
    setError(speechError || "");
  }, [speechError]);

  useEffect(() => {
    if (isThinking) return;
    const text = finalTranscript?.trim();
    if (!text || text === lastHandledRef.current) return;
    lastHandledRef.current = text;
    sendToGroq(text);
  }, [finalTranscript, isThinking, sendToGroq]);

  const handleMicClick = () => {
    setError("");
    // Clicking mic while avatar is speaking stops it
    if (isSpeaking) {
      stop();
      setIsSpeaking(false);
      onVisemeRef.current?.(0);
      return;
    }
    if (isListening) {
      stopListening();
    } else {
      if (!speechSupported) {
        setError(browserInfo.name === "unknown"
          ? "Voice not supported. Try Chrome or Edge."
          : `${browserInfo.name} may not support voice. Try Chrome or Edge.`);
        return;
      }
      startListening();
    }
  };

  const isProcessing = isThinking || isSpeaking || isListening;

  return (
    <div className="absolute top-[20%] right-6 z-50 w-[340px] max-w-[calc(100vw-3rem)] pointer-events-auto">
      <div className="flex flex-col gap-3">

        <AnimatePresence mode="wait">
          {(messages.length > 0 || isListening || transcript || isThinking || error) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="bg-gradient-to-br from-[rgba(12,12,35,0.95)] to-[rgba(8,8,28,0.95)] backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl shadow-black/30 overflow-hidden"
            >
              <div className="px-5 py-3 border-b border-white/5">
                <div className="flex items-center justify-between">
                  <span className="text-white/50 text-xs font-medium uppercase tracking-wider">
                    Chat with Arshiya
                  </span>
                  {isListening && (
                    <motion.span
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="text-red-400 text-xs font-medium flex items-center gap-1.5"
                    >
                      <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                      Listening
                    </motion.span>
                  )}
                </div>
              </div>

              <div className="p-4">
                <ChatBubble
                  messages={messages}
                  isListening={isListening}
                  transcript={transcript}
                  isThinking={isThinking}
                  error={error}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-[rgba(12,12,35,0.9)] to-[rgba(8,8,28,0.9)] backdrop-blur-xl rounded-full border border-white/10 shadow-2xl shadow-black/30"
        >
          <form onSubmit={handleTextSubmit} className="flex items-center gap-2 px-2 py-2">
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleMicClick}
              disabled={!speechSupported && !isSpeaking}
              title={isSpeaking ? "Click to stop" : isListening ? "Click to stop listening" : "Click to speak"}
              className={`
                w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0
                transition-all duration-300
                ${!speechSupported && !isSpeaking
                  ? "opacity-40 cursor-not-allowed bg-white/5"
                  : isListening
                  ? "bg-gradient-to-br from-red-500 to-pink-600 shadow-[0_0_25px_rgba(239,68,68,0.4)]"
                  : isSpeaking
                  ? "bg-gradient-to-br from-cyan-500 to-teal-500 shadow-[0_0_25px_rgba(6,182,212,0.4)] cursor-pointer"
                  : "bg-gradient-to-br from-purple-600 to-indigo-600 hover:shadow-[0_0_20px_rgba(147,51,234,0.3)]"
                }
              `}
            >
              {isListening ? (
                <motion.svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                >
                  <rect x="6" y="4" width="4" height="16" rx="2" />
                  <rect x="14" y="4" width="4" height="16" rx="2" />
                </motion.svg>
              ) : isSpeaking ? (
                <motion.svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                >
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                </motion.svg>
              ) : (
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" y1="19" x2="12" y2="23" />
                  <line x1="8" y1="23" x2="16" y2="23" />
                </svg>
              )}
            </motion.button>

            <div className="flex-1 relative">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                  isListening ? "Listening..." : isThinking ? "Thinking..." : "Ask me anything..."
                }
                disabled={isListening || isThinking}
                className="w-full bg-white/5 text-white text-sm placeholder:text-white/40 outline-none px-4 py-3 rounded-full border border-transparent focus:border-white/10 transition-all disabled:opacity-50"
              />
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: inputText.trim() ? 1.05 : 1 }}
              whileTap={{ scale: inputText.trim() ? 0.95 : 1 }}
              disabled={!inputText.trim() || isListening || isThinking}
              className={`
                w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
                transition-all duration-200
                ${inputText.trim() && !isListening && !isThinking
                  ? "bg-gradient-to-br from-cyan-500 to-teal-500 hover:shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                  : "bg-white/10 opacity-40 cursor-not-allowed"
                }
              `}
            >
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                <path d="M22 2L11 13" />
              </svg>
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AvatarChat;
