import { useState, useEffect, useRef } from 'react'
import styles from './BackendHandbook.module.css'

function BackendHandbook() {
  const [activeCourse, setActiveCourse] = useState('general')
  const [activeLesson, setActiveLesson] = useState('general-0')
  const [sidebarVisible, setSidebarVisible] = useState(true)
  const [expandedFloatingTab, setExpandedFloatingTab] = useState(null)
  const [expandedSections, setExpandedSections] = useState({
    lessons: true,
    resources: false,
    exercises: false,
    projects: false
  })

  const sidebarRef = useRef(null)
  const floatingTabsRef = useRef(null)

  const courses = {
    general: {
      title: 'General',
      description: 'All available topics and overview',
      lessons: {
        'general-0': {
          title: 'Topic 1 - Header 1',
          category: 'Topics',
          content: (
            <div>
              <h3>Content 1</h3>
              <p>This is placeholder content for Topic 1, Header 1, Content 1. Replace this with your actual content about backend engineering fundamentals.</p>
              
              <h3>Content 2</h3>
              <p>This is placeholder content for Topic 1, Header 1, Content 2. Add your detailed explanations, code examples, or tutorials here.</p>
              
              <div style={{ background: 'rgba(255, 107, 53, 0.1)', padding: '1rem', borderRadius: '8px', marginTop: '1rem' }}>
                <strong>📝 Note:</strong> Replace this entire content section with your actual lesson material.
              </div>
            </div>
          )
        },
        'general-1': {
          title: 'Topic 1 - Header 2',
          category: 'Topics',
          content: (
            <div>
              <h3>Content 1</h3>
              <p>This is placeholder content for Topic 1, Header 2, Content 1. Replace this with your actual content.</p>
              
              <h3>Content 2</h3>
              <p>This is placeholder content for Topic 1, Header 2, Content 2. Add your detailed explanations here.</p>
            </div>
          )
        },
        'general-2': {
          title: 'Topic 2 - Header 1',
          category: 'Topics',
          content: (
            <div>
              <h3>Content 1</h3>
              <p>This is placeholder content for Topic 2, Header 1, Content 1. Replace this with your actual content.</p>
              
              <h3>Content 2</h3>
              <p>This is placeholder content for Topic 2, Header 1, Content 2. Add your detailed explanations here.</p>
            </div>
          )
        },
        'general-3': {
          title: 'Topic 2 - Header 2',
          category: 'Topics',
          content: (
            <div>
              <h3>Content 1</h3>
              <p>This is placeholder content for Topic 2, Header 2, Content 1. Replace this with your actual content.</p>
              
              <h3>Content 2</h3>
              <p>This is placeholder content for Topic 2, Header 2, Content 2. Add your detailed explanations here.</p>
            </div>
          )
        }
      },
      categories: {
        'Topic 1': ['general-0', 'general-1'],
        'Topic 2': ['general-2', 'general-3']
      }
    },

    first6months: {
      title: 'First 6 Months',
      description: 'Survival guide for new backend engineers',
      lessons: {
        'first6-0': {
          title: 'Topic 1 - Header 1',
          category: 'Topics',
          content: (
            <div>
              <h3>Content 1</h3>
              <p>This is placeholder content for First 6 Months, Topic 1, Header 1, Content 1. Replace with your survival guide content.</p>
              
              <h3>Content 2</h3>
              <p>This is placeholder content for First 6 Months, Topic 1, Header 1, Content 2. Add your practical advice here.</p>
            </div>
          )
        },
        'first6-1': {
          title: 'Topic 1 - Header 2',
          category: 'Topics',
          content: (
            <div>
              <h3>Content 1</h3>
              <p>This is placeholder content for First 6 Months, Topic 1, Header 2, Content 1. Replace with your content.</p>
              
              <h3>Content 2</h3>
              <p>This is placeholder content for First 6 Months, Topic 1, Header 2, Content 2. Add your guidance here.</p>
            </div>
          )
        },
        'first6-2': {
          title: 'Topic 2 - Header 1',
          category: 'Topics',
          content: (
            <div>
              <h3>Content 1</h3>
              <p>This is placeholder content for First 6 Months, Topic 2, Header 1, Content 1. Replace with your content.</p>
              
              <h3>Content 2</h3>
              <p>This is placeholder content for First 6 Months, Topic 2, Header 1, Content 2. Add your tips here.</p>
            </div>
          )
        },
        'first6-3': {
          title: 'Topic 2 - Header 2',
          category: 'Topics',
          content: (
            <div>
              <h3>Content 1</h3>
              <p>This is placeholder content for First 6 Months, Topic 2, Header 2, Content 1. Replace with your content.</p>
              
              <h3>Content 2</h3>
              <p>This is placeholder content for First 6 Months, Topic 2, Header 2, Content 2. Add your advice here.</p>
            </div>
          )
        }
      },
      categories: {
        'Topic 1': ['first6-0', 'first6-1'],
        'Topic 2': ['first6-2', 'first6-3']
      }
    },
    
    technologies: {
      title: 'Backend Technologies',
      description: 'Essential tools and frameworks for backend development',
      lessons: {
        'tech-0': {
          title: 'Topic 1 - Header 1',
          category: 'Topics',
          content: (
            <div>
              <h3>Content 1</h3>
              <p>This is placeholder content for Backend Technologies, Topic 1, Header 1, Content 1. Replace with your technology content.</p>
              
              <h3>Content 2</h3>
              <p>This is placeholder content for Backend Technologies, Topic 1, Header 1, Content 2. Add your technical explanations here.</p>
            </div>
          )
        },
        'tech-1': {
          title: 'Topic 1 - Header 2',
          category: 'Topics',
          content: (
            <div>
              <h3>Content 1</h3>
              <p>This is placeholder content for Backend Technologies, Topic 1, Header 2, Content 1. Replace with your content.</p>
              
              <h3>Content 2</h3>
              <p>This is placeholder content for Backend Technologies, Topic 1, Header 2, Content 2. Add your technical details here.</p>
            </div>
          )
        },
        'tech-2': {
          title: 'Topic 2 - Header 1',
          category: 'Topics',
          content: (
            <div>
              <h3>Content 1</h3>
              <p>This is placeholder content for Backend Technologies, Topic 2, Header 1, Content 1. Replace with your content.</p>
              
              <h3>Content 2</h3>
              <p>This is placeholder content for Backend Technologies, Topic 2, Header 1, Content 2. Add your framework details here.</p>
            </div>
          )
        },
        'tech-3': {
          title: 'Topic 2 - Header 2',
          category: 'Topics',
          content: (
            <div>
              <h3>Content 1</h3>
              <p>This is placeholder content for Backend Technologies, Topic 2, Header 2, Content 1. Replace with your content.</p>
              
              <h3>Content 2</h3>
              <p>This is placeholder content for Backend Technologies, Topic 2, Header 2, Content 2. Add your tool explanations here.</p>
            </div>
          )
        }
      },
      categories: {
        'Topic 1': ['tech-0', 'tech-1'],
        'Topic 2': ['tech-2', 'tech-3']
      }
    },

    architectures: {
      title: 'Architectures',
      description: 'Design scalable and maintainable systems',
      lessons: {
        'arch-0': {
          title: 'Topic 1 - Header 1',
          category: 'Topics',
          content: (
            <div>
              <h3>Content 1</h3>
              <p>This is placeholder content for Architectures, Topic 1, Header 1, Content 1. Replace with your architecture content.</p>
              
              <h3>Content 2</h3>
              <p>This is placeholder content for Architectures, Topic 1, Header 1, Content 2. Add your system design explanations here.</p>
            </div>
          )
        },
        'arch-1': {
          title: 'Topic 1 - Header 2',
          category: 'Topics',
          content: (
            <div>
              <h3>Content 1</h3>
              <p>This is placeholder content for Architectures, Topic 1, Header 2, Content 1. Replace with your content.</p>
              
              <h3>Content 2</h3>
              <p>This is placeholder content for Architectures, Topic 1, Header 2, Content 2. Add your design patterns here.</p>
            </div>
          )
        },
        'arch-2': {
          title: 'Topic 2 - Header 1',
          category: 'Topics',
          content: (
            <div>
              <h3>Content 1</h3>
              <p>This is placeholder content for Architectures, Topic 2, Header 1, Content 1. Replace with your content.</p>
              
              <h3>Content 2</h3>
              <p>This is placeholder content for Architectures, Topic 2, Header 1, Content 2. Add your scalability concepts here.</p>
            </div>
          )
        },
        'arch-3': {
          title: 'Topic 2 - Header 2',
          category: 'Topics',
          content: (
            <div>
              <h3>Content 1</h3>
              <p>This is placeholder content for Architectures, Topic 2, Header 2, Content 1. Replace with your content.</p>
              
              <h3>Content 2</h3>
              <p>This is placeholder content for Architectures, Topic 2, Header 2, Content 2. Add your best practices here.</p>
            </div>
          )
        }
      },
      categories: {
        'Topic 1': ['arch-0', 'arch-1'],
        'Topic 2': ['arch-2', 'arch-3']
      }
    },

    golang: {
      title: 'Golang Academy',
      description: 'Master Go programming for backend development',
      lessons: {
        'go-0': {
          title: 'Topic 1 - Header 1',
          category: 'Topics',
          content: (
            <div>
              <h3>Content 1</h3>
              <p>This is placeholder content for Golang Academy, Topic 1, Header 1, Content 1. Replace with your Go programming content.</p>
              
              <h3>Content 2</h3>
              <p>This is placeholder content for Golang Academy, Topic 1, Header 1, Content 2. Add your Go tutorials and examples here.</p>
              
              <pre style={{ background: '#2d3748', color: '#e2e8f0', padding: '1rem', borderRadius: '4px', overflow: 'auto' }}>
{`// Replace this with your actual Go code examples
package main

import "fmt"

func main() {
    fmt.Println("Your Go content goes here!")
}`}
              </pre>
            </div>
          )
        },
        'go-1': {
          title: 'Topic 1 - Header 2',
          category: 'Topics',
          content: (
            <div>
              <h3>Content 1</h3>
              <p>This is placeholder content for Golang Academy, Topic 1, Header 2, Content 1. Replace with your content.</p>
              
              <h3>Content 2</h3>
              <p>This is placeholder content for Golang Academy, Topic 1, Header 2, Content 2. Add your advanced Go concepts here.</p>
            </div>
          )
        },
        'go-2': {
          title: 'Topic 2 - Header 1',
          category: 'Topics',
          content: (
            <div>
              <h3>Content 1</h3>
              <p>This is placeholder content for Golang Academy, Topic 2, Header 1, Content 1. Replace with your content.</p>
              
              <h3>Content 2</h3>
              <p>This is placeholder content for Golang Academy, Topic 2, Header 1, Content 2. Add your Go best practices here.</p>
            </div>
          )
        },
        'go-3': {
          title: 'Topic 2 - Header 2',
          category: 'Topics',
          content: (
            <div>
              <h3>Content 1</h3>
              <p>This is placeholder content for Golang Academy, Topic 2, Header 2, Content 1. Replace with your content.</p>
              
              <h3>Content 2</h3>
              <p>This is placeholder content for Golang Academy, Topic 2, Header 2, Content 2. Add your Go project examples here.</p>
            </div>
          )
        }
      },
      categories: {
        'Topic 1': ['go-0', 'go-1'],
        'Topic 2': ['go-2', 'go-3']
      }
    }
  }

  // Floating tabs data - matches course structure
  const floatingTabs = {
    general: {
      title: 'General',
      icon: '🎯',
      courseId: 'general'
    },
    first6months: {
      title: 'First 6 Months',
      icon: '🚀',
      courseId: 'first6months'
    },
    technologies: {
      title: 'Backend Technologies',
      icon: '🔧',
      courseId: 'technologies'
    },
    architectures: {
      title: 'Architectures',
      icon: '🏗️',
      courseId: 'architectures'
    },
    golang: {
      title: 'Golang Academy',
      icon: '🐹',
      courseId: 'golang'
    }
  }

  // Sidebar sections data
  const sidebarSections = {
    lessons: {
      title: 'Lessons',
      icon: '📚',
      content: () => (
        <div className={styles.lessonsSection}>
          {Object.entries(getCurrentCourse().categories).map(([categoryName, lessonIds]) => (
            <div key={categoryName} className={styles.categoryGroup}>
              <h4 className={styles.categoryTitle}>{categoryName}</h4>
              <ul className={styles.lessonsList}>
                {lessonIds.map(lessonId => (
                  <li key={lessonId}>
                    <button
                      className={`${styles.lessonButton} ${activeLesson === lessonId ? styles.activeLesson : ''}`}
                      onClick={() => setActiveLesson(lessonId)}
                    >
                      {getCurrentCourse().lessons[lessonId].title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )
    },
    resources: {
      title: 'Resources',
      icon: '📖',
      content: () => (
        <div className={styles.resourcesSection}>
          <p>Additional resources and references will be added here.</p>
        </div>
      )
    },
    exercises: {
      title: 'Exercises',
      icon: '💪',
      content: () => (
        <div className={styles.exercisesSection}>
          <p>Practice exercises and coding challenges will be added here.</p>
        </div>
      )
    },
    projects: {
      title: 'Projects',
      icon: '🚧',
      content: () => (
        <div className={styles.projectsSection}>
          <p>Real-world projects and implementations will be added here.</p>
        </div>
      )
    }
  }

  // Helper functions
  const getCurrentCourse = () => courses[activeCourse]
  const getCurrentLesson = () => getCurrentCourse().lessons[activeLesson]

  const handleCourseChange = (courseId) => {
    setActiveCourse(courseId)
    // Set the first lesson of the new course as active
    const firstLessonId = Object.keys(courses[courseId].lessons)[0]
    setActiveLesson(firstLessonId)
  }

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }))
  }

  // Click outside to collapse sidebar and floating tabs
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Don't collapse if clicking on sidebar or floating tabs
      if (sidebarRef.current && sidebarRef.current.contains(event.target)) {
        return
      }
      if (floatingTabsRef.current && floatingTabsRef.current.contains(event.target)) {
        return
      }
      
      // Collapse sidebar if it's visible
      if (sidebarVisible) {
        setSidebarVisible(false)
      }
      
      // Collapse expanded floating tab if any is expanded
      if (expandedFloatingTab) {
        setExpandedFloatingTab(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [sidebarVisible, expandedFloatingTab])

  return (
    <section id="handbook" className={styles.handbook}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            Backend Engineer Survival Handbook
            <span className={styles.subtitle}>For New Grads & Interns</span>
          </h2>
        </div>

            <div className={`${styles.handbookLayout} ${!sidebarVisible ? styles.sidebarHidden : ''}`}>
              {/* Sidebar Navigation - Multiple Collapsible Sections */}
              <nav ref={sidebarRef} className={`${styles.sidebar} ${!sidebarVisible ? styles.hidden : ''}`}>
            <div className={styles.sidebarHeader}>
              <h3 className={styles.sidebarTitle}>Course Content</h3>
              <button 
                className={styles.sidebarToggle}
                onClick={() => setSidebarVisible(false)}
                aria-label="Hide sidebar"
              >
                ←
              </button>
            </div>

            {/* Collapsible Sections */}
            <div className={styles.sidebarContent}>
              {Object.entries(sidebarSections).map(([sectionId, section]) => (
                <div key={sectionId} className={styles.sidebarSection}>
                  <button
                    className={`${styles.sectionHeader} ${expandedSections[sectionId] ? styles.expanded : ''}`}
                    onClick={() => toggleSection(sectionId)}
                  >
                    <span className={styles.sectionIcon}>{section.icon}</span>
                    <span className={styles.sectionTitle}>{section.title}</span>
                    <span className={styles.expandIcon}>
                      {expandedSections[sectionId] ? '▼' : '▶'}
                    </span>
                  </button>

                  {expandedSections[sectionId] && (
                    <div className={styles.sectionContent}>
                      {section.content()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </nav>

              {/* Course Floating Tabs (when sidebar is hidden) */}
              {!sidebarVisible && (
                <div ref={floatingTabsRef} className={styles.floatingTabs}>
              {Object.entries(floatingTabs).map(([tabId, tab], index) => (
                <div key={tabId} className={styles.floatingTabContainer}>
                  <button
                    className={`${styles.floatingTab} ${activeCourse === tab.courseId ? styles.activeFloatingTab : ''} ${expandedFloatingTab === tabId ? styles.expandedFloatingTab : ''}`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                    onClick={() => {
                      if (expandedFloatingTab === tabId) {
                        setExpandedFloatingTab(null)
                      } else {
                        setActiveCourse(tab.courseId)
                        setExpandedFloatingTab(tabId)
                        // Set first lesson as active
                        const firstLessonId = Object.keys(courses[tab.courseId].lessons)[0]
                        setActiveLesson(firstLessonId)
                      }
                    }}
                    aria-label={`Toggle ${tab.title} lessons`}
                  >
                    <span className={styles.floatingIcon}>{tab.icon}</span>
                    <span className={styles.floatingText}>{tab.title}</span>
                    <span className={styles.expandArrow}>
                      {expandedFloatingTab === tabId ? '▼' : '▶'}
                    </span>
                  </button>
                  
                  {/* Expanded Lessons List */}
                  {expandedFloatingTab === tabId && (
                    <div className={styles.floatingLessonsList}>
                      {Object.entries(courses[tab.courseId].categories).map(([categoryName, lessonIds]) => (
                        <div key={categoryName} className={styles.floatingCategory}>
                          <h4 className={styles.floatingCategoryTitle}>{categoryName}</h4>
                          <ul className={styles.floatingLessons}>
                            {lessonIds.map(lessonId => (
                              <li key={lessonId}>
                                <button
                                  className={`${styles.floatingLessonButton} ${activeLesson === lessonId ? styles.activeFloatingLesson : ''}`}
                                  onClick={() => {
                                    setActiveLesson(lessonId)
                                    setActiveCourse(tab.courseId)
                                  }}
                                >
                                  {courses[tab.courseId].lessons[lessonId].title}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
              )}

              {/* Main Content - Blog Style */}
              <main className={styles.mainContent}>
                <article className={styles.blogPost}>
                  <header className={styles.postHeader}>
                    <div className={styles.postMeta}>
                      <span className={styles.categoryBadge}>{getCurrentLesson().category}</span>
                      <span className={styles.readingTime}>5 min read</span>
                    </div>
                    <h1 className={styles.postTitle}>{getCurrentLesson().title}</h1>
                    <div className={styles.postIntro}>
                      <p>Part of the {getCurrentCourse().title} course</p>
                    </div>
                  </header>

                  <div className={styles.postContent}>
                    {getCurrentLesson().content}
                  </div>

                  <footer className={styles.postFooter}>
                    <div className={styles.navigation}>
                      {Object.keys(getCurrentCourse().lessons).indexOf(activeLesson) > 0 && (
                        <button
                          className={styles.navButton}
                          onClick={() => {
                            const currentIndex = Object.keys(getCurrentCourse().lessons).indexOf(activeLesson)
                            setActiveLesson(Object.keys(getCurrentCourse().lessons)[currentIndex - 1])
                          }}
                        >
                          ← Previous Lesson
                        </button>
                      )}
                      {Object.keys(getCurrentCourse().lessons).indexOf(activeLesson) < Object.keys(getCurrentCourse().lessons).length - 1 && (
                        <button
                          className={styles.navButton}
                          onClick={() => {
                            const currentIndex = Object.keys(getCurrentCourse().lessons).indexOf(activeLesson)
                            setActiveLesson(Object.keys(getCurrentCourse().lessons)[currentIndex + 1])
                          }}
                        >
                          Next Lesson →
                        </button>
                      )}
                    </div>
                  </footer>
                </article>
              </main>
            </div>
      </div>
    </section>
  )
}

export default BackendHandbook