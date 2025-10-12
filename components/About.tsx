'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Heart, Coffee, Music, Gamepad2 } from 'lucide-react'

const About = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const interests = [
    {
      icon: Heart,
      title: 'Problem Solving',
      description: 'I did a lot of competitive programming / math olympiad during my high school years.'
    },
    {
      icon: Coffee,
      title: 'Learning & Giving',
      description: 'I enjoy learning new things, and I also enjoy teaching others.'
    },
    {
      icon: Music,
      title: 'Creative Expression',
      description: 'Music and sports fuel my creativity and help me think outside the box.'
    },
    {
      icon: Gamepad2,
      title: 'Strategic Thinking',
      description: 'I played a lot of Clash Royale, and I am fairly good at it.'
    }
  ]

  return (
    <section id="about" className="py-20 bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            About <span className="gradient-text">Me</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            I'm pursuing a degree in Mathematics and Computer Science at UC Berkeley. 
            In my free time, I enjoy playing Rubik's Cube, tennis, squash, and playing guitar. 
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Column - Image/Visual */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative z-10">
              <div className="w-full h-96 rounded-2xl shadow-2xl overflow-hidden">
                <img 
                  src="/biking.png" 
                  alt="Biking Yiran" 
                  className="w-full h-full object-cover object-bottom"
                />
              </div>
            </div>
            
            {/* Floating Elements */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -top-4 -right-4 w-24 h-24 bg-primary-500/30 rounded-full blur-xl"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute -bottom-4 -left-4 w-32 h-32 bg-purple-500/30 rounded-full blur-xl"
            />
          </motion.div>

          {/* Right Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-3xl font-bold text-white mb-4">
                A Little About Me
              </h3>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                I love running, biking, and all kinds of racquet sports. I also love to play guitar; I especially enjoy Jay Chou's music. 
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {interests.map((interest, index) => (
                <motion.div
                  key={interest.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  className="glass-effect p-4 rounded-lg"
                >
                  <interest.icon className="text-primary-400 mb-2" size={24} />
                  <h4 className="text-white font-semibold mb-2">{interest.title}</h4>
                  <p className="text-gray-300 text-sm">{interest.description}</p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 1 }}
              className="flex flex-wrap gap-4"
            >
              {['Mathematics', 'Computer Science', 'Rubik\'s Cube', 'Tennis', 'Squash', 'Guitar', 'Running', 'Biking', 'Cooking'].map((interest) => (
                <span
                  key={interest}
                  className="px-4 py-2 bg-primary-600/20 text-primary-300 rounded-full text-sm font-medium border border-primary-500/30"
                >
                  {interest}
                </span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default About
