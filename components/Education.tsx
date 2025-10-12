'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { GraduationCap, Award, Users, Calendar, MapPin, ExternalLink } from 'lucide-react'

const Education = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const educationData = [
    {
      school: "University of California, Berkeley",
      degree: "Bachelor of Arts",
      major: "Mathematics & Computer Science",
      location: "Berkeley, CA",
      duration: "2025 - Present",
      gpa: "4.0/4.0",
      status: "Current Student",
      description: "Pursuing a double major in Mathematics and Computer Science with focus on theoretical foundations and practical applications.",
      activities: [
        {
          title: "CSM Mentoring Program",
          role: "Junior Member",
          description: "Lead weekly mentoring sessions and provide video walkthroughs for exams for students in lower division CS courses.",
          icon: Award
        },
        {
          title: "Social Science Research - Department of Education",
          role: "Student Researcher",
          description: "Working with Professor Trinidad, analyzing the behavior of students' AI use in STEM classes.",
          icon: Users
        },
      ],
      achievements: [
      ],
      coursework: [
        "Math H53: Honors Multivariable Calculus",
        "Math 54:Linear Algebra & Differential Equations",
        "CS 70: Discrete Mathematics & Probability Theory",
        "CS 61B: Data Structures",
        "CS 61A: Structure & Interpretation of Computer Programs",
      ]
    },
    {
      school: "St. Mark's School",
      degree: "High School Diploma",
      major: "College Preparatory",
      location: "Southborough, MA",
      duration: "2021 - 2025",
      gpa: "4.07/4.0",
      status: "Graduated",
      description: "Graduated with highest honors. Honored to be part of the Cum Laude Society; recipient of the National Merit Scholarship.",
      activities: [
          {
            title: "Math Team",
            role: "Member",
            description: "Participated in the school's competitive math team, competing in regional and state competitions, won the 34th WPI Invitational Math Meet.",
            link: "https://www.wpi.edu/news/announcements/wpi-hosts-34th-annual-invitational-mathematics-meet"
          },
        {
          title: "Rubik's Cube Club",
          role: "Founder & President",
          description: "Taught ~10 students to solve Rubik's Cube; played a lot of Rubik's Cube.",
          icon: Users
        },
        {
          title: "Tennis Team",
          role: "Captain",
          description: "Competed on the varsity tennis team, played 3rd singles and 1st doubles. ",
          icon: Award
        },
        {
          title: "Squash Team",
          role: "Player",
          description: "Competed on the varsity squash team, won 2024 New England Squash League High School Boys Team Division III Championship.",
          icon: Users
        }
      ],
      achievements: [
        "Cum Laude Society",
        "The John Suydam Mathematics Prize",
        "USAJMO Qualifier; AIME score 9",
        "USACO Platinum Division"
      ],
      coursework: [
        "Advanced Calculus BC",
        "Advanced Topics in Computer Science: Data Structures & Algorithms",
        "Advanced Statistics",
        "Advanced Physics C: Mechanics",
        "Advanced Physics C: Electricity and Magnetism",
        "Advanced Topics in Mathematics: Probability",
        "Advanced Topics in Mathematics: Heuristics",
        "Advanced Topics in Mathematics: Multivariable Calculus",
        "Advanced Topics in Mathematics: Differential Equations",
        "Advanced World History",
        "Advanced US History"
      ]
    }
  ]

  return (
    <section id="education" className="py-20 bg-gradient-to-b from-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            My <span className="gradient-text">Education</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            My academic journey at UC Berkeley, where I'm pursuing my passion for mathematics and computer science.
          </p>
        </motion.div>

        <div className="space-y-12">
          {educationData.map((education, index) => (
            <motion.div
              key={education.school}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="glass-effect rounded-xl p-8"
            >
              {/* School Header */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
                <div className="flex items-center space-x-4 mb-4 lg:mb-0">
                  <div className="w-16 h-16 bg-primary-600/20 rounded-lg flex items-center justify-center">
                    <GraduationCap className="text-primary-400" size={32} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">{education.school}</h3>
                    <p className="text-primary-300 font-medium">{education.degree} in {education.major}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-gray-300">
                  <div className="flex items-center space-x-2">
                    <MapPin size={16} />
                    <span>{education.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar size={16} />
                    <span>{education.duration}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Award size={16} />
                    <span>GPA: {education.gpa}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-300 mb-8 leading-relaxed">{education.description}</p>

              {/* Status Badge */}
              <div className="mb-8">
                <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${
                  education.status === 'Current Student' 
                    ? 'bg-green-500/20 text-green-300 border-green-500/30'
                    : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                }`}>
                  {education.status === 'Current Student' && (
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                  )}
                  {education.status}
                </span>
              </div>

              {/* Activities */}
              <div className="mb-8">
                <h4 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <Users size={20} className="mr-2 text-primary-400" />
                  Activities & Involvement
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {education.activities.map((activity, activityIndex) => (
                    <motion.div
                      key={activity.title}
                      initial={{ opacity: 0, x: -20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                      transition={{ duration: 0.5, delay: 0.8 + activityIndex * 0.1 }}
                      className="bg-white/5 rounded-lg p-4 border border-white/10"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-primary-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          {activity.icon ? (
                            <activity.icon className="text-primary-400" size={16} />
                          ) : (
                            <Award className="text-primary-400" size={16} />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h5 className="font-semibold text-white">{activity.title}</h5>
                            {activity.link && (
                              <a
                                href={activity.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary-400 hover:text-primary-300 transition-colors"
                                title="View announcement"
                              >
                                <ExternalLink size={14} />
                              </a>
                            )}
                          </div>
                          <p className="text-sm text-primary-300 mb-1">{activity.role}</p>
                          <p className="text-sm text-gray-400">{activity.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Achievements */}
              <div className="mb-8">
                <h4 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <Award size={20} className="mr-2 text-primary-400" />
                  Achievements & Honors
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {education.achievements.map((achievement, achievementIndex) => (
                    <motion.div
                      key={achievement}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3, delay: 1.2 + achievementIndex * 0.05 }}
                      className="flex items-center space-x-3 bg-white/5 rounded-lg p-3 border border-white/10"
                    >
                      <div className="w-2 h-2 bg-primary-400 rounded-full flex-shrink-0"></div>
                      <span className="text-gray-300 text-sm">{achievement}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Coursework */}
              <div>
                <h4 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <GraduationCap size={20} className="mr-2 text-primary-400" />
                  Relevant Coursework
                </h4>
                <div className="flex flex-wrap gap-2">
                  {education.coursework.map((course, courseIndex) => (
                    <motion.span
                      key={course}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.3, delay: 1.4 + courseIndex * 0.05 }}
                      className="px-3 py-1 bg-primary-600/20 text-primary-300 rounded-full text-sm font-medium border border-primary-500/30"
                    >
                      {course}
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Education
