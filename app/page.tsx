'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Cpu, GitBranch, GraduationCap, Mail, Rocket, Github, Linkedin, ExternalLink, MapPin, Calendar, Award, Users, Heart, Coffee, Music, Gamepad2 } from 'lucide-react'
import { useState, useRef } from 'react'
import Cursor from '@/components/Cursor'
import MagneticButton from '@/components/MagneticButton'
import Terminal from '@/components/Terminal'
import ScrambleText from '@/components/ScrambleText'

// Physics-based hover animation variants
const hoverFloat = {
  rest: { y: 0, scale: 1, rotate: 0 },
  hover: {
    y: -8,
    scale: 1.02,
    rotate: 0.5,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 17
    }
  }
}

const hoverTilt = {
  rest: { rotateX: 0, rotateY: 0, scale: 1 },
  hover: {
    scale: 1.03,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20
    }
  }
}

const hoverPop = {
  rest: { scale: 1, y: 0 },
  hover: {
    scale: 1.05,
    y: -4,
    transition: {
      type: 'spring',
      stiffness: 500,
      damping: 15
    }
  }
}

interface ProjectCard {
  name: string
  summary: string
  stack: string[]
  status: string
  github?: string
  live?: string
  image?: string
  featured?: boolean
}

interface EducationEntry {
  school: string
  degree: string
  major: string
  location: string
  duration: string
  gpa: string
  status: string
  description: string
  activities: { title: string; role: string; description: string; link?: string }[]
  achievements: string[]
  coursework: string[]
}

export default function Home() {
  const [hoveredProject, setHoveredProject] = useState<string | null>(null)
  const terminalNestRef = useRef<HTMLDivElement>(null)

  const socialLinks = [
    { icon: Github, href: 'https://github.com/YiranHu361', label: 'GitHub' },
    { icon: Linkedin, href: 'https://www.linkedin.com/in/yiranhu0917/', label: 'LinkedIn' },
    { icon: Mail, href: 'mailto:yiranhu@berkeley.edu', label: 'Email' },
  ]

  const interests = [
    { icon: Heart, title: 'Problem Solving', description: 'Competitive programming / math olympiad during high school.' },
    { icon: Coffee, title: 'Learning & Giving', description: 'I enjoy learning new things, and teaching others.' },
    { icon: Music, title: 'Creative Expression', description: 'Music and sports fuel my creativity.' },
    { icon: Gamepad2, title: 'Strategic Thinking', description: 'Played a lot of Clash Royale, fairly good at it.' },
  ]

  const hobbies = ['Mathematics', 'Computer Science', "Rubik's Cube", 'Tennis', 'Squash', 'Guitar', 'Running', 'Biking', 'Cooking']

  const projects: ProjectCard[] = [
    {
      name: 'Mind Journal',
      summary: 'AI-powered reflective companion that turns thoughts into insights through conversation and cognitive graph visualization.',
      stack: ['Next.js 15', 'React 19', 'TypeScript', 'OpenAI API', 'D3.js', 'Prisma'],
      status: 'Live',
      live: 'https://mindjournal.org',
      image: '/mindjournal.png',
      featured: true,
    },
    {
      name: 'MRI Scan Detection',
      summary: 'Automated MRI scan analysis system using machine learning models to assist medical diagnosis and streamline radiology workflows.',
      stack: ['Python', 'TensorFlow', 'Computer Vision', 'Medical Imaging', 'CNN'],
      status: 'In Progress',
      featured: true,
    },
    {
      name: "Mathematics behind Rubik's Cube",
      summary: "Mathematical Foundations and Group Theory Applications in the CFOP Method for Solving Rubik's Cube.",
      stack: ['Group Theory', 'Conjugation', 'Commutators', 'Abstract Algebra'],
      status: 'Published',
      live: 'https://www.questioz.org/post/mathematical-foundations-and-group-theory-applications-in-the-cfop-method-for-solving-rubik-s-cube',
      image: '/Rubiks Cube.png',
      featured: true,
    },
    {
      name: "Modified Kruskal's Algorithm",
      summary: "Research paper on algorithmic optimization combining Kruskal's algorithm with Steiner tree construction.",
      stack: ['Graph Theory', 'Linear Programming', 'Optimization', 'Steiner Trees'],
      status: 'Published',
      github: 'https://github.com/YiranHu361/steiner_region_construction',
      live: '/MK_with_EST.pdf',
      image: '/MKpaper.png',
      featured: true,
    },
    {
      name: 'Wordle Solver',
      summary: 'A Java-based Wordle solver with intelligent heuristics and strategic word selection algorithms.',
      stack: ['Java', 'Data Structures', 'Heuristics', 'Algorithm Design'],
      status: 'Live',
      github: 'https://github.com/YiranHu361/wordle_solver',
      live: '/wordle-solver',
      image: '/wordle.png',
      featured: false,
    },
    {
      name: "Rubik's Cube Solver",
      summary: "A recursive solver for 2x2x2 Rubik's Cube, implemented in C++.",
      stack: ['Complete Search', 'Permutation', 'Recursion'],
      status: 'Complete',
      github: 'https://github.com/YiranHu361/Rubik-s-Cube-Solver/',
      image: '/rubikscube2.png',
      featured: false,
    },
  ]

  const skills = [
    'Java', 'C++', 'Python', 'TypeScript', 'React', 'Next.js',
    'OpenAI API', 'Groq API', 'D3.js', 'Prisma', 'PostgreSQL',
    'Group Theory', 'Abstract Algebra', 'Linear Programming', 'Optimization',
    'Data Structures', 'Algorithms', 'Problem Solving', 'Creative Thinking', 'Teamwork', 'Communication'
  ]

  const education: EducationEntry[] = [
    {
      school: "University of California, Berkeley",
      degree: "Bachelor of Arts",
      major: "Mathematics & Computer Science",
      location: "Berkeley, CA",
      duration: "2025 - Present",
      gpa: "3.95/4.0",
      status: "Current Student",
      description: "Pursuing a double major in Mathematics and Computer Science with focus on theoretical foundations and practical applications.",
      activities: [
        { title: "CSM Mentoring Program", role: "Senior Mentor", description: "Lead 2 weekly mentoring sessions for 12 students and provide video walkthroughs for exams for students in lower division CS courses." },
        { title: "Social Science Research", role: "Student Researcher", description: "Working with Professor Trinidad, analyzing the behavior of students' AI use in STEM classes." },
      ],
      achievements: [],
      coursework: ["Math 104: Introduction to Real Analysis", "Compsci 188: Artificial Intelligence", "Math H53: Honors Multivariable Calculus", "Math 54: Linear Algebra & Differential Equations", "CS 70: Discrete Mathematics & Probability Theory", "CS 61B: Data Structures", "CS 61A: Structure & Interpretation of Computer Programs", "Data 8: Foundations of Data Science" ]
    },
    {
      school: "St. Mark's School",
      degree: "High School Diploma",
      major: "College Preparatory",
      location: "Southborough, MA",
      duration: "2021 - 2025",
      gpa: "4.07/4.0",
      status: "Graduated",
      description: "Graduated with highest honors. Honored to be part of the Cum Laude Society.",
      activities: [
        { title: "Math Team", role: "Member", description: "Competed in regional and state competitions, won the 34th WPI Invitational Math Meet.", link: "https://www.wpi.edu/news/announcements/wpi-hosts-34th-annual-invitational-mathematics-meet" },
        { title: "Rubik's Cube Club", role: "Founder & President", description: "Taught ~10 students to solve Rubik's Cube." },
        { title: "Tennis Team", role: "Captain", description: "Competed on varsity, played 3rd singles and 1st doubles." },
        { title: "Squash Team", role: "Player", description: "Won 2024 New England Squash League High School Boys Team Division III Championship." },
      ],
      achievements: ["Cum Laude Society", "The John Suydam Mathematics Prize", "USAJMO Qualifier; AIME score 12", "USACO Platinum Division"],
      coursework: ["Advanced Calculus BC", "Advanced Topics in CS: Data Structures & Algorithms", "Advanced Statistics", "Advanced Physics C: Mechanics", "Advanced Physics C: E&M", "Advanced Topics in Math: Probability", "Advanced Topics in Math: Heuristics", "Advanced Topics in Math: Multivariable Calculus", "Advanced Topics in Math: Differential Equations"]
    }
  ]

  const featuredProjects = projects.filter(p => p.featured)
  const otherProjects = projects.filter(p => !p.featured)

  return (
    <main className="relative min-h-screen bg-[#f8f9fa] text-[#212529]">
      <Cursor />
      <div className="absolute inset-0 tech-grid" aria-hidden="true" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 120, damping: 18 }}
        className="relative mx-auto max-w-6xl px-6 pb-24 pt-24"
      >
        {/* Status Bar */}
        <div className="mb-12 flex flex-wrap items-center justify-between gap-4 text-[10px] uppercase tracking-[0.5em]">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-[#4cc9f0]" />
            <span>System Online</span>
          </div>
          <span className="text-[#7209b7]">Berkeley, CA</span>
        </div>

        {/* Hero Section */}
        <header className="grid grid-cols-12 items-start gap-6">
          {/* Left column: Info + Terminal Nest */}
          <div className="col-span-12 lg:col-span-7 space-y-6">
            {/* Terminal Nest - Docked position */}
            <div ref={terminalNestRef} className="w-full">
              <Terminal ownerName="Yiran Hu" nestRef={terminalNestRef} />
            </div>

            {/* Name and Info */}
            <div>
              <p className="text-[11px] uppercase tracking-[0.6em] text-[#7209b7]">UC Berkeley // Math & CS</p>
              <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Yiran Hu
                <span className="block text-xl font-normal uppercase tracking-[0.4em]">Mathematician & Developer</span>
              </h1>
              <p className="mt-6 max-w-xl text-sm leading-relaxed">
                Student at UC Berkeley pursuing Mathematics and Computer Science.
                Rubik's Cube enthusiast, tennis player, and problem solver with a passion for algorithms and mathematical research.
              </p>
              <ScrambleText />
              <div className="mt-8 flex flex-wrap gap-4">
                <MagneticButton onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}>View Projects</MagneticButton>
                <a href="/Yiran_cv-2.pdf" target="_blank" rel="noopener noreferrer">
                  <MagneticButton variant="dark">
                    Download CV
                  </MagneticButton>
                </a>
              </div>
              <div className="mt-6 flex gap-4">
                {socialLinks.map(({ icon: Icon, href, label }) => (
                  <motion.a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#212529] hover:text-[#7209b7] transition-colors"
                    aria-label={label}
                    whileHover={{ scale: 1.2, y: -3 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Icon size={20} />
                  </motion.a>
                ))}
              </div>
            </div>
          </div>

          {/* Right column: Portrait */}
          <div className="col-span-12 lg:col-span-5">
            <motion.div
              className="border border-[#111] bg-[#f8f9fa] p-4 hard-shadow"
              initial="rest"
              whileHover="hover"
              variants={hoverTilt}
            >
              <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.3em]">
                <span>Portrait Scan</span>
                <span className="text-[#4cc9f0]">Active</span>
              </div>
              <div className="mt-4 border border-[#111] p-3">
                <Image
                  src="/portrait.png"
                  alt="Portrait of Yiran Hu"
                  width={420}
                  height={520}
                  className="h-auto w-full border border-[#111] object-cover"
                  priority
                />
              </div>
            </motion.div>
          </div>
        </header>

        {/* About Section */}
        <section id="about" className="mt-20">
          <div className="mb-8 flex items-center gap-3 text-[10px] uppercase tracking-[0.5em]">
            <Cpu size={16} />
            <span>About Me</span>
          </div>

          <div className="grid grid-cols-12 gap-6">
            {/* Photo */}
            <motion.div
              className="col-span-12 md:col-span-5 border border-[#111] bg-[#f8f9fa] p-4 hard-shadow"
              initial="rest"
              whileHover="hover"
              variants={hoverFloat}
            >
              <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.3em] mb-4">
                <span>Life Capture</span>
                <span className="text-[#4cc9f0]">Biking</span>
              </div>
              <div className="border border-[#111] overflow-hidden">
                <Image
                  src="/biking.png"
                  alt="Yiran biking"
                  width={500}
                  height={400}
                  className="w-full h-80 object-cover object-bottom"
                />
              </div>
            </motion.div>

            {/* Bio */}
            <div className="col-span-12 md:col-span-7 space-y-6">
              <motion.div
                className="border border-[#111] bg-[#f8f9fa] p-6 hard-shadow"
                initial="rest"
                whileHover="hover"
                variants={hoverFloat}
              >
                <p className="text-sm leading-relaxed mb-4">
                  I'm pursuing a degree in Mathematics and Computer Science at UC Berkeley.
                  In my free time, I enjoy playing Rubik's Cube, tennis, squash, and playing guitar.
                </p>
                <p className="text-sm leading-relaxed">
                  I love running, biking, and all kinds of racquet sports. I also love to play guitar; I especially enjoy Jay Chou's music.
                </p>
              </motion.div>

              {/* Interests Grid */}
              <div className="grid grid-cols-2 gap-4">
                {interests.map((interest) => (
                  <motion.div
                    key={interest.title}
                    className="border border-[#111] bg-[#f8f9fa] p-4 hard-shadow"
                    initial="rest"
                    whileHover="hover"
                    variants={hoverPop}
                  >
                    <interest.icon size={20} className="text-[#7209b7] mb-2" />
                    <h4 className="text-[11px] uppercase tracking-[0.3em] font-bold mb-1">{interest.title}</h4>
                    <p className="text-[10px] leading-relaxed">{interest.description}</p>
                  </motion.div>
                ))}
              </div>

              {/* Hobbies Tags */}
              <div className="flex flex-wrap gap-2">
                {hobbies.map((hobby) => (
                  <motion.span
                    key={hobby}
                    className="px-3 py-1 border border-[#111] text-[10px] uppercase tracking-[0.2em] bg-[#f8f9fa]"
                    whileHover={{ scale: 1.1, backgroundColor: '#7209b7', color: '#f8f9fa' }}
                    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                  >
                    {hobby}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="mt-20">
          <div className="mb-8 flex items-center gap-3 text-[10px] uppercase tracking-[0.5em]">
            <GitBranch size={16} />
            <span>Featured Projects</span>
          </div>

          {/* Featured Projects */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {featuredProjects.map((project) => (
              <motion.div
                key={project.name}
                className="border border-[#111] bg-[#f8f9fa] hard-shadow overflow-hidden"
                initial="rest"
                whileHover="hover"
                variants={hoverFloat}
                onHoverStart={() => setHoveredProject(project.name)}
                onHoverEnd={() => setHoveredProject(null)}
              >
                {project.image && (
                  <div className="border-b border-[#111] overflow-hidden">
                    <motion.div
                      animate={{ scale: hoveredProject === project.name ? 1.05 : 1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                      <Image
                        src={project.image}
                        alt={project.name}
                        width={600}
                        height={300}
                        className="w-full h-48 object-cover"
                      />
                    </motion.div>
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.3em] mb-3">
                    <span className="font-bold">{project.name}</span>
                    <span className="text-[#4cc9f0]">{project.status}</span>
                  </div>
                  <p className="text-sm mb-4">{project.summary}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.stack.map((tech) => (
                      <span key={tech} className="px-2 py-1 border border-[#7209b7] text-[9px] uppercase tracking-[0.2em] text-[#7209b7]">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-4">
                    {project.github && (
                      <motion.a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] hover:text-[#7209b7]"
                        whileHover={{ x: 3 }}
                      >
                        <Github size={14} /> Code
                      </motion.a>
                    )}
                    {project.live && (
                      <motion.a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] hover:text-[#4cc9f0]"
                        whileHover={{ x: 3 }}
                      >
                        <ExternalLink size={14} /> View
                      </motion.a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Other Projects */}
          <div className="mb-4 text-[10px] uppercase tracking-[0.3em]">Other Projects</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {otherProjects.map((project) => (
              <motion.div
                key={project.name}
                className="border border-[#111] bg-[#f8f9fa] hard-shadow overflow-hidden"
                initial="rest"
                whileHover="hover"
                variants={hoverPop}
              >
                {project.image && (
                  <div className="border-b border-[#111]">
                    <Image
                      src={project.image}
                      alt={project.name}
                      width={400}
                      height={200}
                      className="w-full h-36 object-cover"
                    />
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.3em] mb-2">
                    <span className="font-bold">{project.name}</span>
                    <span className="text-[#4cc9f0]">{project.status}</span>
                  </div>
                  <p className="text-[11px] mb-3">{project.summary}</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {project.stack.slice(0, 3).map((tech) => (
                      <span key={tech} className="px-2 py-0.5 border border-[#7209b7] text-[8px] uppercase text-[#7209b7]">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    {project.github && (
                      <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-[#212529] hover:text-[#7209b7]">
                        <Github size={14} />
                      </a>
                    )}
                    {project.live && (
                      <a href={project.live} target="_blank" rel="noopener noreferrer" className="text-[#212529] hover:text-[#4cc9f0]">
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* View All on GitHub */}
          <div className="mt-8 text-center">
            <a href="https://github.com/YiranHu361" target="_blank" rel="noopener noreferrer">
              <MagneticButton variant="dark">
                <Github size={16} className="mr-2 inline" />
                View All on GitHub
              </MagneticButton>
            </a>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="mt-20">
          <div className="mb-8 flex items-center gap-3 text-[10px] uppercase tracking-[0.5em]">
            <Rocket size={16} />
            <span>Technologies & Skills</span>
          </div>

          <motion.div
            className="border border-[#111] bg-[#f8f9fa] p-6 hard-shadow"
            initial="rest"
            whileHover="hover"
            variants={hoverTilt}
          >
            <div className="flex flex-wrap gap-3">
              {skills.map((skill, index) => (
                <motion.span
                  key={skill}
                  className="px-4 py-2 border border-[#111] text-[11px] uppercase tracking-[0.2em]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{
                    scale: 1.1,
                    backgroundColor: '#7209b7',
                    color: '#f8f9fa',
                    borderColor: '#7209b7',
                    transition: { type: 'spring', stiffness: 400, damping: 17 }
                  }}
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Education Section */}
        <section id="education" className="mt-20">
          <div className="mb-8 flex items-center gap-3 text-[10px] uppercase tracking-[0.5em]">
            <GraduationCap size={16} />
            <span>Education</span>
          </div>

          <div className="space-y-8">
            {education.map((edu) => (
              <motion.div
                key={edu.school}
                className="border border-[#111] bg-[#f8f9fa] p-6 hard-shadow"
                initial="rest"
                whileHover="hover"
                variants={hoverFloat}
              >
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                  <div className="flex items-center gap-4 mb-4 lg:mb-0">
                    <div className="w-12 h-12 border border-[#111] flex items-center justify-center">
                      <GraduationCap size={24} className="text-[#7209b7]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{edu.school}</h3>
                      <p className="text-[11px] uppercase tracking-[0.3em] text-[#7209b7]">{edu.degree} in {edu.major}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 text-[10px] uppercase tracking-[0.3em]">
                    <div className="flex items-center gap-2">
                      <MapPin size={12} />
                      <span>{edu.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={12} />
                      <span>{edu.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award size={12} />
                      <span>GPA: {edu.gpa}</span>
                    </div>
                  </div>
                </div>

                <p className="text-sm mb-4">{edu.description}</p>

                {/* Status */}
                <div className="mb-6">
                  <span className={`inline-flex items-center px-3 py-1 border text-[10px] uppercase tracking-[0.3em] ${
                    edu.status === 'Current Student'
                      ? 'border-[#4cc9f0] text-[#4cc9f0]'
                      : 'border-[#7209b7] text-[#7209b7]'
                  }`}>
                    {edu.status === 'Current Student' && (
                      <span className="w-2 h-2 bg-[#4cc9f0] rounded-full mr-2 animate-pulse" />
                    )}
                    {edu.status}
                  </span>
                </div>

                {/* Activities */}
                {edu.activities.length > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] mb-4">
                      <Users size={14} />
                      <span>Activities & Involvement</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {edu.activities.map((activity) => (
                        <motion.div
                          key={activity.title}
                          className="border border-[#111] p-3"
                          whileHover={{ x: 4, borderColor: '#7209b7' }}
                        >
                          <div className="flex items-center gap-2">
                            <h5 className="text-[11px] uppercase tracking-[0.2em] font-bold">{activity.title}</h5>
                            {activity.link && (
                              <a href={activity.link} target="_blank" rel="noopener noreferrer" className="text-[#4cc9f0] hover:text-[#7209b7]">
                                <ExternalLink size={12} />
                              </a>
                            )}
                          </div>
                          <p className="text-[10px] text-[#7209b7] uppercase tracking-[0.2em]">{activity.role}</p>
                          <p className="text-[10px] mt-1">{activity.description}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Achievements */}
                {edu.achievements.length > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] mb-4">
                      <Award size={14} />
                      <span>Achievements & Honors</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {edu.achievements.map((achievement) => (
                        <motion.div
                          key={achievement}
                          className="flex items-center gap-2 border border-[#111] px-3 py-2"
                          whileHover={{ x: 4, backgroundColor: '#7209b7', color: '#f8f9fa' }}
                        >
                          <span className="w-1.5 h-1.5 bg-[#4cc9f0] rounded-full flex-shrink-0" />
                          <span className="text-[10px]">{achievement}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Coursework */}
                <div>
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] mb-4">
                    <GraduationCap size={14} />
                    <span>Relevant Coursework</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {edu.coursework.map((course) => (
                      <motion.span
                        key={course}
                        className="px-2 py-1 border border-[#7209b7] text-[9px] uppercase tracking-[0.1em] text-[#7209b7]"
                        whileHover={{ scale: 1.05, backgroundColor: '#7209b7', color: '#f8f9fa' }}
                      >
                        {course}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="mt-20">
          <div className="mb-8 flex items-center gap-3 text-[10px] uppercase tracking-[0.5em]">
            <Mail size={16} />
            <span>Get In Touch</span>
          </div>

          <motion.div
            className="border border-[#111] bg-[#f8f9fa] p-8 hard-shadow"
            initial="rest"
            whileHover="hover"
            variants={hoverTilt}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Contact Info */}
              <div>
                <h3 className="text-xl font-bold mb-4">Let's Connect</h3>
                <p className="text-sm mb-6 leading-relaxed">
                  I'm always interested in new opportunities and exciting projects.
                  Whether you have a question or just want to say hi, feel free to reach out!
                </p>

                <div className="space-y-4">
                  <motion.a
                    href="mailto:yiranhu@berkeley.edu"
                    className="flex items-center gap-4 border border-[#111] p-3"
                    whileHover={{ x: 6, borderColor: '#7209b7' }}
                  >
                    <div className="w-10 h-10 border border-[#111] flex items-center justify-center">
                      <Mail size={18} className="text-[#7209b7]" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.3em]">Email</p>
                      <p className="text-sm font-bold">yiranhu@berkeley.edu</p>
                    </div>
                  </motion.a>

                  <motion.div
                    className="flex items-center gap-4 border border-[#111] p-3"
                    whileHover={{ x: 6, borderColor: '#7209b7' }}
                  >
                    <div className="w-10 h-10 border border-[#111] flex items-center justify-center">
                      <MapPin size={18} className="text-[#7209b7]" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.3em]">Location</p>
                      <p className="text-sm font-bold">San Francisco, CA</p>
                    </div>
                  </motion.div>
                </div>

                {/* Social Links */}
                <div className="mt-6">
                  <p className="text-[10px] uppercase tracking-[0.3em] mb-3">Follow Me</p>
                  <div className="flex gap-3">
                    {socialLinks.map(({ icon: Icon, href, label }) => (
                      <motion.a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 border border-[#111] flex items-center justify-center hover:border-[#7209b7] hover:text-[#7209b7]"
                        whileHover={{ scale: 1.1, y: -3 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Icon size={18} />
                      </motion.a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Message */}
              <div className="flex flex-col justify-center items-center border border-[#111] p-8">
                <p className="text-center text-sm mb-6">
                  Have a project in mind or want to collaborate? I'd love to hear from you.
                </p>
                <a href="mailto:yiranhu@berkeley.edu">
                  <MagneticButton variant="dark">
                    Send Message
                  </MagneticButton>
                </a>
              </div>
            </div>
          </motion.div>
        </section>
      </motion.div>
    </main>
  )
}
