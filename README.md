<div align="center">

<img src="./src/assets/a.png" alt="Arshiya Shafizade" width="120" style="border-radius: 50%" />

# Arshiya Shafizade — Portfolio

**Full Stack Developer · AI Engineer · 3D Web Enthusiast**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-6366f1?style=for-the-badge&logo=vercel&logoColor=white)](https://arshiyashafizade.github.io/Arshiyashafizade-portfolio)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org)
[![Three.js](https://img.shields.io/badge/Three.js-0.171.0-black?style=for-the-badge&logo=threedotjs&logoColor=white)](https://threejs.org)
[![Vite](https://img.shields.io/badge/Vite-5.4.10-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.14-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

</div>

---

## Overview

A 3D interactive personal portfolio built from scratch with React, Three.js, and Framer Motion. Features a rotating GLTF avatar, an animated phone model, live project screenshots, a swipeable experience carousel, and a working contact form — all wrapped in a deep-space glassmorphic design.

---

## Screenshots

| Hero | Projects | Contact |
|------|----------|---------|
| 3D rotating avatar + animated intro | Tilt cards with live site previews | Glassmorphic form + 3D phone |

---

## Features

- **3D Avatar** — rotating GLTF character model rendered with React Three Fiber, with multi-source lighting
- **Animated Phone** — floating, slow-rotating phone model in the contact section with city environment lighting
- **Live Project Previews** — project cards pull real-time screenshots of each live site via `image.thum.io`
- **Experience Carousel** — Swiper carousel with equal-height cards, smooth hover lift animations, and autoplay
- **Skills Grid** — tech icon grid reflecting the full stack across all projects
- **Contact Form** — glassmorphic form with send spinner, success banner, and EmailJS integration
- **Star Field** — procedurally generated 5,000-point WebGL star background
- **Error Boundaries** — all Three.js canvases wrapped so the page never crashes on WebGL failure
- **Fully Responsive** — mobile-first layout with Tailwind breakpoints

---

## Tech Stack

### Core

![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/Vite-5.4.10-646CFF?style=flat-square&logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3.4.14-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-6.28.0-CA4245?style=flat-square&logo=reactrouter&logoColor=white)

### 3D & Animation

![Three.js](https://img.shields.io/badge/Three.js-0.171.0-black?style=flat-square&logo=threedotjs&logoColor=white)
![R3F](https://img.shields.io/badge/@react--three/fiber-8.17.10-black?style=flat-square&logo=threedotjs&logoColor=white)
![Drei](https://img.shields.io/badge/@react--three/drei-9.116.1-black?style=flat-square&logo=threedotjs&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-11.11.17-0055FF?style=flat-square&logo=framer&logoColor=white)

### UI Components

![Swiper](https://img.shields.io/badge/Swiper-11.1.15-6332F6?style=flat-square&logo=swiper&logoColor=white)
![react-tilt](https://img.shields.io/badge/react--tilt-1.0.2-gray?style=flat-square)
![react-error-boundary](https://img.shields.io/badge/react--error--boundary-5.0.0-gray?style=flat-square)

### Email

![EmailJS](https://img.shields.io/badge/EmailJS-4.4.1-F7C500?style=flat-square&logo=gmail&logoColor=black)

### Deployment

![GitHub Pages](https://img.shields.io/badge/GitHub_Pages-gh--pages_6.3.0-181717?style=flat-square&logo=github&logoColor=white)

---

## Getting Started

### Prerequisites

- Node.js `>= 18`
- npm

### Installation

```bash
# 1. Clone
git clone https://github.com/ARSHIYASHAFIZADE/Arshiyashafizade-portfolio.git
cd Arshiyashafizade-portfolio

# 2. Install dependencies
npm install

# 3. Add environment variables
cp .env.example .env   # then fill in your keys

# 4. Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

Create a `.env` file in the root:

```env
VITE_APP_EMAILJS_SERVICE_ID=your_service_id
VITE_APP_EMAILJS_PUBLIC_KEY=your_public_key
```

Get these from [emailjs.com](https://emailjs.com). The contact form uses template ID `template_7rkkl05` — update it in `src/components/Contact.jsx` if needed.

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |
| `npm run deploy` | Build + deploy to GitHub Pages |

---

## Project Structure

```
Arshiyashafizade-portfolio/
├── public/
│   ├── Avatar/               GLTF avatar model + textures
│   └── Phone/                GLTF phone model + textures
├── src/
│   ├── assets/               Images, icons, tech logos
│   ├── components/
│   │   ├── canvas/
│   │   │   ├── Avatar.jsx    Rotating 3D avatar (hero)
│   │   │   ├── Phone.jsx     Floating 3D phone (contact)
│   │   │   └── Stars.jsx     WebGL star field background
│   │   ├── About.jsx
│   │   ├── Contact.jsx       EmailJS contact form
│   │   ├── Experience.jsx    Swipeable project carousel
│   │   ├── Feedbacks.jsx     Education & testimonials
│   │   ├── Hero.jsx
│   │   ├── Navbar.jsx
│   │   ├── Tech.jsx          Skills icon grid
│   │   └── Works.jsx         Project cards
│   ├── constants/
│   │   └── index.js          All site data (projects, skills, nav)
│   ├── hoc/
│   │   └── SectionWrapper.jsx  Scroll-triggered section wrapper
│   ├── utils/
│   │   └── motion.js         Framer Motion animation variants
│   ├── styles.js
│   ├── App.jsx
│   └── main.jsx
├── .env                      Environment variables (not committed)
├── vite.config.js
├── tailwind.config.cjs
└── package.json
```

---

## Featured Projects

<table>
  <tr>
    <td align="center" width="25%">
      <strong>Ashxcribe</strong><br/>
      <sub>Next.js · Supabase · Groq AI · Tailwind</sub><br/><br/>
      SCRUM standup automation with real-time transcription and AI document generation<br/><br/>
      <a href="https://scrum-tassk-automation.vercel.app">
        <img src="https://img.shields.io/badge/Live-Visit-6366f1?style=flat-square&logo=vercel" />
      </a>
    </td>
    <td align="center" width="25%">
      <strong>The Neon Canopy</strong><br/>
      <sub>Three.js · Next.js · Framer Motion · TypeScript</sub><br/><br/>
      Immersive 3D bioluminescent jungle with procedural audio and 7 post-processing effects<br/><br/>
      <a href="https://my-jungle-seven.vercel.app">
        <img src="https://img.shields.io/badge/Live-Visit-6366f1?style=flat-square&logo=vercel" />
      </a>
    </td>
    <td align="center" width="25%">
      <strong>ALF — Ash Loves Files</strong><br/>
      <sub>Next.js · FastAPI · Python · Docker</sub><br/><br/>
      Universal file converter supporting 120+ formats across 8 categories<br/><br/>
      <a href="https://frontend-production-2bfcc.up.railway.app">
        <img src="https://img.shields.io/badge/Live-Visit-6366f1?style=flat-square&logo=railway" />
      </a>
    </td>
    <td align="center" width="25%">
      <strong>SAM AI</strong><br/>
      <sub>Next.js · Flask · scikit-learn · Mistral-7B</sub><br/><br/>
      AI clinical diagnostics platform with 5 ML models and a medical Q&A chatbot<br/><br/>
      <a href="https://frontend-production-0b91.up.railway.app">
        <img src="https://img.shields.io/badge/Live-Visit-6366f1?style=flat-square&logo=railway" />
      </a>
    </td>
  </tr>
</table>

---

## Contact

<div align="center">

[![Email](https://img.shields.io/badge/Email-shafizadearshiya@gmail.com-EA4335?style=for-the-badge&logo=gmail&logoColor=white)](mailto:shafizadearshiya@gmail.com)
[![GitHub](https://img.shields.io/badge/GitHub-ARSHIYASHAFIZADE-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/ARSHIYASHAFIZADE)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-arshiya--shafizade-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/arshiya-shafizade)

</div>

---

## License

Distributed under the MIT License.
