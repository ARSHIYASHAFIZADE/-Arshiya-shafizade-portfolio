import {
  mobile,
  backend,
  creator,
  web,
  javascript,
  typescript,
  html,
  css,
  reactjs,
  tailwind,
  nodejs,
  git,
  docker,
  image,
  carrent,
  threejs,
  render,
} from "../assets";

export const navLinks = [
  { id: "about",     title: "About"      },
  { id: "work",      title: "Experience" },
  { id: "projects",  title: "Projects"   },
  { id: "stack",     title: "Stack"      },
  { id: "education", title: "Education"  },
  { id: "contact",   title: "Contact"    },
];

const services = [
  {
    title: "Backend & Systems Architect",
    icon: "https://cdn-icons-png.flaticon.com/512/8637/8637099.png", // Temporary, will use custom SVG in component
    description: "Designing distributed Node.js/FastAPI systems with focus on concurrency and performance.",
    accent: "#38bdf8"
  },
  {
    title: "AI / LLM Workflow Engineer",
    icon: "https://cdn-icons-png.flaticon.com/512/1728/1728765.png",
    description: "Architecting agentic RAG pipelines and custom workflow engines using multi-provider LLM stacks.",
    accent: "#a78bfa"
  },
  {
    title: "ML & Clinical Data Science",
    icon: "https://cdn-icons-png.flaticon.com/512/4824/4824797.png",
    description: "Building production-grade diagnostic ML models with focus on health informatics and classification.",
    accent: "#34d399"
  },
  {
    title: "3D Immersive Developer",
    icon: "https://cdn-icons-png.flaticon.com/512/2103/2103633.png",
    description: "Bridging creative design with WebGL and React Three Fiber for high-fidelity interactive experiences.",
    accent: "#f97316"
  },
];

const technologies = [
  { name: "JavaScript", icon: javascript },
  { name: "TypeScript", icon: typescript },
  { name: "React", icon: reactjs },
  { name: "Next.js", icon: "https://cdn.worldvectorlogo.com/logos/nextjs-2.svg" },
  { name: "Tailwind CSS", icon: tailwind },
  { name: "Node.js", icon: nodejs },
  { name: "Python", icon: "https://cdn.worldvectorlogo.com/logos/python-5.svg" },
  { name: "FastAPI", icon: "https://cdn.worldvectorlogo.com/logos/fastapi-1.svg" },
  { name: "PostgreSQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg" },
  { name: "Redis", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/redis/redis-original.svg" },
  { name: "Neo4j", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/neo4j/neo4j-original.svg" },
  { name: "Milvus", icon: "https://avatars.githubusercontent.com/u/73219761?s=200&v=4" },
  { name: "Three.js", icon: threejs },
  { name: "Docker", icon: docker },
  { name: "Kubernetes", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/kubernetes/kubernetes-plain.svg" },
  { name: "OpenShift", icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons@v11/icons/redhatopenshift.svg" },
  { name: "IBM Cloud", icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons@v11/icons/ibm.svg" },
  { name: "Vault", icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons@v11/icons/vault.svg" },
  { name: "Elasticsearch", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/elasticsearch/elasticsearch-original.svg" },
  { name: "ArgoCD", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/argocd/argocd-original.svg" },
  { name: "Git", icon: git },
  { name: "GitHub", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg", invert: true },
  { name: "Claude Code", icon: "https://avatars.githubusercontent.com/u/76263028?s=200&v=4" },
];

const workExperiences = [
  {
    title: "Full Stack & AI Engineer",
    company_name: "Coolriots — BeX Platform",
    icon: "/coolriots.png",
    iconBg: "#060e1a",
    date: "2025",
    metrics: [
      { label: "Codebase", value: "102K LOC" },
      { label: "AI Models", value: "8+ Providers" },
      { label: "Architecture", value: "Multi-Tenant" }
    ],
    tags: ["React", "TypeScript", "Express", "Redis", "Milvus", "LLMs", "ArgoCD", "Kubernetes"],
    points: [
      "Worked across a 600-file / 102K LOC React + TypeScript SPA and 290-file / 28K LOC Express backend for BeX, an enterprise AI business execution platform.",
      "Built AI workflows using the OpCode V2 CPIE schema — a JSON workflow language with complex conditional routing and memory-augmented conversation threading.",
      "Utilized 8+ LLM providers (OpenAI, Groq, Gemini, WatsonX, Mistral) with per-step model selection and WebSocket token streaming.",
      "Developed on Perem LLMs using Rebilient Atom Max chips — conducted benchmarking and testing of chip capabilities.",
      "Built multi-tenant provisioning: organization lifecycle with Redis/Milvus namespace cloning and Azure AD SSO via Passport.js.",
      "Integrated Stripe, Milvus vector database, Elasticsearch, IBM Cloud Object Storage, and HashiCorp Vault.",
      "Deployed on IBM Cloud OpenShift with Kubernetes, enforced quality with ESLint + Husky, and shipped Playwright E2E tests via GitOps.",
    ],
  },
  {
    title: "Frontend Developer",
    company_name: "LeadAlways — ECM",
    icon: "/leadalways.png",
    iconBg: "#0d1a2e",
    date: "2024 – 2025",
    metrics: [
      { label: "Admin Modules", value: "30+" },
      { label: "Performance", value: "Vite/React 19" },
      { label: "Scope", value: "Enterprise" }
    ],
    tags: ["React", "Gemini AI", "Docker", "i18next", "Nginx", "GitLab CI", "LDAP"],
    points: [
      "Built the full React + TypeScript frontend for LeadAlways ECM, a production enterprise document management platform.",
      "Designed a visual workflow builder with approval engine, scheduling with timezone support, and conditional metadata logic.",
      "Developed a dynamic form builder with drag-and-drop field types and real-time submission handling.",
      "Integrated Google Gemini AI SDK for document processing assistance and intelligent content suggestions.",
      "Built 30+ admin configuration modules covering LDAP, document encryption, external storage, and e-signature.",
      "Implemented full i18n support and configured Docker + Nginx deployment with a GitLab CI/CD pipeline.",
    ],
  },
];

const experiences = [
  {
    title: "Full Stack Developer",
    company_name: "CoolRiots — BeX",
    icon: "https://image.thum.io/get/width/100/crop/100/https://bex-system-design.vercel.app",
    iconBg: "#0a2e2e",
    date: "2024-2025",
    points: [
      "Worked across a 600-file / 102K LOC React + TypeScript SPA and 290-file / 28K LOC Express backend for BeX, an enterprise AI business execution platform for multi-tenant SaaS.",
      "Built AI workflows using the OpCode V2 CPIE schema — a JSON workflow language with step types (llm, api, memory, rag, subflow, choose), OEL expression syntax (@input., @step_id.), conditional routing, and memory-augmented conversation threading backed by Redis.",
      "Utilized 8+ LLM providers (OpenAI, Groq, Google Gemini, IBM WatsonX, Mistral, SambaNova, Cerebras, Novita) with per-step model selection and WebSocket token streaming to the frontend.",
      "Developed on Perem LLMs using Rebilient Atom Max chips — conducted benchmarking and testing of chip capabilities.",
      "Built multi-tenant provisioning: organization lifecycle with Redis/Milvus namespace cloning, IBM Cloud Broker (OSB v2.12), Azure AD SSO via Passport.js, and role-based access across orgs and sub-orgs.",
      "Integrated Stripe subscriptions, Milvus/Zilliz vector database, Elasticsearch, IBM Cloud Object Storage, and HashiCorp Vault for secrets management.",
      "Deployed on IBM Cloud OpenShift with Kubernetes, enforced quality with ESLint + Husky pre-commit hooks, and shipped Playwright E2E tests against staging via GitOps (ArgoCD image updates + GitHub Actions).",
    ],
  },
  {
    title: "Full Stack Developer",
    company_name: "Ashxcribe",
    icon: "https://image.thum.io/get/width/100/crop/100/https://scrum-tassk-automation.vercel.app",
    iconBg: "#1a1a2e",
    date: "2025",
    points: [
      "Built a multi-tenant SCRUM standup automation platform with real-time transcription via Web Speech API and Groq Whisper.",
      "Integrated Groq Llama 3.3 70B to auto-generate structured SCRUM documents from raw speech transcripts.",
      "Implemented Supabase authentication with Row Level Security, Cloudflare Turnstile bot protection, and full security hardening.",
      "Supported multi-company workspaces, custom templates, and PDF/DOCX/audio export.",
    ],
  },
  {
    title: "3D & Creative Developer",
    company_name: "The Neon Canopy",
    icon: "https://image.thum.io/get/width/100/crop/100/https://my-jungle-seven.vercel.app",
    iconBg: "#0d2818",
    date: "2025",
    points: [
      "Designed and built an immersive bioluminescent 3D jungle experience featuring six mythical creatures with cinematic visuals.",
      "Implemented procedural audio synthesis using the Web Audio API for reactive soundscapes.",
      "Applied 7 composited post-processing effects: bloom, depth-of-field, chromatic aberration, vignette, and more.",
      "Built a five-phase cinematic intro sequence with particle systems using React Three Fiber and Framer Motion.",
    ],
  },
  {
    title: "Full Stack Developer",
    company_name: "ALF — Ash Loves Files",
    icon: "https://image.thum.io/get/width/100/crop/100/https://frontend-production-2bfcc.up.railway.app",
    iconBg: "#1a0a2e",
    date: "2025",
    points: [
      "Built a universal file converter supporting 120+ formats across 8 categories: image, document, audio, video, ebook, archive, data, and font.",
      "Architected a FastAPI backend with Celery + Redis task queue for async conversions and real-time progress tracking.",
      "Bundled FFmpeg, LibreOffice, Pandoc, ImageMagick, and Calibre into a Docker image for zero-dependency deployment.",
      "Designed a Next.js 15 frontend with drag-and-drop upload, format explorer, and automatic file cleanup after 1 hour.",
    ],
  },
  {
    title: "AI / ML Developer",
    company_name: "SAM AI",
    icon: "https://image.thum.io/get/width/100/crop/100/https://github.com/ARSHIYASHAFIZADE/SamAI",
    iconBg: "#0a1a2e",
    date: "2024",
    points: [
      "Developed an AI clinical diagnostic platform with five scikit-learn ML models screening for heart disease, female and male diabetes, liver disease, and breast cancer.",
      "Integrated Groq / Llama 3.3-70B for a real-time medical Q&A chatbot with clinical context awareness.",
      "Generates client-side PDF diagnostic reports with jsPDF covering risk scores, confidence intervals, and clinical recommendations.",
      "Built a professional pytest integration test suite covering all five prediction endpoints and full auth flow on an in-memory SQLite database.",
    ],
  },
];

const testimonials = [
  {
    testimonial:
      "Research and Publications: Co-authored research on Diagnosis of Breast Cancer Tumor Type, using AI to enhance diagnostic accuracy through a fuzzy combination of regression methods.",
    name: "Research and Publications",
    designation: "Developer & Researcher",
    company: "SAM AI",
    image: image,
  },
  {
    testimonial: "CIMP Diploma",
    name: "Sunway University in sunway city-Malaysia",
    designation: "Student",
    company: "Sunway University",
    image: "/sunway-logo.jpg",
  },
  {
    testimonial:
      "Bachelor of Computer Science, Specialization in AI and extension in Data Science!, Second year student with CGPA:3.5",
    name: "Taylor's University in sunway city-Malaysia",
    designation: "Student",
    company: "Taylor's University",
    image:
      "https://media.glassdoor.com/sqll/319279/taylor-s-university-college-squarelogo-1428399291142.png",
  },
  {
    testimonial:
      "Certified in Claude 101 — foundational course covering Claude AI capabilities, prompt engineering, and effective human-AI collaboration patterns.",
    name: "Claude 101",
    designation: "Certificate of Completion",
    company: "Anthropic",
    image: "https://avatars.githubusercontent.com/u/76263028?s=200&v=4",
  },
  {
    testimonial:
      "Certified in Claude Code 101 — fundamentals of AI-assisted software development using Claude Code CLI, agentic tool use, and automated engineering workflows.",
    name: "Claude Code 101",
    designation: "Certificate of Completion",
    company: "Anthropic",
    image: "https://avatars.githubusercontent.com/u/76263028?s=200&v=4",
  },
  {
    testimonial:
      "Certified in Claude Code in Action — advanced practitioner course applying Claude Code to real engineering workflows, multi-step automation, and production codebases.",
    name: "Claude Code in Action",
    designation: "Certificate of Completion",
    company: "Anthropic",
    image: "https://avatars.githubusercontent.com/u/76263028?s=200&v=4",
  },
];

const projects = [
  {
    name: "The Neon Canopy",
    accent: "#06b6d4",
    description:
      "An immersive 3D bioluminescent jungle experience featuring six mythical creatures with cinematic visuals, procedural audio synthesis, and a five-phase animated introduction. Built with Three.js, React Three Fiber, and advanced post-processing effects.",
    tags: [
      { name: "Three.js" },
      { name: "Next.js" },
      { name: "Framer Motion" },
      { name: "TypeScript" },
    ],
    image: "/canopy.png",
    icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons@v11/icons/vercel.svg",
    source_code_link: "https://my-jungle-seven.vercel.app",
  },
  {
    name: "Ashxcribe",
    accent: "#8b5cf6",
    description:
      "Multi-tenant SCRUM standup platform that records meetings, transcribes them in real-time with Groq Whisper, and generates AI-powered SCRUM documents. Supports multi-company workspaces, custom templates, and PDF/DOCX export.",
    tags: [
      { name: "Next.js" },
      { name: "Supabase" },
      { name: "Groq AI" },
      { name: "Tailwind" },
    ],
    image: "/task_automation.jpeg",
    icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons@v11/icons/vercel.svg",
    source_code_link: "https://scrum-tassk-automation.vercel.app",
  },
  {
    name: "ALF — Ash Loves Files",
    accent: "#f97316",
    description:
      "Universal file converter supporting 120+ formats across 8 categories including image, document, audio, video, ebook, archive, data, and font. Free, no sign-up required. Built with a FastAPI backend, Celery task queue, and Docker containerization.",
    tags: [
      { name: "Next.js" },
      { name: "FastAPI" },
      { name: "Python" },
      { name: "Docker" },
    ],
    image: "/alf.png",
    icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons@v11/icons/github.svg",
    source_code_link: "https://github.com/ARSHIYASHAFIZADE/ALF",
  },
  {
    name: "SAM AI — Clinical Diagnostics",
    accent: "#3b82f6",
    description:
      "AI-powered clinical diagnostic platform with five ML models screening for heart disease, diabetes, liver disease, and breast cancer. Returns risk scores with confidence intervals in under one second. Includes a medical Q&A chatbot powered by Groq / Llama 3.3-70B.",
    tags: [
      { name: "Next.js" },
      { name: "Flask" },
      { name: "scikit-learn" },
      { name: "Llama 3.3" },
    ],
    image: "/sam.jpeg",
    icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons@v11/icons/github.svg",
    source_code_link: "https://github.com/ARSHIYASHAFIZADE/SamAI",
  },
];

export { services, technologies, workExperiences, experiences, testimonials, projects };
