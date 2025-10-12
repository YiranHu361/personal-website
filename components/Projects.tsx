'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { ExternalLink, Github, ArrowRight } from 'lucide-react'

const Projects = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const projects = [
      {
        title: "Mathematics behind Rubik's Cube",
        description: "Mathematical Foundations and Group Theory Applications in the CFOP Method for Solving Rubik's Cube.",
        image: '/Rubiks Cube.png',
        technologies: ['Group Theory', 'Conjugation', 'Commutators', 'Abstract Algebra'],
        live: 'https://www.questioz.org/post/mathematical-foundations-and-group-theory-applications-in-the-cfop-method-for-solving-rubik-s-cube',
        featured: true
      },
      {
        title: "Modified Kruskal's Algorithm with Steiner Tree Construction",
        description: "Research paper on algorithmic optimization combining Kruskal's algorithm with Steiner tree construction for efficient network design.",
        image: '/MKpaper.png',
        technologies: ['Graph Theory', 'Linear Programming', 'Optimization', 'Steiner Trees'],
        github: 'https://github.com/YiranHu361/steiner_region_construction',
        live: '/MK_with_EST.pdf',
        featured: true
      },
      {
        title: 'Wordle Solver',
        description: 'A Java-based Wordle solver with intelligent heuristics and data structures. Built during high school freshman year, featuring strategic word selection algorithms.',
        image: '/wordle.png',
        technologies: ['Java', 'Data Structures', 'Heuristics', 'Algorithm Design'],
        github: 'https://github.com/YiranHu361/wordle_solver',
        live: '/wordle-solver',
        featured: false
      },
    {
      title: 'Rubik\'s Cube Solver',
      description: 'A recursive solver for 2x2x2 Rubik\'s Cube, implemented in c++.',
      image: '/rubikscube2.png',
      technologies: ['Complete Search', 'Permutation', 'Recursion'],
      github: "https://github.com/YiranHu361/Rubik-s-Cube-Solver/",
      featured: false
    },
  ]

  const featuredProjects = projects.filter(project => project.featured)
  const otherProjects = projects.filter(project => !project.featured)

  return (
    <section id="projects" className="py-20 bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            A showcase of my work, highlighting my interests.
          </p>
        </motion.div>

        {/* Featured Projects */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {featuredProjects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="glass-effect rounded-xl overflow-hidden card-hover"
            >
              <div className="relative">
                <div className="w-full h-64 overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="absolute top-4 right-4 flex space-x-2">
                  <motion.a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                  >
                    <Github size={16} />
                  </motion.a>
                  <motion.a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                  >
                    <ExternalLink size={16} />
                  </motion.a>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-2xl font-bold text-white mb-3">{project.title}</h3>
                <p className="text-gray-300 mb-4">{project.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-primary-600/20 text-primary-300 rounded-full text-sm font-medium border border-primary-500/30"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                
                <div className="flex space-x-4">
                  <motion.a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center text-primary-400 hover:text-primary-300 transition-colors"
                  >
                    <Github size={16} className="mr-2" />
                    Code
                  </motion.a>
                  <motion.a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center text-primary-400 hover:text-primary-300 transition-colors"
                  >
                    <ExternalLink size={16} className="mr-2" />
                    Live Demo
                  </motion.a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Other Projects */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <h3 className="text-3xl font-bold text-white mb-8 text-center">Other Projects</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherProjects.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                className="glass-effect rounded-lg overflow-hidden card-hover"
              >
                <div className="w-full h-48 overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="p-4">
                  <h4 className="text-lg font-semibold text-white mb-2">{project.title}</h4>
                  <p className="text-gray-300 text-sm mb-3">{project.description}</p>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 bg-primary-600/20 text-primary-300 rounded text-xs font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="px-2 py-1 bg-gray-600/20 text-gray-300 rounded text-xs font-medium">
                        +{project.technologies.length - 3}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-3">
                      <motion.a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.1 }}
                        className="text-gray-400 hover:text-primary-400 transition-colors"
                      >
                        <Github size={16} />
                      </motion.a>
                      <motion.a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.1 }}
                        className="text-gray-400 hover:text-primary-400 transition-colors"
                      >
                        <ExternalLink size={16} />
                      </motion.a>
                    </div>
                    <motion.div
                      whileHover={{ x: 5 }}
                      className="text-primary-400 text-sm font-medium flex items-center"
                    >
                      View <ArrowRight size={14} className="ml-1" />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Keywords/Tech Stack */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-16 text-center"
        >
          <h3 className="text-2xl font-bold text-white mb-8">Technologies & Skills</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              'Java', 'C++', 'Python', 'Scheme', 'Group Theory',
              'Abstract Algebra', 'Linear Programming', 'Optimization', 'Steiner Trees',
                'Data Structures','Algorithms', 'Problem Solving', 'Creative Thinking', 'Teamwork', 'Communication'
            ].map((tech, index) => (
              <motion.span
                key={tech}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3, delay: 1.2 + index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                className="px-4 py-2 bg-primary-600/20 text-primary-300 rounded-full text-sm font-medium border border-primary-500/30 hover:bg-primary-600/30 transition-colors duration-300"
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="text-center mt-16"
        >
          <motion.a
            href="https://github.com/YiranHu361"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center btn-primary"
          >
            <Github size={20} className="mr-2" />
            View All Projects on GitHub
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}

export default Projects
