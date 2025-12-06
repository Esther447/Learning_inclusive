/**
 * Course Store
 * Manages courses, enrollment, and progress
 */

import { create } from 'zustand';
import type { Course, LearnerProgress } from '../types';
import { CourseCategory } from '../types';

interface CourseState {
  courses: Course[];
  enrolledCourses: string[];
  progress: Record<string, LearnerProgress>;
  isLoading: boolean;
  error: string | null;
  fetchCourses: () => Promise<void>;
  enrollInCourse: (courseId: string) => Promise<void>;
  updateProgress: (courseId: string, moduleId: string, percentage: number) => void;
  getCourseById: (courseId: string) => Course | undefined;
  getEnrolledCourses: () => Course[];
}

// Mock courses data with comprehensive content
const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Introduction to Web Development',
    description: 'Master web development fundamentals with HTML, CSS, and JavaScript. Build real projects while learning accessibility best practices.',
    category: CourseCategory.TECHNOLOGY,
    instructorId: 'mentor1',
    modules: [
      {
        id: 'm1',
        title: 'HTML Fundamentals',
        content: [
          {
            id: 'c1',
            type: 'text',
            content: `<h3>What is HTML?</h3>
            <p>HTML (HyperText Markup Language) is the backbone of web development. It provides structure and meaning to web content.</p>
            <h4>Key Concepts:</h4>
            <ul>
              <li>Elements and Tags</li>
              <li>Attributes and Values</li>
              <li>Document Structure</li>
              <li>Semantic HTML</li>
            </ul>
            <h4>Practice Exercise:</h4>
            <p>Create a basic HTML page with proper structure including head, body, and semantic elements.</p>`,
            altText: 'HTML structure diagram showing nested elements',
          },
          {
            id: 'c1-video',
            type: 'video',
            content: 'https://example.com/html-basics-video.mp4',
            captions: 'Full captions available in multiple languages',
            transcript: 'Complete video transcript with timestamps',
            signLanguageVideoUrl: 'https://example.com/html-basics-sign-language.mp4'
          },
          {
            id: 'c1-interactive',
            type: 'interactive',
            content: `<div class="code-editor">
              <h4>Try it yourself:</h4>
              <textarea placeholder="Write your HTML code here...">
<!DOCTYPE html>
<html>
<head>
  <title>My First Page</title>
</head>
<body>
  <h1>Welcome to Web Development</h1>
  <p>This is my first HTML page!</p>
</body>
</html>
              </textarea>
            </div>`,
          },
          {
            id: 'c1-quiz',
            type: 'quiz',
            content: JSON.stringify({
              questions: [
                {
                  question: 'What does HTML stand for?',
                  options: ['HyperText Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language'],
                  correct: 0
                },
                {
                  question: 'Which tag is used for the largest heading?',
                  options: ['<h6>', '<h1>', '<header>'],
                  correct: 1
                }
              ]
            })
          }
        ],
        order: 1,
        estimatedTime: 45,
        lessons: [
          {
            id: 'html-lesson-1',
            title: 'HTML Structure Basics',
            steps: [
              {
                id: 'html-intro',
                title: 'What is HTML?',
                content: 'HTML (HyperText Markup Language) is the foundation of web pages. It uses tags to structure content.',
                type: 'learn' as const,
                duration: 5,
                example: '<h1>This is a heading</h1><p>This is a paragraph</p>'
              },
              {
                id: 'html-practice-1',
                title: 'Create Your First Tag',
                content: 'Now let\'s practice creating HTML tags. What tag would you use for a main heading?',
                type: 'practice' as const,
                duration: 3,
                practice: {
                  question: 'Which HTML tag creates the largest heading?',
                  answer: 'h1',
                  options: ['h1', 'h6', 'header', 'title']
                },
                hints: ['The largest heading uses the number 1', 'Think about heading hierarchy']
              },
              {
                id: 'html-structure',
                title: 'Document Structure',
                content: 'Every HTML document has a basic structure with DOCTYPE, html, head, and body elements.',
                type: 'learn' as const,
                duration: 7,
                example: '<!DOCTYPE html>\n<html>\n<head><title>Page Title</title></head>\n<body>Content goes here</body>\n</html>'
              }
            ]
          }
        ],
      },
      {
        id: 'm2',
        title: 'CSS Styling & Layout',
        content: [
          {
            id: 'c2',
            type: 'text',
            content: `<h3>CSS Fundamentals</h3>
            <p>CSS (Cascading Style Sheets) transforms plain HTML into beautiful, responsive websites.</p>
            <h4>What You'll Learn:</h4>
            <ul>
              <li>Selectors and Properties</li>
              <li>Box Model</li>
              <li>Flexbox and Grid</li>
              <li>Responsive Design</li>
              <li>Accessibility in CSS</li>
            </ul>
            <h4>Resources:</h4>
            <ul>
              <li><a href="#">CSS Cheat Sheet (PDF)</a></li>
              <li><a href="#">Color Palette Generator</a></li>
              <li><a href="#">Flexbox Guide</a></li>
            </ul>`,
          },
          {
            id: 'c2-video',
            type: 'video',
            content: 'https://example.com/css-fundamentals.mp4',
            captions: 'Available in English, Spanish, French',
            transcript: 'Full transcript with code examples'
          },
          {
            id: 'c2-practice',
            type: 'interactive',
            content: `<div class="css-playground">
              <h4>Style a Card Component:</h4>
              <div class="editor-container">
                <div class="html-editor">
                  <h5>HTML:</h5>
                  <textarea readonly>
<div class="card">
  <h3>Product Title</h3>
  <p>Product description goes here.</p>
  <button>Buy Now</button>
</div>
                  </textarea>
                </div>
                <div class="css-editor">
                  <h5>CSS (Edit this):</h5>
                  <textarea placeholder="Write your CSS here...">
.card {
  /* Add your styles */
}
                  </textarea>
                </div>
              </div>
            </div>`
          }
        ],
        order: 2,
        estimatedTime: 60,
        lessons: [
          {
            id: 'css-lesson-1',
            title: 'CSS Fundamentals',
            steps: [
              {
                id: 'css-intro',
                title: 'What is CSS?',
                content: 'CSS (Cascading Style Sheets) controls how HTML elements look and are positioned on the page.',
                type: 'learn' as const,
                duration: 5,
                example: 'h1 { color: blue; font-size: 24px; }'
              },
              {
                id: 'css-practice-1',
                title: 'Style Your First Element',
                content: 'Let\'s practice writing CSS. How would you make text red?',
                type: 'practice' as const,
                duration: 4,
                practice: {
                  question: 'Which CSS property changes text color?',
                  answer: 'color',
                  options: ['color', 'text-color', 'font-color', 'background']
                },
                hints: ['Think about the most direct property name', 'It\'s a simple one-word property']
              },
              {
                id: 'css-selectors',
                title: 'CSS Selectors',
                content: 'Selectors tell CSS which HTML elements to style. The most common are element, class, and ID selectors.',
                type: 'learn' as const,
                duration: 8,
                example: 'p { } /* element */\n.class-name { } /* class */\n#id-name { } /* ID */'
              }
            ]
          }
        ],
      },
      {
        id: 'm3',
        title: 'JavaScript Basics',
        content: [
          {
            id: 'c3',
            type: 'text',
            content: `<h3>JavaScript Programming</h3>
            <p>Add interactivity to your websites with JavaScript, the programming language of the web.</p>
            <h4>Topics Covered:</h4>
            <ul>
              <li>Variables and Data Types</li>
              <li>Functions and Events</li>
              <li>DOM Manipulation</li>
              <li>Accessibility with JavaScript</li>
            </ul>`
          },
          {
            id: 'c3-video',
            type: 'video',
            content: 'https://example.com/javascript-intro.mp4',
            captions: 'Multi-language captions available'
          }
        ],
        order: 3,
        estimatedTime: 75
      },
      {
        id: 'm4',
        title: 'Responsive Web Design',
        content: [
          {
            id: 'c4',
            type: 'text',
            content: `<h3>Building Responsive Websites</h3>
            <p>Learn to create websites that work perfectly on all devices - desktop, tablet, and mobile.</p>
            <h4>Key Concepts:</h4>
            <ul>
              <li>Mobile-First Design</li>
              <li>CSS Media Queries</li>
              <li>Flexible Grid Systems</li>
              <li>Responsive Images</li>
            </ul>`
          }
        ],
        order: 4,
        estimatedTime: 90
      },
      {
        id: 'm5',
        title: 'Web Accessibility',
        content: [
          {
            id: 'c5',
            type: 'text',
            content: `<h3>Creating Inclusive Web Experiences</h3>
            <p>Build websites that everyone can use, regardless of their abilities.</p>
            <h4>Accessibility Principles:</h4>
            <ul>
              <li>Semantic HTML Structure</li>
              <li>Keyboard Navigation</li>
              <li>Screen Reader Support</li>
              <li>Color Contrast Guidelines</li>
            </ul>`
          }
        ],
        order: 5,
        estimatedTime: 60
      }
    ],
    duration: 15,
    difficulty: 'beginner',
    accessibilityFeatures: ['screen-reader', 'captions', 'text-to-speech', 'keyboard-navigation'],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: '2',
    title: 'Digital Literacy for Beginners',
    description: 'Master essential digital skills for the modern world. Learn computer basics, internet safety, and productivity tools.',
    category: CourseCategory.LITERACY,
    instructorId: 'mentor2',
    modules: [
      {
        id: 'm4',
        title: 'Computer Fundamentals',
        content: [
          {
            id: 'c4',
            type: 'text',
            content: `<h3>Understanding Your Computer</h3>
            <p>Learn the essential components and functions of modern computers.</p>
            <h4>What You'll Master:</h4>
            <ul>
              <li>Hardware vs Software</li>
              <li>Operating System Basics</li>
              <li>File Management</li>
              <li>Keyboard Shortcuts</li>
              <li>Accessibility Features</li>
            </ul>
            <h4>Hands-on Practice:</h4>
            <p>Navigate your desktop, create folders, and organize files effectively.</p>`,
          },
          {
            id: 'c4-video',
            type: 'video',
            content: 'https://example.com/computer-basics.mp4',
            captions: 'Step-by-step visual captions',
            transcript: 'Detailed transcript with screenshots'
          },
          {
            id: 'c4-interactive',
            type: 'interactive',
            content: `<div class="computer-simulator">
              <h4>Virtual Desktop Practice:</h4>
              <p>Practice navigating a simulated desktop environment</p>
              <div class="desktop-sim">
                <button onclick="alert('Opening File Explorer')">📁 My Documents</button>
                <button onclick="alert('Opening Settings')">⚙️ Settings</button>
                <button onclick="alert('Opening Browser')">🌐 Internet</button>
              </div>
            </div>`
          }
        ],
        order: 1,
        estimatedTime: 45,
        lessons: [
          {
            id: 'computer-lesson-1',
            title: 'Understanding Your Computer',
            steps: [
              {
                id: 'computer-intro',
                title: 'What is a Computer?',
                content: 'A computer is an electronic device that processes information. It has hardware (physical parts) and software (programs).',
                type: 'learn' as const,
                duration: 5,
                example: 'Hardware: keyboard, mouse, screen. Software: web browser, word processor'
              },
              {
                id: 'computer-practice-1',
                title: 'Identify Computer Parts',
                content: 'Let\'s identify basic computer components.',
                type: 'practice' as const,
                duration: 3,
                practice: {
                  question: 'What do you use to type on a computer?',
                  answer: 'keyboard',
                  options: ['keyboard', 'mouse', 'screen', 'speaker']
                },
                hints: ['It has letters and numbers on it', 'You press buttons to make letters appear']
              },
              {
                id: 'computer-desktop',
                title: 'The Desktop',
                content: 'The desktop is the main screen you see when you start your computer. It contains icons (small pictures) that represent programs and files.',
                type: 'learn' as const,
                duration: 6,
                example: 'Icons look like: 📁 (folder), 🌐 (internet), 📝 (documents)'
              }
            ]
          }
        ],
      },
      {
        id: 'm5',
        title: 'Internet & Email Basics',
        content: [
          {
            id: 'c5',
            type: 'text',
            content: `<h3>Navigating the Internet Safely</h3>
            <p>Learn to browse the web safely and communicate effectively via email.</p>
            <h4>Key Skills:</h4>
            <ul>
              <li>Web Browser Navigation</li>
              <li>Search Techniques</li>
              <li>Email Setup and Management</li>
              <li>Online Safety and Privacy</li>
              <li>Recognizing Scams</li>
            </ul>
            <h4>Practice Activities:</h4>
            <ul>
              <li>Set up an email account</li>
              <li>Send your first email</li>
              <li>Practice safe browsing</li>
            </ul>`
          },
          {
            id: 'c5-video',
            type: 'video',
            content: 'https://example.com/internet-safety.mp4',
            captions: 'Safety tips with visual demonstrations'
          }
        ],
        order: 2,
        estimatedTime: 50
      },
      {
        id: 'm6',
        title: 'Productivity Software',
        content: [
          {
            id: 'c6',
            type: 'text',
            content: `<h3>Essential Software Skills</h3>
            <p>Master basic productivity tools for work and personal use.</p>
            <h4>Software Covered:</h4>
            <ul>
              <li>Word Processing (Documents)</li>
              <li>Spreadsheets (Basic calculations)</li>
              <li>Presentations</li>
              <li>Cloud Storage</li>
            </ul>`
          }
        ],
        order: 3,
        estimatedTime: 60
      },
      {
        id: 'm7',
        title: 'Online Banking & E-commerce',
        content: [
          {
            id: 'c7',
            type: 'text',
            content: `<h3>Safe Online Transactions</h3>
            <p>Learn to safely manage money and shop online with confidence.</p>
            <h4>Topics Covered:</h4>
            <ul>
              <li>Online Banking Basics</li>
              <li>Secure Shopping Practices</li>
              <li>Digital Payment Methods</li>
              <li>Fraud Prevention</li>
            </ul>`
          }
        ],
        order: 4,
        estimatedTime: 45
      },
      {
        id: 'm8',
        title: 'Social Media & Communication',
        content: [
          {
            id: 'c8',
            type: 'text',
            content: `<h3>Connecting Safely Online</h3>
            <p>Use social media and messaging apps to stay connected with family and friends.</p>
            <h4>Skills You'll Learn:</h4>
            <ul>
              <li>Creating Social Media Accounts</li>
              <li>Privacy Settings</li>
              <li>Video Calling</li>
              <li>Digital Etiquette</li>
            </ul>`
          }
        ],
        order: 5,
        estimatedTime: 40
      }
    ],
    duration: 12,
    difficulty: 'beginner',
    accessibilityFeatures: ['screen-reader', 'captions', 'simplified-ui', 'keyboard-navigation'],
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-05'),
  },
  {
    id: '3',
    title: 'Professional Tailoring Skills',
    description: 'Master the art of tailoring from basic stitches to advanced garment construction. Build a sustainable income through skilled craftsmanship.',
    category: CourseCategory.VOCATIONAL,
    instructorId: 'mentor3',
    modules: [
      {
        id: 'm7',
        title: 'Tailoring Fundamentals',
        content: [
          {
            id: 'c7',
            type: 'text',
            content: `<h3>Welcome to Professional Tailoring</h3>
            <p>Transform fabric into beautiful, well-fitted garments while building valuable vocational skills.</p>
            <h4>Course Overview:</h4>
            <ul>
              <li>Essential Tools and Equipment</li>
              <li>Fabric Types and Properties</li>
              <li>Basic Hand Stitches</li>
              <li>Machine Operation</li>
              <li>Safety in the Workshop</li>
            </ul>
            <h4>Career Opportunities:</h4>
            <ul>
              <li>Custom Tailoring Business</li>
              <li>Alterations Services</li>
              <li>Fashion Design Assistant</li>
              <li>Costume Making</li>
            </ul>`,
          },
          {
            id: 'c7-video',
            type: 'video',
            content: 'https://example.com/tailoring-intro.mp4',
            captions: 'Visual demonstrations with detailed captions',
            transcript: 'Complete transcript with tool descriptions',
            signLanguageVideoUrl: 'https://example.com/tailoring-intro-sign.mp4'
          },
          {
            id: 'c7-interactive',
            type: 'interactive',
            content: `<div class="tool-identification">
              <h4>Identify Tailoring Tools:</h4>
              <p>Click on each tool to learn its name and purpose</p>
              <div class="tools-grid">
                <button onclick="showTool('scissors')">✂️ Tool 1</button>
                <button onclick="showTool('measuring-tape')">📏 Tool 2</button>
                <button onclick="showTool('pins')">📌 Tool 3</button>
                <button onclick="showTool('thimble')">🪡 Tool 4</button>
              </div>
            </div>`
          }
        ],
        order: 1,
        estimatedTime: 60,
      },
      {
        id: 'm8',
        title: 'Pattern Making & Cutting',
        content: [
          {
            id: 'c8',
            type: 'text',
            content: `<h3>Creating Perfect Patterns</h3>
            <p>Learn to create and modify patterns for professional-quality garments.</p>
            <h4>Skills You'll Develop:</h4>
            <ul>
              <li>Taking Accurate Measurements</li>
              <li>Basic Pattern Drafting</li>
              <li>Pattern Modification</li>
              <li>Fabric Layout and Cutting</li>
              <li>Marking Techniques</li>
            </ul>
            <h4>Practice Project:</h4>
            <p>Create a basic shirt pattern and cut your first garment pieces.</p>`
          },
          {
            id: 'c8-video',
            type: 'video',
            content: 'https://example.com/pattern-making.mp4',
            captions: 'Step-by-step pattern creation process'
          }
        ],
        order: 2,
        estimatedTime: 90
      },
      {
        id: 'm9',
        title: 'Garment Construction',
        content: [
          {
            id: 'c9',
            type: 'text',
            content: `<h3>Building Your First Garment</h3>
            <p>Put it all together to create a complete, professional-quality garment.</p>
            <h4>Construction Techniques:</h4>
            <ul>
              <li>Seaming and Finishing</li>
              <li>Fitting and Adjustments</li>
              <li>Buttonholes and Closures</li>
              <li>Pressing and Final Details</li>
            </ul>
            <h4>Final Project:</h4>
            <p>Complete a tailored shirt from start to finish, demonstrating all learned skills.</p>`
          }
        ],
        order: 3,
        estimatedTime: 120
      },
      {
        id: 'm10',
        title: 'Advanced Tailoring Techniques',
        content: [
          {
            id: 'c10',
            type: 'text',
            content: `<h3>Professional Finishing Techniques</h3>
            <p>Master advanced skills for high-quality, professional garments.</p>
            <h4>Advanced Skills:</h4>
            <ul>
              <li>French Seams and Bound Seams</li>
              <li>Professional Pressing</li>
              <li>Lining Installation</li>
              <li>Custom Alterations</li>
            </ul>`
          }
        ],
        order: 4,
        estimatedTime: 150
      },
      {
        id: 'm11',
        title: 'Business Skills for Tailors',
        content: [
          {
            id: 'c11',
            type: 'text',
            content: `<h3>Starting Your Tailoring Business</h3>
            <p>Learn business skills to turn your tailoring expertise into income.</p>
            <h4>Business Topics:</h4>
            <ul>
              <li>Pricing Your Services</li>
              <li>Customer Relations</li>
              <li>Marketing Your Skills</li>
              <li>Managing Orders</li>
            </ul>`
          }
        ],
        order: 5,
        estimatedTime: 90
      }
    ],
    duration: 25,
    difficulty: 'intermediate',
    accessibilityFeatures: ['captions', 'transcripts', 'sign-language', 'text-to-speech'],
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-15'),
  },
  {
    id: '4',
    title: 'Effective Communication Skills',
    description: 'Master communication skills for personal growth and professional success. Learn to express yourself confidently in any situation.',
    category: CourseCategory.SOFT_SKILLS,
    instructorId: 'mentor4',
    modules: [
      {
        id: 'm10',
        title: 'Verbal Communication Mastery',
        content: [
          {
            id: 'c10',
            type: 'text',
            content: `<h3>The Power of Effective Speaking</h3>
            <p>Develop confidence and clarity in your verbal communication.</p>
            <h4>Key Areas:</h4>
            <ul>
              <li>Clear Articulation and Pronunciation</li>
              <li>Active Listening Skills</li>
              <li>Conversation Techniques</li>
              <li>Public Speaking Basics</li>
              <li>Overcoming Communication Barriers</li>
            </ul>
            <h4>Practice Exercises:</h4>
            <ul>
              <li>Voice projection exercises</li>
              <li>Tongue twisters for clarity</li>
              <li>Role-playing conversations</li>
              <li>Mini presentations</li>
            </ul>`,
          },
          {
            id: 'c10-video',
            type: 'video',
            content: 'https://example.com/verbal-communication.mp4',
            captions: 'Communication examples with visual cues',
            transcript: 'Full transcript with speaking tips',
            signLanguageVideoUrl: 'https://example.com/verbal-comm-sign.mp4'
          },
          {
            id: 'c10-interactive',
            type: 'interactive',
            content: `<div class="speech-practice">
              <h4>Practice Your Speaking:</h4>
              <p>Record yourself reading this passage and play it back to evaluate your clarity:</p>
              <div class="practice-text">
                <p>"Good communication is the bridge between confusion and clarity. When we speak with purpose and listen with intent, we create connections that transform relationships and open doors to new opportunities."</p>
              </div>
              <button onclick="startRecording()">🎤 Start Recording</button>
              <button onclick="playback()">▶️ Play Back</button>
            </div>`
          }
        ],
        order: 1,
        estimatedTime: 50,
      },
      {
        id: 'm11',
        title: 'Non-Verbal Communication',
        content: [
          {
            id: 'c11',
            type: 'text',
            content: `<h3>Body Language and Beyond</h3>
            <p>Master the silent language that speaks volumes about your message.</p>
            <h4>What You'll Learn:</h4>
            <ul>
              <li>Reading Body Language</li>
              <li>Facial Expressions and Eye Contact</li>
              <li>Posture and Gestures</li>
              <li>Personal Space and Proximity</li>
              <li>Cultural Considerations</li>
            </ul>
            <h4>Interactive Activities:</h4>
            <ul>
              <li>Mirror exercises for self-awareness</li>
              <li>Emotion recognition games</li>
              <li>Posture improvement techniques</li>
            </ul>`
          },
          {
            id: 'c11-video',
            type: 'video',
            content: 'https://example.com/body-language.mp4',
            captions: 'Visual demonstrations of body language'
          }
        ],
        order: 2,
        estimatedTime: 45
      },
      {
        id: 'm12',
        title: 'Digital Communication',
        content: [
          {
            id: 'c12',
            type: 'text',
            content: `<h3>Communicating in the Digital Age</h3>
            <p>Navigate modern communication channels with confidence and professionalism.</p>
            <h4>Digital Platforms:</h4>
            <ul>
              <li>Email Etiquette</li>
              <li>Video Conferencing Skills</li>
              <li>Social Media Communication</li>
              <li>Text Messaging Best Practices</li>
              <li>Online Collaboration Tools</li>
            </ul>
            <h4>Practical Exercises:</h4>
            <ul>
              <li>Write professional emails</li>
              <li>Practice video call etiquette</li>
              <li>Create appropriate social media posts</li>
            </ul>`
          }
        ],
        order: 3,
        estimatedTime: 40
      },
      {
        id: 'm13',
        title: 'Conflict Resolution',
        content: [
          {
            id: 'c13',
            type: 'text',
            content: `<h3>Managing Difficult Conversations</h3>
            <p>Learn to handle conflicts professionally and find win-win solutions.</p>
            <h4>Conflict Resolution Skills:</h4>
            <ul>
              <li>Active Listening Techniques</li>
              <li>De-escalation Strategies</li>
              <li>Finding Common Ground</li>
              <li>Mediation Skills</li>
            </ul>`
          }
        ],
        order: 4,
        estimatedTime: 50
      },
      {
        id: 'm14',
        title: 'Leadership Communication',
        content: [
          {
            id: 'c14',
            type: 'text',
            content: `<h3>Inspiring and Leading Others</h3>
            <p>Develop communication skills that inspire confidence and motivate teams.</p>
            <h4>Leadership Skills:</h4>
            <ul>
              <li>Motivational Speaking</li>
              <li>Giving Constructive Feedback</li>
              <li>Team Communication</li>
              <li>Presentation Skills</li>
            </ul>`
          }
        ],
        order: 5,
        estimatedTime: 60
      }
    ],
    duration: 8,
    difficulty: 'beginner',
    accessibilityFeatures: ['captions', 'transcripts', 'sign-language', 'text-to-speech'],
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-05'),
  },
  {
    id: '5',
    title: 'Mobile App Development',
    description: 'Build mobile applications using modern frameworks and tools. Includes accessibility best practices.',
    category: CourseCategory.TECHNOLOGY,
    instructorId: 'mentor1',
    modules: [
      {
        id: 'm6',
        title: 'Introduction to Mobile Development',
        content: [
          {
            id: 'c6',
            type: 'text',
            content: 'Explore the world of mobile app development and learn to create accessible mobile applications.',
            altText: undefined,
          },
        ],
        order: 1,
        estimatedTime: 60,
      },
    ],
    duration: 15,
    difficulty: 'advanced',
    accessibilityFeatures: ['screen-reader', 'captions', 'text-to-speech', 'keyboard-navigation'],
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-03-15'),
  },
  {
    id: '6',
    title: 'Entrepreneurship & Business Skills',
    description: 'Transform your ideas into successful businesses. Learn planning, marketing, and financial management for sustainable entrepreneurship.',
    category: CourseCategory.SOFT_SKILLS,
    instructorId: 'mentor5',
    modules: [
      {
        id: 'm13',
        title: 'Business Planning & Strategy',
        content: [
          {
            id: 'c13',
            type: 'text',
            content: `<h3>Building Your Business Foundation</h3>
            <p>Turn your entrepreneurial dreams into actionable business plans.</p>
            <h4>Essential Components:</h4>
            <ul>
              <li>Market Research and Analysis</li>
              <li>Business Model Development</li>
              <li>Financial Planning and Budgeting</li>
              <li>Risk Assessment</li>
              <li>Legal Considerations</li>
            </ul>
            <h4>Practical Tools:</h4>
            <ul>
              <li>Business Plan Template</li>
              <li>Market Research Worksheet</li>
              <li>Financial Projection Calculator</li>
              <li>SWOT Analysis Framework</li>
            </ul>
            <h4>Case Studies:</h4>
            <p>Learn from successful entrepreneurs who started with limited resources and built thriving businesses.</p>`,
          },
          {
            id: 'c13-video',
            type: 'video',
            content: 'https://example.com/business-planning.mp4',
            captions: 'Step-by-step business planning process'
          },
          {
            id: 'c13-interactive',
            type: 'interactive',
            content: `<div class="business-planner">
              <h4>Create Your Business Plan:</h4>
              <form class="business-form">
                <label>Business Idea:</label>
                <textarea placeholder="Describe your business idea..."></textarea>
                <label>Target Market:</label>
                <input type="text" placeholder="Who are your customers?">
                <label>Revenue Model:</label>
                <select>
                  <option>Product Sales</option>
                  <option>Service Fees</option>
                  <option>Subscription</option>
                  <option>Commission</option>
                </select>
                <button type="button">Generate Business Plan Outline</button>
              </form>
            </div>`
          }
        ],
        order: 1,
        estimatedTime: 75,
      },
      {
        id: 'm14',
        title: 'Marketing & Customer Relations',
        content: [
          {
            id: 'c14',
            type: 'text',
            content: `<h3>Reaching Your Customers</h3>
            <p>Master marketing strategies that work for small businesses and startups.</p>
            <h4>Marketing Fundamentals:</h4>
            <ul>
              <li>Brand Development</li>
              <li>Digital Marketing Basics</li>
              <li>Social Media Strategy</li>
              <li>Customer Service Excellence</li>
              <li>Building Customer Loyalty</li>
            </ul>
            <h4>Practical Projects:</h4>
            <ul>
              <li>Create a brand identity</li>
              <li>Design marketing materials</li>
              <li>Develop a social media plan</li>
              <li>Practice customer interactions</li>
            </ul>`
          }
        ],
        order: 2,
        estimatedTime: 60
      },
      {
        id: 'm15',
        title: 'Financial Management',
        content: [
          {
            id: 'c15',
            type: 'text',
            content: `<h3>Managing Your Business Finances</h3>
            <p>Learn essential financial skills to keep your business profitable and growing.</p>
            <h4>Financial Skills:</h4>
            <ul>
              <li>Bookkeeping Basics</li>
              <li>Cash Flow Management</li>
              <li>Pricing Strategies</li>
              <li>Tax Considerations</li>
              <li>Investment and Growth Planning</li>
            </ul>`
          }
        ],
        order: 3,
        estimatedTime: 55
      },
      {
        id: 'm16',
        title: 'Digital Marketing Basics',
        content: [
          {
            id: 'c16',
            type: 'text',
            content: `<h3>Online Marketing for Small Business</h3>
            <p>Learn cost-effective ways to market your business online.</p>
            <h4>Digital Marketing Topics:</h4>
            <ul>
              <li>Social Media Marketing</li>
              <li>Email Marketing</li>
              <li>Content Creation</li>
              <li>Online Advertising</li>
            </ul>`
          }
        ],
        order: 4,
        estimatedTime: 70
      },
      {
        id: 'm17',
        title: 'Scaling Your Business',
        content: [
          {
            id: 'c17',
            type: 'text',
            content: `<h3>Growing Beyond Startup</h3>
            <p>Strategies for expanding your business sustainably.</p>
            <h4>Growth Strategies:</h4>
            <ul>
              <li>Hiring Your First Employee</li>
              <li>Expanding Your Market</li>
              <li>Managing Growth</li>
              <li>Building Systems</li>
            </ul>`
          }
        ],
        order: 5,
        estimatedTime: 80
      }
    ],
    duration: 15,
    difficulty: 'intermediate',
    accessibilityFeatures: ['screen-reader', 'captions', 'simplified-ui', 'text-to-speech'],
    createdAt: new Date('2024-03-20'),
    updatedAt: new Date('2024-03-25'),
  },
  {
    id: '7',
    title: 'Data Analysis & Excel Skills',
    description: 'Master data analysis using Excel and other tools. Perfect for administrative roles and business intelligence.',
    category: CourseCategory.TECHNOLOGY,
    instructorId: 'mentor6',
    modules: [
      {
        id: 'm16',
        title: 'Excel Fundamentals',
        content: [
          {
            id: 'c16',
            type: 'text',
            content: `<h3>Excel Mastery for Data Analysis</h3>
            <p>Transform raw data into meaningful insights using Microsoft Excel.</p>
            <h4>Core Skills:</h4>
            <ul>
              <li>Spreadsheet Navigation and Setup</li>
              <li>Data Entry and Formatting</li>
              <li>Basic Formulas and Functions</li>
              <li>Charts and Graphs</li>
              <li>Data Sorting and Filtering</li>
            </ul>
            <h4>Practical Exercises:</h4>
            <ul>
              <li>Create a personal budget tracker</li>
              <li>Analyze sales data</li>
              <li>Build interactive dashboards</li>
            </ul>`,
          },
          {
            id: 'c16-video',
            type: 'video',
            content: 'https://example.com/excel-basics.mp4',
            captions: 'Screen recordings with detailed explanations'
          }
        ],
        order: 1,
        estimatedTime: 90
      }
    ],
    duration: 18,
    difficulty: 'intermediate',
    accessibilityFeatures: ['screen-reader', 'captions', 'keyboard-navigation'],
    createdAt: new Date('2024-04-01'),
    updatedAt: new Date('2024-04-05'),
  },
  {
    id: '8',
    title: 'Customer Service Excellence',
    description: 'Develop outstanding customer service skills for hospitality, retail, and service industries.',
    category: CourseCategory.VOCATIONAL,
    instructorId: 'mentor7',
    modules: [
      {
        id: 'm17',
        title: 'Customer Service Fundamentals',
        content: [
          {
            id: 'c17',
            type: 'text',
            content: `<h3>Excellence in Customer Service</h3>
            <p>Learn to create exceptional customer experiences that build loyalty and drive business success.</p>
            <h4>Essential Skills:</h4>
            <ul>
              <li>Understanding Customer Needs</li>
              <li>Professional Communication</li>
              <li>Problem-Solving Techniques</li>
              <li>Handling Difficult Situations</li>
              <li>Building Customer Relationships</li>
            </ul>
            <h4>Role-Playing Scenarios:</h4>
            <ul>
              <li>Greeting customers professionally</li>
              <li>Handling complaints effectively</li>
              <li>Upselling and cross-selling</li>
              <li>Managing wait times</li>
            </ul>`,
          }
        ],
        order: 1,
        estimatedTime: 60
      }
    ],
    duration: 10,
    difficulty: 'beginner',
    accessibilityFeatures: ['captions', 'transcripts', 'sign-language'],
    createdAt: new Date('2024-04-10'),
    updatedAt: new Date('2024-04-15'),
  },
];

export const useCourseStore = create<CourseState>((set, get) => ({
  courses: [],
  enrolledCourses: [],
  progress: {},
  isLoading: false,
  error: null,

  fetchCourses: async () => {
    set({ isLoading: true, error: null });
    try {
      // Try to fetch from real API
      const { api } = await import('../services/api');
      const response = await api.get('/courses');
      const courses = response.data;
      
      const savedEnrollments = localStorage.getItem('enrolledCourses');
      const enrolled = savedEnrollments ? JSON.parse(savedEnrollments) : [];
      
      set({
        courses: courses,
        enrolledCourses: enrolled,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      // Fallback to mock data if API fails
      console.warn('API failed, using mock data:', error);
      const savedEnrollments = localStorage.getItem('enrolledCourses');
      const enrolled = savedEnrollments ? JSON.parse(savedEnrollments) : [];
      
      set({
        courses: mockCourses,
        enrolledCourses: enrolled,
        isLoading: false,
        error: null,
      });
    }
  },

  enrollInCourse: async (courseId: string) => {
    try {
      const { enrolledCourses } = get();
      if (enrolledCourses.includes(courseId)) {
        return; // Already enrolled
      }

      const newEnrollments = [...enrolledCourses, courseId];
      localStorage.setItem('enrolledCourses', JSON.stringify(newEnrollments));

      // Initialize progress
      const newProgress: LearnerProgress = {
        courseId,
        moduleId: '',
        completionPercentage: 0,
        lastAccessed: new Date(),
        completedModules: [],
        quizScores: [],
      };

      set((state) => ({
        enrolledCourses: newEnrollments,
        progress: {
          ...state.progress,
          [courseId]: newProgress,
        },
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to enroll in course',
      });
    }
  },

  updateProgress: (courseId: string, moduleId: string, percentage: number) => {
    set((state) => {
      const currentProgress = state.progress[courseId] || {
        courseId,
        moduleId: '',
        completionPercentage: 0,
        lastAccessed: new Date(),
        completedModules: [],
        quizScores: [],
      };

      return {
        progress: {
          ...state.progress,
          [courseId]: {
            ...currentProgress,
            moduleId,
            completionPercentage: percentage,
            lastAccessed: new Date(),
            completedModules: percentage === 100 
              ? [...new Set([...currentProgress.completedModules, moduleId])]
              : currentProgress.completedModules,
          },
        },
      };
    });
  },

  getCourseById: (courseId: string) => {
    return get().courses.find((course) => course.id === courseId);
  },

  getEnrolledCourses: () => {
    const { courses, enrolledCourses } = get();
    return courses.filter((course: Course) => enrolledCourses.includes(course.id));
  },
}));

