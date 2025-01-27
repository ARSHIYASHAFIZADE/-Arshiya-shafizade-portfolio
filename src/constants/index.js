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
  redux,
  tailwind,
  nodejs,
  mongodb,
  git,
  figma,
  docker,
  image,
  carrent,
  threejs,
  render,
} from "../assets";

export const navLinks = [
  { id: "about", title: "About" },
  { id: "work", title: "Work" },
  { id: "DV", title: "DV" },
  { id: "contact", title: "Contact" },
];

const services = [
  {
    title: "Web Developer",
    icon: "https://cdn2.iconfinder.com/data/icons/seo-and-web-development-filled-outline/64/Backend-Development-Website-Server-Internet-1024.png",
  },
  {
    title: "Data Scientist",
    icon: "https://cdn-icons-png.flaticon.com/512/4824/4824797.png",
  },
  {
    title: "Data visualizer",
    icon: "https://cdn2.iconfinder.com/data/icons/artifiial-intelligence/70/48_Data_Visualization-1024.png",
  },
  {
    title: "Researcher",
    icon: "https://icon-library.com/images/research-icon-png/research-icon-png-9.jpg",
  },
];

const technologies = [
  { name: "HTML 5", icon: html },
  { name: "CSS 3", icon: css },
  { name: "JavaScript", icon: javascript },
  { name: "TypeScript", icon: typescript },
  { name: "React JS", icon: reactjs },
  { name: "Redux Toolkit", icon: redux },
  { name: "Tailwind CSS", icon: tailwind },
  { name: "Node JS", icon: nodejs },
  { name: "MongoDB", icon: mongodb },
  { name: "Three JS", icon: threejs },
  { name: "git", icon: git },
  { name: "figma", icon: figma },
  { name: "docker", icon: docker },
];

const experiences = [
  {
    title: "Full Stack Web Developer",
    company_name: "SamAi",
    icon: image,
    iconBg: "#383E56",
    date: "September 2024 - November 2024",
    points: [
      "Developing and maintaining web applications using React | Python and other related technologies.",
      "Collaborating with cross-functional teams including Doctors, AI specialists to create high-quality products.",
      "Implementing responsive design and ensuring cross-browser compatibility.",
      "Led the integration of AI models into a web-based application using Flask, enabling seamless interaction with web data as a full-stack developer.",
    ],
  },
  {
    title: "E-commerce Web Developer",
    company_name: "Webstore",
    icon: "https://static.vecteezy.com/system/resources/previews/016/017/018/large_2x/ecommerce-icon-free-png.png",
    iconBg: "#383E56",
    date: "November 2023 - December 2023",
    points: [
      "Built and managed the Webstore to learn about e-commerce development.",
      "Gained experience in managing products, creating product carts, and integrating payment systems.",
      "Designed and implemented features for user authentication and product filtering.",
      "Ensured a smooth user experience with responsive design and cross-browser compatibility.",
    ],
  },
  {
    title: "AI Researcher",
    company_name: "Weed Detection System",
    icon: "https://tse3.mm.bing.net/th?id=OIP.u8UxVZi9bSiuyhfhpe64HAHaHa&w=474&h=474&c=7",
    iconBg: "#383E56",
    date: "January 2025 - February 2025",
    points: [
      "Developed a weed detection system using neural networks to identify weeds in agricultural fields.",
      "Learned about and applied morphological image operations for preprocessing and feature extraction.",
      "Implemented image segmentation techniques to isolate regions of interest for better analysis.",
      "Explored and experimented with various neural network architectures to achieve optimal results.",
      "Gained hands-on experience with training, testing, and fine-tuning neural networks for real-world applications.",
    ],
  },
  {
    title: "Game Developer",
    company_name: "Othello Game Project",
    icon: "https://images.launchbox-app.com/81b5b418-a1a2-4daa-8986-6bfb1ea39b3f.png",
    iconBg: "#383E56",
    date: "December 2024 - January 2025",
    points: [
      "Developed an Othello game in JavaFX, leveraging mathematical concepts and game logic.",
      "Gained expertise in JavaFX and Scene Builder to create a visually appealing and functional game interface.",
      "Implemented features like game saving and loading to enhance the user experience.",
      "Learned about game development workflows, including handling game states and dynamic updates.",
    ],
  },
];

const testimonials = [
  {
    testimonial:
      "Research and Publications:Co-authored research on Diagnosis of Breast Cancer Tumor Type, using AI to enhance diagnostic accuracy through a fuzzy combination of regression methods.",
    name: "Research and Publications",
    designation: "Developer&researcher",
    company: "SamAi",
    image: image,
  },
  {
    testimonial: "CIMP Diploma",
    name: "Sunway University in sunway city-Malaysia",
    designation: "Student",
    company: "Sunway University",
    image:
      "https://th.bing.com/th/id/R.e914efa552b34eeb7845d9042ec9d4e9?rik=7HX9fTJvjui1MQ&riu=http%3a%2f%2fwww.chooseright.org%2fwp-content%2fuploads%2f2014%2f04%2fSunway-University-logo.jpg&ehk=%2fQjLTJAyL2c5ul0ZQDjlIA6pI0z1GWNH5rhvRfLARzg%3d&risl=&pid=ImgRaw&r=0",
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
];

const projects = [
  {
    name: "SamAi",
    description:
      "Ai web application to predict diabetes for male and female separately, liver disease detection, hurt detection, and breast-cancer for females.",
    tags: [
      { name: "react", color: "blue-text-gradient" },
      { name: "tailwind", color: "blue-text-gradient" },
      { name: "Sqlite", color: "green-text-gradient" },
      { name: "flask", color: "pink-text-gradient" },
    ],
    image: carrent,
    icon: render,
    source_code_link: "https://sam-ai-7lwa.onrender.com",
  },
];

export { services, technologies, experiences, testimonials, projects };
