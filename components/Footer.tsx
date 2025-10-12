'use client'

import { motion } from 'framer-motion'
import { Heart, ArrowUp } from 'lucide-react'

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="bg-black/50 backdrop-blur-md border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Copyright */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-2 text-gray-400 mb-4 md:mb-0"
          >
            <span>© 2025 Yiran Hu. Made with</span>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Heart size={16} className="text-red-500" />
            </motion.div>
            <span>and a little bit of AI.</span>
          </motion.div>

          {/* Back to Top Button */}
          <motion.button
            onClick={scrollToTop}
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.9 }}
            className="flex items-center space-x-2 text-gray-400 hover:text-primary-400 transition-colors duration-300"
          >
            <span>Back to top</span>
            <ArrowUp size={16} />
          </motion.button>
        </div>

        {/* Additional Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 pt-6 border-t border-white/10 text-center"
        >
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
            <a href="#home" className="hover:text-primary-400 transition-colors duration-300">
              Home
            </a>
            <a href="#about" className="hover:text-primary-400 transition-colors duration-300">
              About
            </a>
            <a href="#skills" className="hover:text-primary-400 transition-colors duration-300">
              Skills
            </a>
            <a href="#projects" className="hover:text-primary-400 transition-colors duration-300">
              Projects
            </a>
            <a href="#contact" className="hover:text-primary-400 transition-colors duration-300">
              Contact
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer
