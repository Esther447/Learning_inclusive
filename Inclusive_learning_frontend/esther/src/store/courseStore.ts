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
  unenrollFromCourse: (courseId: string) => Promise<void>;
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
    learningOutcomes: [
      'Build responsive websites from scratch using HTML, CSS, and JavaScript',
      'Implement web accessibility best practices (WCAG 2.1)',
      'Create interactive user interfaces with modern JavaScript',
      'Design mobile-first responsive layouts',
      'Debug and test web applications effectively'
    ],
    resources: [
      { name: 'HTML & CSS Complete Guide', type: 'pdf', url: 'https://developer.mozilla.org/en-US/docs/Learn/HTML', description: 'Comprehensive HTML/CSS guide' },
      { name: 'JavaScript Video Course', type: 'video', url: 'https://www.youtube.com/watch?v=W6NZfCO5SIk', description: 'Complete JavaScript course' },
      { name: 'Web Dev Slides', type: 'slides', url: 'https://slides.com/webdev', description: 'Course presentation slides' },
      { name: 'Code Examples', type: 'code', url: 'https://github.com/webdev-examples', description: 'Practice code repository' }
    ],
    externalLinks: [
      { name: 'MDN Web Docs', url: 'https://developer.mozilla.org/', description: 'Web development documentation' },
      { name: 'W3Schools', url: 'https://www.w3schools.com/', description: 'Interactive tutorials' },
      { name: 'freeCodeCamp', url: 'https://www.freecodecamp.org/', description: 'Free coding bootcamp' },
      { name: 'CSS-Tricks', url: 'https://css-tricks.com/', description: 'CSS tips and techniques' }
    ],
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
            description: 'Learn the fundamental structure of HTML documents',
            duration: 15,
            videoUrl: 'https://www.youtube.com/watch?v=UB1O30fR-EE',
            slides: [
              { name: 'HTML Basics Slides', type: 'slides', url: 'https://slides.com/html-basics' }
            ],
            materials: [
              { name: 'HTML Cheat Sheet', type: 'pdf', url: 'https://htmlcheatsheet.com/pdf' },
              { name: 'Practice Exercises', type: 'doc', url: 'https://exercises.com/html' }
            ],
            externalLinks: [
              { name: 'HTML Tutorial', url: 'https://www.w3schools.com/html/', description: 'Interactive HTML tutorial' }
            ],
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
            description: 'Master CSS styling and layout techniques',
            duration: 20,
            videoUrl: 'https://www.youtube.com/watch?v=1Rs2ND1ryYc',
            slides: [
              { name: 'CSS Basics Slides', type: 'slides', url: 'https://slides.com/css-basics' }
            ],
            materials: [
              { name: 'CSS Cheat Sheet', type: 'pdf', url: 'https://cssreference.io/' },
              { name: 'Flexbox Guide', type: 'pdf', url: 'https://css-tricks.com/snippets/css/a-guide-to-flexbox/' }
            ],
            externalLinks: [
              { name: 'CSS Tutorial', url: 'https://www.w3schools.com/css/', description: 'Complete CSS guide' }
            ],
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
        estimatedTime: 75,
        lessons: [
          {
            id: 'js-lesson-1',
            title: 'JavaScript Variables & Data Types',
            description: 'Learn JavaScript fundamentals',
            duration: 20,
            videoUrl: 'https://www.youtube.com/watch?v=W6NZfCO5SIk',
            slides: [{ name: 'JavaScript Basics', type: 'slides', url: 'https://slides.com/js-basics' }],
            materials: [{ name: 'JS Cheat Sheet', type: 'pdf', url: 'https://js-cheatsheet.com' }],
            externalLinks: [{ name: 'JavaScript.info', url: 'https://javascript.info/' }],
            steps: [{ id: 'js-intro', title: 'JavaScript Intro', content: 'Learn JavaScript basics', type: 'learn' as const, duration: 5 }]
          },
          {
            id: 'js-lesson-2',
            title: 'Functions & DOM',
            description: 'JavaScript functions and DOM manipulation',
            duration: 25,
            videoUrl: 'https://www.youtube.com/watch?v=dom-manipulation',
            slides: [{ name: 'Functions & DOM', type: 'slides', url: 'https://slides.com/js-dom' }],
            materials: [{ name: 'DOM Guide', type: 'pdf', url: 'https://dom-guide.com' }],
            steps: [{ id: 'js-dom', title: 'DOM', content: 'Manipulate the DOM', type: 'learn' as const, duration: 5 }]
          },
          {
            id: 'js-lesson-3',
            title: 'Events & Interactivity',
            description: 'Handle user events',
            duration: 30,
            videoUrl: 'https://www.youtube.com/watch?v=events',
            slides: [{ name: 'Events', type: 'slides', url: 'https://slides.com/events' }],
            materials: [{ name: 'Events Guide', type: 'pdf', url: 'https://events-guide.com' }],
            steps: [{ id: 'js-events', title: 'Events', content: 'Handle events', type: 'learn' as const, duration: 5 }]
          }
        ]
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
        estimatedTime: 90,
        lessons: [
          {
            id: 'rwd-lesson-1',
            title: 'Mobile-First Design',
            description: 'Design for mobile devices first',
            duration: 30,
            videoUrl: 'https://www.youtube.com/watch?v=mobile-first',
            slides: [{ name: 'Mobile-First', type: 'slides', url: 'https://slides.com/mobile-first' }],
            materials: [{ name: 'Mobile Design Guide', type: 'pdf', url: 'https://mobile-guide.com' }],
            steps: [{ id: 'rwd-mobile', title: 'Mobile-First', content: 'Mobile-first approach', type: 'learn' as const, duration: 5 }]
          },
          {
            id: 'rwd-lesson-2',
            title: 'Media Queries',
            description: 'Responsive CSS with media queries',
            duration: 30,
            videoUrl: 'https://www.youtube.com/watch?v=media-queries',
            slides: [{ name: 'Media Queries', type: 'slides', url: 'https://slides.com/media-queries' }],
            materials: [{ name: 'Media Query Guide', type: 'pdf', url: 'https://mq-guide.com' }],
            steps: [{ id: 'rwd-mq', title: 'Media Queries', content: 'Using media queries', type: 'learn' as const, duration: 5 }]
          },
          {
            id: 'rwd-lesson-3',
            title: 'Responsive Images',
            description: 'Optimize images for all devices',
            duration: 30,
            videoUrl: 'https://www.youtube.com/watch?v=responsive-images',
            slides: [{ name: 'Responsive Images', type: 'slides', url: 'https://slides.com/resp-images' }],
            materials: [{ name: 'Image Optimization', type: 'pdf', url: 'https://img-opt.com' }],
            steps: [{ id: 'rwd-img', title: 'Images', content: 'Responsive images', type: 'learn' as const, duration: 5 }]
          }
        ]
      },
      {
        id: 'm5',
        title: 'Final Project',
        content: [
          {
            id: 'c5',
            type: 'text',
            content: `<h3>Build Your Website</h3>
            <p>Combine HTML, CSS, and JavaScript to create a complete website.</p>`
          }
        ],
        order: 5,
        estimatedTime: 150,
        lessons: [
          {
            id: 'project-lesson-1',
            title: 'Build a Small Website',
            description: 'Combine HTML, CSS, and JavaScript',
            duration: 120,
            videoUrl: 'https://www.youtube.com/watch?v=final-project',
            slides: [{ name: 'Project Slides', type: 'slides', url: 'https://slides.com/final-project' }],
            materials: [
              { name: 'Project Template', type: 'code', url: 'https://github.com/project-template' },
              { name: 'Sample Projects', type: 'other', url: 'https://samples.com/projects' }
            ],
            externalLinks: [{ name: 'Project Walkthrough', url: 'https://walkthrough.com/project' }],
            steps: [{ id: 'proj-intro', title: 'Final Project', content: 'Build a complete website using all learned skills.', type: 'learn' as const, duration: 10 }]
          }
        ]
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
    learningOutcomes: [
      'Navigate computers and operating systems confidently',
      'Use the internet safely and effectively',
      'Communicate professionally via email',
      'Protect personal information online',
      'Create documents and spreadsheets'
    ],
    resources: [
      { name: 'Computer Basics Guide', type: 'pdf', url: 'https://edu.gcfglobal.org/en/computerbasics/', description: 'Complete computer guide' },
      { name: 'Internet Safety Videos', type: 'video', url: 'https://www.youtube.com/watch?v=safety', description: 'Online safety course' },
      { name: 'Email Guide', type: 'doc', url: 'https://email-guide.com', description: 'Professional email writing' }
    ],
    externalLinks: [
      { name: 'GCF Global', url: 'https://edu.gcfglobal.org/', description: 'Free digital literacy tutorials' },
      { name: 'Google Digital Garage', url: 'https://learndigital.withgoogle.com/', description: 'Digital skills training' },
      { name: 'Microsoft Digital Literacy', url: 'https://www.microsoft.com/en-us/digital-literacy', description: 'Microsoft courses' }
    ],
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
            description: 'Learn computer components and basic operations',
            duration: 15,
            videoUrl: 'https://www.youtube.com/watch?v=computer-basics',
            slides: [
              { name: 'Computer Basics Slides', type: 'slides', url: 'https://slides.com/computer-basics' }
            ],
            materials: [
              { name: 'Computer Parts Guide', type: 'pdf', url: 'https://computer-guide.com/pdf' },
              { name: 'Keyboard Shortcuts', type: 'pdf', url: 'https://shortcuts.com/pdf' }
            ],
            externalLinks: [
              { name: 'Computer Basics Tutorial', url: 'https://edu.gcfglobal.org/en/computerbasics/', description: 'Step-by-step guide' }
            ],
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
        title: 'Internet Basics',
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
        estimatedTime: 144,
        lessons: [
          {
            id: 'internet-lesson-1',
            title: 'Browsing',
            description: 'Learn web browser basics',
            duration: 30,
            videoUrl: 'https://www.youtube.com/watch?v=browsing',
            slides: [{ name: 'Browsing Slides', type: 'slides', url: 'https://slides.com/browsing' }],
            materials: [{ name: 'Browser Guide', type: 'pdf', url: 'https://browser-guide.com/pdf' }],
            steps: [{ id: 'browse-intro', title: 'Web Browsing', content: 'Navigate the internet safely.', type: 'learn' as const, duration: 5 }]
          },
          {
            id: 'internet-lesson-2',
            title: 'Search Techniques',
            description: 'Effective online searching',
            duration: 25,
            videoUrl: 'https://www.youtube.com/watch?v=search',
            slides: [{ name: 'Search Slides', type: 'slides', url: 'https://slides.com/search' }],
            materials: [{ name: 'Search Cheat Sheet', type: 'pdf', url: 'https://search-tips.com/pdf' }],
            steps: [{ id: 'search-intro', title: 'Search Skills', content: 'Find information quickly online.', type: 'learn' as const, duration: 5 }]
          },
          {
            id: 'internet-lesson-3',
            title: 'Online Safety',
            description: 'Stay safe on the internet',
            duration: 35,
            videoUrl: 'https://www.youtube.com/watch?v=safety',
            slides: [{ name: 'Safety Slides', type: 'slides', url: 'https://slides.com/safety' }],
            materials: [{ name: 'Safety Checklist', type: 'pdf', url: 'https://safety-checklist.com/pdf' }],
            steps: [{ id: 'safety-intro', title: 'Online Safety', content: 'Protect yourself online.', type: 'learn' as const, duration: 5 }]
          }
        ]
      },
      {
        id: 'm6',
        title: 'Productivity Tools',
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
        estimatedTime: 180,
        lessons: [
          {
            id: 'prod-lesson-1',
            title: 'Word Processors',
            description: 'Create and edit documents',
            duration: 50,
            videoUrl: 'https://www.youtube.com/watch?v=word-processor',
            slides: [{ name: 'Word Processing Slides', type: 'slides', url: 'https://slides.com/word' }],
            materials: [{ name: 'Sample Documents', type: 'doc', url: 'https://samples.com/docs' }],
            steps: [{ id: 'word-intro', title: 'Word Processing', content: 'Create professional documents.', type: 'learn' as const, duration: 5 }]
          },
          {
            id: 'prod-lesson-2',
            title: 'Spreadsheets',
            description: 'Work with data and calculations',
            duration: 55,
            videoUrl: 'https://www.youtube.com/watch?v=spreadsheets',
            slides: [{ name: 'Spreadsheet Slides', type: 'slides', url: 'https://slides.com/spreadsheet' }],
            materials: [{ name: 'Excel Templates', type: 'other', url: 'https://templates.com/excel' }],
            steps: [{ id: 'sheet-intro', title: 'Spreadsheets', content: 'Organize and analyze data.', type: 'learn' as const, duration: 5 }]
          },
          {
            id: 'prod-lesson-3',
            title: 'Presentations',
            description: 'Create engaging presentations',
            duration: 45,
            videoUrl: 'https://www.youtube.com/watch?v=presentations',
            slides: [{ name: 'Presentation Slides', type: 'slides', url: 'https://slides.com/presentations' }],
            materials: [{ name: 'PowerPoint Templates', type: 'slides', url: 'https://templates.com/ppt' }],
            steps: [{ id: 'pres-intro', title: 'Presentations', content: 'Create impactful slides.', type: 'learn' as const, duration: 5 }]
          }
        ]
      },
      {
        id: 'm7',
        title: 'Communication Tools',
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
        estimatedTime: 120,
        lessons: [
          {
            id: 'comm-lesson-1',
            title: 'Email',
            description: 'Professional email communication',
            duration: 35,
            videoUrl: 'https://www.youtube.com/watch?v=email',
            slides: [{ name: 'Email Slides', type: 'slides', url: 'https://slides.com/email' }],
            materials: [{ name: 'Email Exercises', type: 'doc', url: 'https://exercises.com/email' }],
            steps: [{ id: 'email-intro', title: 'Email Basics', content: 'Send professional emails.', type: 'learn' as const, duration: 5 }]
          },
          {
            id: 'comm-lesson-2',
            title: 'Chat Apps',
            description: 'Using messaging applications',
            duration: 25,
            videoUrl: 'https://www.youtube.com/watch?v=chat',
            slides: [{ name: 'Chat Slides', type: 'slides', url: 'https://slides.com/chat' }],
            materials: [{ name: 'Chat Guide', type: 'pdf', url: 'https://chat-guide.com/pdf' }],
            steps: [{ id: 'chat-intro', title: 'Messaging', content: 'Communicate via chat apps.', type: 'learn' as const, duration: 5 }]
          },
          {
            id: 'comm-lesson-3',
            title: 'Video Conferencing',
            description: 'Virtual meetings and calls',
            duration: 30,
            videoUrl: 'https://www.youtube.com/watch?v=video-conf',
            slides: [{ name: 'Video Call Slides', type: 'slides', url: 'https://slides.com/video' }],
            materials: [{ name: 'Video Call Guide', type: 'pdf', url: 'https://video-guide.com/pdf' }],
            steps: [{ id: 'video-intro', title: 'Video Calls', content: 'Join virtual meetings.', type: 'learn' as const, duration: 5 }]
          }
        ]
      },
      {
        id: 'm8',
        title: 'Digital Safety & Security',
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
        estimatedTime: 120,
        lessons: [
          {
            id: 'security-lesson-1',
            title: 'Passwords',
            description: 'Creating strong passwords',
            duration: 25,
            videoUrl: 'https://www.youtube.com/watch?v=passwords',
            slides: [{ name: 'Password Slides', type: 'slides', url: 'https://slides.com/passwords' }],
            materials: [{ name: 'Security Checklist', type: 'pdf', url: 'https://security.com/pdf' }],
            steps: [{ id: 'pwd-intro', title: 'Strong Passwords', content: 'Create secure passwords.', type: 'learn' as const, duration: 5 }]
          },
          {
            id: 'security-lesson-2',
            title: 'Phishing',
            description: 'Recognizing online scams',
            duration: 30,
            videoUrl: 'https://www.youtube.com/watch?v=phishing',
            slides: [{ name: 'Phishing Slides', type: 'slides', url: 'https://slides.com/phishing' }],
            materials: [{ name: 'Scam Examples', type: 'pdf', url: 'https://scams.com/pdf' }],
            steps: [{ id: 'phish-intro', title: 'Avoid Scams', content: 'Identify phishing attempts.', type: 'learn' as const, duration: 5 }]
          },
          {
            id: 'security-lesson-3',
            title: 'Secure Browsing',
            description: 'Safe internet practices',
            duration: 25,
            videoUrl: 'https://www.youtube.com/watch?v=secure-browsing',
            slides: [{ name: 'Secure Browsing Slides', type: 'slides', url: 'https://slides.com/secure' }],
            materials: [{ name: 'Safety Guide', type: 'pdf', url: 'https://safety-guide.com/pdf' }],
            steps: [{ id: 'secure-intro', title: 'Browse Safely', content: 'Stay safe while browsing.', type: 'learn' as const, duration: 5 }]
          }
        ]
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
    learningOutcomes: [
      'Master basic and advanced sewing techniques',
      'Create professional garment patterns',
      'Operate sewing machines safely',
      'Perform alterations and repairs',
      'Start a tailoring business'
    ],
    resources: [
      { name: 'Tailoring Manual', type: 'pdf', url: 'https://tailoring-manual.com/pdf', description: 'Complete tailoring guide' },
      { name: 'Pattern Making Videos', type: 'video', url: 'https://www.youtube.com/tailoring', description: 'Pattern tutorials' },
      { name: 'Sewing Machine Guide', type: 'pdf', url: 'https://sewing-guide.com/pdf', description: 'Machine operation manual' }
    ],
    externalLinks: [
      { name: 'Threads Magazine', url: 'https://www.threadsmagazine.com/', description: 'Professional sewing tips' },
      { name: 'Pattern Review', url: 'https://sewing.patternreview.com/', description: 'Pattern community' },
      { name: 'Sewing.org', url: 'https://www.sewing.org/', description: 'Sewing education' }
    ],
    modules: [
      {
        id: 'm7',
        title: 'Basic Stitching Techniques',
        content: [{ id: 'c7', type: 'text', content: '<h3>Hand & Machine Stitches</h3><p>Master fundamental stitching techniques.</p>' }],
        order: 1,
        estimatedTime: 300,
        lessons: [
          {
            id: 'tailor-l1',
            title: 'Hand Stitching',
            description: 'Learn basic hand stitches',
            duration: 90,
            videoUrl: 'https://www.youtube.com/watch?v=hand-stitch',
            slides: [{ name: 'Hand Stitch Slides', type: 'slides', url: 'https://slides.com/hand-stitch' }],
            materials: [{ name: 'Practice Sheets', type: 'pdf', url: 'https://practice.com/hand-stitch' }],
            steps: [{ id: 's1', title: 'Hand Stitching', content: 'Basic hand stitches', type: 'learn' as const, duration: 10 }]
          },
          {
            id: 'tailor-l2',
            title: 'Machine Stitching',
            description: 'Master sewing machine techniques',
            duration: 120,
            videoUrl: 'https://www.youtube.com/watch?v=machine-stitch',
            slides: [{ name: 'Machine Stitch Slides', type: 'slides', url: 'https://slides.com/machine' }],
            materials: [{ name: 'Machine Guide', type: 'pdf', url: 'https://machine-guide.com/pdf' }],
            steps: [{ id: 's2', title: 'Machine Stitching', content: 'Sewing machine basics', type: 'learn' as const, duration: 10 }]
          }
        ]
      },
      {
        id: 'm8',
        title: 'Fabric Knowledge',
        content: [{ id: 'c8', type: 'text', content: '<h3>Fabric Types & Care</h3><p>Understand different fabrics.</p>' }],
        order: 2,
        estimatedTime: 300,
        lessons: [
          {
            id: 'tailor-l3',
            title: 'Fabric Types',
            description: 'Learn about different fabrics',
            duration: 90,
            videoUrl: 'https://www.youtube.com/watch?v=fabric-types',
            slides: [{ name: 'Fabric Slides', type: 'slides', url: 'https://slides.com/fabric' }],
            materials: [{ name: 'Fabric Guide', type: 'pdf', url: 'https://fabric-guide.com/pdf' }],
            steps: [{ id: 's3', title: 'Fabric Types', content: 'Different fabric materials', type: 'learn' as const, duration: 10 }]
          },
          {
            id: 'tailor-l4',
            title: 'Fabric Care',
            description: 'Fabric maintenance and selection',
            duration: 75,
            videoUrl: 'https://www.youtube.com/watch?v=fabric-care',
            slides: [{ name: 'Care Slides', type: 'slides', url: 'https://slides.com/care' }],
            materials: [{ name: 'Care Instructions', type: 'pdf', url: 'https://care.com/pdf' }],
            steps: [{ id: 's4', title: 'Fabric Care', content: 'Maintaining fabrics', type: 'learn' as const, duration: 10 }]
          }
        ]
      },
      {
        id: 'm9',
        title: 'Garment Construction',
        content: [{ id: 'c9', type: 'text', content: '<h3>Patterns, Cutting & Sewing</h3><p>Build complete garments.</p>' }],
        order: 3,
        estimatedTime: 360,
        lessons: [
          {
            id: 'tailor-l5',
            title: 'Pattern Making',
            description: 'Create garment patterns',
            duration: 120,
            videoUrl: 'https://www.youtube.com/watch?v=patterns',
            slides: [{ name: 'Pattern Slides', type: 'slides', url: 'https://slides.com/patterns' }],
            materials: [{ name: 'Pattern Templates', type: 'pdf', url: 'https://templates.com/patterns' }],
            steps: [{ id: 's5', title: 'Patterns', content: 'Creating patterns', type: 'learn' as const, duration: 10 }]
          },
          {
            id: 'tailor-l6',
            title: 'Cutting Techniques',
            description: 'Precise fabric cutting',
            duration: 90,
            videoUrl: 'https://www.youtube.com/watch?v=cutting',
            slides: [{ name: 'Cutting Slides', type: 'slides', url: 'https://slides.com/cutting' }],
            materials: [{ name: 'Cutting Guide', type: 'pdf', url: 'https://cutting.com/pdf' }],
            steps: [{ id: 's6', title: 'Cutting', content: 'Fabric cutting', type: 'learn' as const, duration: 10 }]
          },
          {
            id: 'tailor-l7',
            title: 'Sewing Techniques',
            description: 'Advanced sewing methods',
            duration: 150,
            videoUrl: 'https://www.youtube.com/watch?v=sewing-tech',
            slides: [{ name: 'Sewing Slides', type: 'slides', url: 'https://slides.com/sewing' }],
            materials: [{ name: 'Sewing Guide', type: 'pdf', url: 'https://sewing.com/pdf' }],
            steps: [{ id: 's7', title: 'Sewing', content: 'Advanced techniques', type: 'learn' as const, duration: 10 }]
          }
        ]
      },
      {
        id: 'm10',
        title: 'Advanced Tailoring',
        content: [{ id: 'c10', type: 'text', content: '<h3>Fitting, Alterations & Finishing</h3><p>Professional tailoring skills.</p>' }],
        order: 4,
        estimatedTime: 300,
        lessons: [
          {
            id: 'tailor-l8',
            title: 'Fitting',
            description: 'Perfect garment fitting',
            duration: 90,
            videoUrl: 'https://www.youtube.com/watch?v=fitting',
            slides: [{ name: 'Fitting Slides', type: 'slides', url: 'https://slides.com/fitting' }],
            materials: [{ name: 'Fitting Checklist', type: 'pdf', url: 'https://fitting.com/pdf' }],
            steps: [{ id: 's8', title: 'Fitting', content: 'Garment fitting', type: 'learn' as const, duration: 10 }]
          },
          {
            id: 'tailor-l9',
            title: 'Alterations',
            description: 'Garment alterations and repairs',
            duration: 105,
            videoUrl: 'https://www.youtube.com/watch?v=alterations',
            slides: [{ name: 'Alterations Slides', type: 'slides', url: 'https://slides.com/alterations' }],
            materials: [{ name: 'Alteration Guide', type: 'pdf', url: 'https://alterations.com/pdf' }],
            steps: [{ id: 's9', title: 'Alterations', content: 'Altering garments', type: 'learn' as const, duration: 10 }]
          },
          {
            id: 'tailor-l10',
            title: 'Finishing Touches',
            description: 'Professional finishing',
            duration: 105,
            videoUrl: 'https://www.youtube.com/watch?v=finishing',
            slides: [{ name: 'Finishing Slides', type: 'slides', url: 'https://slides.com/finishing' }],
            materials: [{ name: 'Finishing Guide', type: 'pdf', url: 'https://finishing.com/pdf' }],
            steps: [{ id: 's10', title: 'Finishing', content: 'Final touches', type: 'learn' as const, duration: 10 }]
          }
        ]
      },
      {
        id: 'm11',
        title: 'Business Skills for Tailors',
        content: [{ id: 'c11', type: 'text', content: '<h3>Pricing, Selling & Client Management</h3><p>Run a tailoring business.</p>' }],
        order: 5,
        estimatedTime: 240,
        lessons: [
          {
            id: 'tailor-l11',
            title: 'Pricing Services',
            description: 'Price your tailoring work',
            duration: 60,
            videoUrl: 'https://www.youtube.com/watch?v=pricing',
            slides: [{ name: 'Pricing Slides', type: 'slides', url: 'https://slides.com/pricing' }],
            materials: [{ name: 'Pricing Worksheet', type: 'doc', url: 'https://pricing.com/worksheet' }],
            externalLinks: [{ name: 'Business Resources', url: 'https://business.com/tailoring' }],
            steps: [{ id: 's11', title: 'Pricing', content: 'Setting prices', type: 'learn' as const, duration: 10 }]
          },
          {
            id: 'tailor-l12',
            title: 'Client Management',
            description: 'Managing customers effectively',
            duration: 90,
            videoUrl: 'https://www.youtube.com/watch?v=clients',
            slides: [{ name: 'Client Slides', type: 'slides', url: 'https://slides.com/clients' }],
            materials: [{ name: 'Client Forms', type: 'doc', url: 'https://forms.com/clients' }],
            externalLinks: [{ name: 'Customer Service Tips', url: 'https://service.com/tips' }],
            steps: [{ id: 's12', title: 'Clients', content: 'Managing clients', type: 'learn' as const, duration: 10 }]
          },
          {
            id: 'tailor-l13',
            title: 'Marketing Your Business',
            description: 'Promote your tailoring services',
            duration: 90,
            videoUrl: 'https://www.youtube.com/watch?v=marketing',
            slides: [{ name: 'Marketing Slides', type: 'slides', url: 'https://slides.com/marketing' }],
            materials: [{ name: 'Marketing Guide', type: 'pdf', url: 'https://marketing.com/guide' }],
            externalLinks: [{ name: 'Marketing Resources', url: 'https://marketing.com/resources' }],
            steps: [{ id: 's13', title: 'Marketing', content: 'Promoting services', type: 'learn' as const, duration: 10 }]
          }
        ]
      }
    ],
    duration: 25,
    difficulty: 'intermediate',
    accessibilityFeatures: ['captions', 'transcripts', 'sign-language'],
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-15'),
  },
  {
    id: '4',
    title: 'Effective Communication Skills',
    description: 'Master communication skills for personal growth and professional success. Learn to express yourself confidently in any situation.',
    category: CourseCategory.SOFT_SKILLS,
    instructorId: 'mentor4',
    learningOutcomes: [
      'Speak clearly and confidently',
      'Read and interpret body language',
      'Write professional emails',
      'Handle difficult conversations',
      'Present ideas persuasively'
    ],
    resources: [
      { name: 'Communication Workbook', type: 'pdf', url: 'https://comm-workbook.com/pdf', description: 'Practice exercises' },
      { name: 'Public Speaking Course', type: 'video', url: 'https://www.youtube.com/public-speaking', description: 'Speaking masterclass' },
      { name: 'Body Language Guide', type: 'pdf', url: 'https://body-language.com/pdf', description: 'Non-verbal communication' }
    ],
    externalLinks: [
      { name: 'Toastmasters', url: 'https://www.toastmasters.org/', description: 'Public speaking club' },
      { name: 'TED Talks', url: 'https://www.ted.com/topics/communication', description: 'Communication talks' },
      { name: 'Coursera Communication', url: 'https://www.coursera.org/courses?query=communication', description: 'Online courses' }
    ],
    modules: [
      {
        id: 'm10',
        title: 'Foundations of Communication',
        content: [{ id: 'c10', type: 'text', content: '<h3>Verbal, Non-verbal & Active Listening</h3><p>Communication fundamentals.</p>' }],
        order: 1,
        estimatedTime: 96,
        lessons: [
          {
            id: 'comm-l1',
            title: 'Verbal Communication',
            description: 'Speaking clearly and effectively',
            duration: 32,
            videoUrl: 'https://www.youtube.com/watch?v=verbal-comm',
            slides: [{ name: 'Verbal Comm Slides', type: 'slides', url: 'https://slides.com/verbal' }],
            materials: [{ name: 'Speaking Exercises', type: 'pdf', url: 'https://exercises.com/speaking' }],
            steps: [{ id: 'cs1', title: 'Verbal', content: 'Speaking skills', type: 'learn' as const, duration: 5 }]
          },
          {
            id: 'comm-l2',
            title: 'Non-verbal Communication',
            description: 'Body language and gestures',
            duration: 32,
            videoUrl: 'https://www.youtube.com/watch?v=nonverbal',
            slides: [{ name: 'Body Language Slides', type: 'slides', url: 'https://slides.com/body' }],
            materials: [{ name: 'Body Language Guide', type: 'pdf', url: 'https://body.com/guide' }],
            steps: [{ id: 'cs2', title: 'Non-verbal', content: 'Body language', type: 'learn' as const, duration: 5 }]
          },
          {
            id: 'comm-l3',
            title: 'Active Listening',
            description: 'Listening with intent',
            duration: 32,
            videoUrl: 'https://www.youtube.com/watch?v=listening',
            slides: [{ name: 'Listening Slides', type: 'slides', url: 'https://slides.com/listening' }],
            materials: [{ name: 'Listening Exercises', type: 'pdf', url: 'https://listening.com/exercises' }],
            steps: [{ id: 'cs3', title: 'Listening', content: 'Active listening', type: 'learn' as const, duration: 5 }]
          }
        ]
      },
      {
        id: 'm11',
        title: 'Interpersonal Communication',
        content: [{ id: 'c11', type: 'text', content: '<h3>Empathy, Feedback & Conflict Resolution</h3><p>Building relationships.</p>' }],
        order: 2,
        estimatedTime: 96,
        lessons: [
          {
            id: 'comm-l4',
            title: 'Empathy',
            description: 'Understanding others',
            duration: 32,
            videoUrl: 'https://www.youtube.com/watch?v=empathy',
            slides: [{ name: 'Empathy Slides', type: 'slides', url: 'https://slides.com/empathy' }],
            materials: [{ name: 'Empathy Guide', type: 'pdf', url: 'https://empathy.com/guide' }],
            steps: [{ id: 'cs4', title: 'Empathy', content: 'Empathetic communication', type: 'learn' as const, duration: 5 }]
          },
          {
            id: 'comm-l5',
            title: 'Giving Feedback',
            description: 'Constructive feedback techniques',
            duration: 32,
            videoUrl: 'https://www.youtube.com/watch?v=feedback',
            slides: [{ name: 'Feedback Slides', type: 'slides', url: 'https://slides.com/feedback' }],
            materials: [{ name: 'Feedback Roleplay', type: 'doc', url: 'https://roleplay.com/feedback' }],
            steps: [{ id: 'cs5', title: 'Feedback', content: 'Giving feedback', type: 'learn' as const, duration: 5 }]
          },
          {
            id: 'comm-l6',
            title: 'Conflict Resolution',
            description: 'Resolving disagreements',
            duration: 32,
            videoUrl: 'https://www.youtube.com/watch?v=conflict',
            slides: [{ name: 'Conflict Slides', type: 'slides', url: 'https://slides.com/conflict' }],
            materials: [{ name: 'Conflict Guide', type: 'pdf', url: 'https://conflict.com/guide' }],
            steps: [{ id: 'cs6', title: 'Conflict', content: 'Resolving conflicts', type: 'learn' as const, duration: 5 }]
          }
        ]
      },
      {
        id: 'm12',
        title: 'Professional Communication',
        content: [{ id: 'c12', type: 'text', content: '<h3>Emails, Meetings & Presentations</h3><p>Workplace communication.</p>' }],
        order: 3,
        estimatedTime: 96,
        lessons: [
          {
            id: 'comm-l7',
            title: 'Email Writing',
            description: 'Professional email communication',
            duration: 32,
            videoUrl: 'https://www.youtube.com/watch?v=email',
            slides: [{ name: 'Email Slides', type: 'slides', url: 'https://slides.com/email' }],
            materials: [{ name: 'Email Templates', type: 'doc', url: 'https://templates.com/email' }],
            steps: [{ id: 'cs7', title: 'Email', content: 'Writing emails', type: 'learn' as const, duration: 5 }]
          },
          {
            id: 'comm-l8',
            title: 'Meeting Skills',
            description: 'Effective meeting participation',
            duration: 32,
            videoUrl: 'https://www.youtube.com/watch?v=meetings',
            slides: [{ name: 'Meeting Slides', type: 'slides', url: 'https://slides.com/meetings' }],
            materials: [{ name: 'Meeting Guide', type: 'pdf', url: 'https://meetings.com/guide' }],
            steps: [{ id: 'cs8', title: 'Meetings', content: 'Meeting etiquette', type: 'learn' as const, duration: 5 }]
          },
          {
            id: 'comm-l9',
            title: 'Presentations',
            description: 'Delivering presentations',
            duration: 32,
            videoUrl: 'https://www.youtube.com/watch?v=presentations',
            slides: [{ name: 'Presentation Slides', type: 'slides', url: 'https://slides.com/presentations' }],
            materials: [{ name: 'Presentation Guide', type: 'pdf', url: 'https://presentations.com/guide' }],
            steps: [{ id: 'cs9', title: 'Presentations', content: 'Presenting effectively', type: 'learn' as const, duration: 5 }]
          }
        ]
      },
      {
        id: 'm13',
        title: 'Public Speaking',
        content: [{ id: 'c13', type: 'text', content: '<h3>Techniques & Confidence Building</h3><p>Speaking to audiences.</p>' }],
        order: 4,
        estimatedTime: 96,
        lessons: [
          {
            id: 'comm-l10',
            title: 'Speaking Techniques',
            description: 'Public speaking fundamentals',
            duration: 48,
            videoUrl: 'https://www.youtube.com/watch?v=speaking-tech',
            slides: [{ name: 'Speaking Slides', type: 'slides', url: 'https://slides.com/speaking' }],
            materials: [{ name: 'Speaking Exercises', type: 'pdf', url: 'https://speaking.com/exercises' }],
            steps: [{ id: 'cs10', title: 'Speaking', content: 'Public speaking', type: 'learn' as const, duration: 5 }]
          },
          {
            id: 'comm-l11',
            title: 'Building Confidence',
            description: 'Overcoming speaking anxiety',
            duration: 48,
            videoUrl: 'https://www.youtube.com/watch?v=confidence',
            slides: [{ name: 'Confidence Slides', type: 'slides', url: 'https://slides.com/confidence' }],
            materials: [{ name: 'Confidence Guide', type: 'pdf', url: 'https://confidence.com/guide' }],
            steps: [{ id: 'cs11', title: 'Confidence', content: 'Building confidence', type: 'learn' as const, duration: 5 }]
          }
        ]
      },
      {
        id: 'm14',
        title: 'Final Project',
        content: [{ id: 'c14', type: 'text', content: '<h3>Practice Scenario & Evaluation</h3><p>Apply all skills.</p>' }],
        order: 5,
        estimatedTime: 96,
        lessons: [
          {
            id: 'comm-l12',
            title: 'Communication Project',
            description: 'Demonstrate all communication skills',
            duration: 96,
            videoUrl: 'https://www.youtube.com/watch?v=comm-project',
            slides: [{ name: 'Project Slides', type: 'slides', url: 'https://slides.com/comm-project' }],
            materials: [{ name: 'Project Worksheet', type: 'doc', url: 'https://worksheet.com/comm' }],
            steps: [{ id: 'cs12', title: 'Project', content: 'Final communication project', type: 'learn' as const, duration: 10 }]
          }
        ]
      }
    ],
    duration: 8,
    difficulty: 'beginner',
    accessibilityFeatures: ['captions', 'transcripts', 'sign-language'],
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-05'),
  },
  {
    id: '5',
    title: 'Mobile App Development',
    description: 'Build mobile applications using modern frameworks and tools. Includes accessibility best practices.',
    category: CourseCategory.TECHNOLOGY,
    instructorId: 'mentor1',
    learningOutcomes: [
      'Build mobile apps with Flutter/React Native',
      'Design responsive mobile UIs',
      'Handle data and state management',
      'Implement mobile accessibility',
      'Deploy apps to app stores'
    ],
    resources: [
      { name: 'Flutter Documentation', type: 'pdf', url: 'https://flutter.dev/docs', description: 'Official Flutter docs' },
      { name: 'React Native Guide', type: 'pdf', url: 'https://reactnative.dev/docs', description: 'React Native documentation' },
      { name: 'Mobile Dev Videos', type: 'video', url: 'https://www.youtube.com/mobile-dev', description: 'Video tutorials' }
    ],
    externalLinks: [
      { name: 'Flutter.dev', url: 'https://flutter.dev/', description: 'Flutter framework' },
      { name: 'React Native', url: 'https://reactnative.dev/', description: 'React Native framework' },
      { name: 'Mobile Dev Weekly', url: 'https://mobiledevweekly.com/', description: 'Mobile development news' }
    ],
    modules: [
      {
        id: 'm6',
        title: 'Mobile App Basics & Frameworks',
        content: [{ id: 'c6', type: 'text', content: '<h3>Flutter/React Native Introduction</h3><p>Build mobile apps.</p>' }],
        order: 1,
        estimatedTime: 180,
        lessons: [
          {
            id: 'mobile-l1',
            title: 'Mobile Development Intro',
            description: 'Introduction to mobile app development',
            duration: 45,
            videoUrl: 'https://www.youtube.com/watch?v=mobile-intro',
            slides: [{ name: 'Mobile Intro Slides', type: 'slides', url: 'https://slides.com/mobile-intro' }],
            materials: [{ name: 'Setup Guide', type: 'pdf', url: 'https://setup.com/mobile' }],
            externalLinks: [{ name: 'Flutter Tutorial', url: 'https://flutter.dev/learn' }],
            steps: [{ id: 'ms1', title: 'Mobile Intro', content: 'Mobile development basics', type: 'learn' as const, duration: 5 }]
          },
          {
            id: 'mobile-l2',
            title: 'Building UI',
            description: 'Creating mobile user interfaces',
            duration: 60,
            videoUrl: 'https://www.youtube.com/watch?v=mobile-ui',
            slides: [{ name: 'UI Slides', type: 'slides', url: 'https://slides.com/mobile-ui' }],
            materials: [{ name: 'UI Components', type: 'code', url: 'https://github.com/ui-components' }],
            externalLinks: [{ name: 'UI Design Patterns', url: 'https://patterns.com/mobile' }],
            steps: [{ id: 'ms2', title: 'UI', content: 'Building interfaces', type: 'learn' as const, duration: 5 }]
          },
          {
            id: 'mobile-l3',
            title: 'Handling Data',
            description: 'Data management in mobile apps',
            duration: 75,
            videoUrl: 'https://www.youtube.com/watch?v=mobile-data',
            slides: [{ name: 'Data Slides', type: 'slides', url: 'https://slides.com/data' }],
            materials: [{ name: 'Data Examples', type: 'code', url: 'https://github.com/data-examples' }],
            externalLinks: [{ name: 'State Management', url: 'https://state.com/mobile' }],
            steps: [{ id: 'ms3', title: 'Data', content: 'Managing data', type: 'learn' as const, duration: 5 }]
          }
        ]
      },
      {
        id: 'm18',
        title: 'Navigation & Routing',
        content: [{ id: 'c18', type: 'text', content: '<h3>App Navigation</h3><p>Navigate between screens.</p>' }],
        order: 2,
        estimatedTime: 120,
        lessons: [
          {
            id: 'mobile-l4',
            title: 'Navigation Basics',
            description: 'Screen navigation',
            duration: 60,
            videoUrl: 'https://www.youtube.com/watch?v=navigation',
            slides: [{ name: 'Navigation Slides', type: 'slides', url: 'https://slides.com/navigation' }],
            materials: [{ name: 'Navigation Code', type: 'code', url: 'https://github.com/navigation' }],
            steps: [{ id: 'ms4', title: 'Navigation', content: 'App navigation', type: 'learn' as const, duration: 5 }]
          },
          {
            id: 'mobile-l5',
            title: 'Advanced Routing',
            description: 'Complex navigation patterns',
            duration: 60,
            videoUrl: 'https://www.youtube.com/watch?v=routing',
            slides: [{ name: 'Routing Slides', type: 'slides', url: 'https://slides.com/routing' }],
            materials: [{ name: 'Routing Examples', type: 'code', url: 'https://github.com/routing' }],
            steps: [{ id: 'ms5', title: 'Routing', content: 'Advanced routing', type: 'learn' as const, duration: 5 }]
          }
        ]
      },
      {
        id: 'm19',
        title: 'API Integration',
        content: [{ id: 'c19', type: 'text', content: '<h3>Connecting to APIs</h3><p>Fetch and send data.</p>' }],
        order: 3,
        estimatedTime: 150,
        lessons: [
          {
            id: 'mobile-l6',
            title: 'REST APIs',
            description: 'Working with REST APIs',
            duration: 75,
            videoUrl: 'https://www.youtube.com/watch?v=rest-api',
            slides: [{ name: 'API Slides', type: 'slides', url: 'https://slides.com/api' }],
            materials: [{ name: 'API Code', type: 'code', url: 'https://github.com/api-examples' }],
            steps: [{ id: 'ms6', title: 'APIs', content: 'REST API integration', type: 'learn' as const, duration: 5 }]
          },
          {
            id: 'mobile-l7',
            title: 'Data Persistence',
            description: 'Local data storage',
            duration: 75,
            videoUrl: 'https://www.youtube.com/watch?v=persistence',
            slides: [{ name: 'Storage Slides', type: 'slides', url: 'https://slides.com/storage' }],
            materials: [{ name: 'Storage Examples', type: 'code', url: 'https://github.com/storage' }],
            steps: [{ id: 'ms7', title: 'Storage', content: 'Data persistence', type: 'learn' as const, duration: 5 }]
          }
        ]
      },
      {
        id: 'm20',
        title: 'Testing & Debugging',
        content: [{ id: 'c20', type: 'text', content: '<h3>App Testing</h3><p>Test and debug apps.</p>' }],
        order: 4,
        estimatedTime: 120,
        lessons: [
          {
            id: 'mobile-l8',
            title: 'Unit Testing',
            description: 'Testing app components',
            duration: 60,
            videoUrl: 'https://www.youtube.com/watch?v=testing',
            slides: [{ name: 'Testing Slides', type: 'slides', url: 'https://slides.com/testing' }],
            materials: [{ name: 'Test Examples', type: 'code', url: 'https://github.com/tests' }],
            steps: [{ id: 'ms8', title: 'Testing', content: 'Unit testing', type: 'learn' as const, duration: 5 }]
          },
          {
            id: 'mobile-l9',
            title: 'Debugging',
            description: 'Finding and fixing bugs',
            duration: 60,
            videoUrl: 'https://www.youtube.com/watch?v=debugging',
            slides: [{ name: 'Debug Slides', type: 'slides', url: 'https://slides.com/debug' }],
            materials: [{ name: 'Debug Guide', type: 'pdf', url: 'https://debug.com/guide' }],
            steps: [{ id: 'ms9', title: 'Debug', content: 'Debugging techniques', type: 'learn' as const, duration: 5 }]
          }
        ]
      },
      {
        id: 'm21',
        title: 'Deployment',
        content: [{ id: 'c21', type: 'text', content: '<h3>Publishing Apps</h3><p>Deploy to app stores.</p>' }],
        order: 5,
        estimatedTime: 90,
        lessons: [
          {
            id: 'mobile-l10',
            title: 'App Store Deployment',
            description: 'Publishing to iOS App Store',
            duration: 45,
            videoUrl: 'https://www.youtube.com/watch?v=ios-deploy',
            slides: [{ name: 'iOS Deploy Slides', type: 'slides', url: 'https://slides.com/ios' }],
            materials: [{ name: 'iOS Guide', type: 'pdf', url: 'https://ios-deploy.com/guide' }],
            steps: [{ id: 'ms10', title: 'iOS', content: 'iOS deployment', type: 'learn' as const, duration: 5 }]
          },
          {
            id: 'mobile-l11',
            title: 'Play Store Deployment',
            description: 'Publishing to Google Play',
            duration: 45,
            videoUrl: 'https://www.youtube.com/watch?v=android-deploy',
            slides: [{ name: 'Android Deploy Slides', type: 'slides', url: 'https://slides.com/android' }],
            materials: [{ name: 'Android Guide', type: 'pdf', url: 'https://android-deploy.com/guide' }],
            steps: [{ id: 'ms11', title: 'Android', content: 'Android deployment', type: 'learn' as const, duration: 5 }]
          }
        ]
      },
      {
        id: 'm22',
        title: 'Final Project',
        content: [{ id: 'c22', type: 'text', content: '<h3>Build Complete App</h3><p>Create a full mobile app.</p>' }],
        order: 6,
        estimatedTime: 240,
        lessons: [
          {
            id: 'mobile-l12',
            title: 'Mobile App Project',
            description: 'Build a complete mobile application',
            duration: 240,
            videoUrl: 'https://www.youtube.com/watch?v=mobile-project',
            slides: [{ name: 'Project Slides', type: 'slides', url: 'https://slides.com/mobile-project' }],
            materials: [{ name: 'Project Template', type: 'code', url: 'https://github.com/mobile-project' }],
            steps: [{ id: 'ms12', title: 'Project', content: 'Final mobile app project', type: 'learn' as const, duration: 10 }]
          }
        ]
      }
    ],
    duration: 15,
    difficulty: 'advanced',
    accessibilityFeatures: ['screen-reader', 'captions', 'text-to-speech'],
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-03-15'),
  },
  {
    id: '6',
    title: 'Entrepreneurship & Business Skills',
    description: 'Transform your ideas into successful businesses. Learn planning, marketing, and financial management for sustainable entrepreneurship.',
    category: CourseCategory.SOFT_SKILLS,
    instructorId: 'mentor5',
    learningOutcomes: [
      'Create comprehensive business plans',
      'Develop effective marketing strategies',
      'Manage business finances',
      'Build customer relationships',
      'Scale your business sustainably'
    ],
    resources: [
      { name: 'Business Plan Template', type: 'doc', url: 'https://business-plan.com/template', description: 'Complete business plan template' },
      { name: 'Marketing Guide', type: 'pdf', url: 'https://marketing-guide.com/pdf', description: 'Small business marketing' },
      { name: 'Financial Management Videos', type: 'video', url: 'https://www.youtube.com/business-finance', description: 'Finance basics' }
    ],
    externalLinks: [
      { name: 'Small Business Admin', url: 'https://www.sba.gov/', description: 'Business resources' },
      { name: 'Entrepreneur.com', url: 'https://www.entrepreneur.com/', description: 'Business advice' },
      { name: 'SCORE', url: 'https://www.score.org/', description: 'Free business mentoring' }
    ],
    modules: [
      {
        id: 'm13',
        title: 'Idea Generation & Validation',
        content: [{ id: 'c13', type: 'text', content: '<h3>Brainstorming & Market Research</h3><p>Validate business ideas.</p>' }],
        order: 1,
        estimatedTime: 180,
        lessons: [
          {
            id: 'biz-l1',
            title: 'Idea Generation',
            description: 'Brainstorming business ideas',
            duration: 60,
            videoUrl: 'https://www.youtube.com/watch?v=ideas',
            slides: [{ name: 'Ideas Slides', type: 'slides', url: 'https://slides.com/ideas' }],
            materials: [{ name: 'Brainstorm Template', type: 'doc', url: 'https://templates.com/brainstorm' }],
            steps: [{ id: 'bs1', title: 'Ideas', content: 'Generating ideas', type: 'learn' as const, duration: 5 }]
          },
          {
            id: 'biz-l2',
            title: 'Market Research',
            description: 'Researching your market',
            duration: 90,
            videoUrl: 'https://www.youtube.com/watch?v=market-research',
            slides: [{ name: 'Research Slides', type: 'slides', url: 'https://slides.com/research' }],
            materials: [{ name: 'Research Template', type: 'doc', url: 'https://templates.com/research' }],
            steps: [{ id: 'bs2', title: 'Research', content: 'Market research', type: 'learn' as const, duration: 5 }]
          },
          {
            id: 'biz-l3',
            title: 'Validation',
            description: 'Validating your business idea',
            duration: 30,
            videoUrl: 'https://www.youtube.com/watch?v=validation',
            slides: [{ name: 'Validation Slides', type: 'slides', url: 'https://slides.com/validation' }],
            materials: [{ name: 'Validation Checklist', type: 'pdf', url: 'https://validation.com/checklist' }],
            steps: [{ id: 'bs3', title: 'Validation', content: 'Idea validation', type: 'learn' as const, duration: 5 }]
          }
        ]
      },
      {
        id: 'm14',
        title: 'Business Planning',
        content: [{ id: 'c14', type: 'text', content: '<h3>Plans, Goals & Strategies</h3><p>Create business plans.</p>' }],
        order: 2,
        estimatedTime: 180,
        lessons: [
          {
            id: 'biz-l4',
            title: 'Business Plans',
            description: 'Writing a business plan',
            duration: 90,
            videoUrl: 'https://www.youtube.com/watch?v=business-plan',
            slides: [{ name: 'Plan Slides', type: 'slides', url: 'https://slides.com/plan' }],
            materials: [{ name: 'Business Plan Guide', type: 'pdf', url: 'https://plan.com/guide' }],
            steps: [{ id: 'bs4', title: 'Plans', content: 'Business planning', type: 'learn' as const, duration: 5 }]
          },
          {
            id: 'biz-l5',
            title: 'Setting Goals',
            description: 'Business goal setting',
            duration: 45,
            videoUrl: 'https://www.youtube.com/watch?v=goals',
            slides: [{ name: 'Goals Slides', type: 'slides', url: 'https://slides.com/goals' }],
            materials: [{ name: 'Goal Template', type: 'doc', url: 'https://templates.com/goals' }],
            steps: [{ id: 'bs5', title: 'Goals', content: 'Setting goals', type: 'learn' as const, duration: 5 }]
          },
          {
            id: 'biz-l6',
            title: 'Strategy Development',
            description: 'Creating business strategies',
            duration: 45,
            videoUrl: 'https://www.youtube.com/watch?v=strategy',
            slides: [{ name: 'Strategy Slides', type: 'slides', url: 'https://slides.com/strategy' }],
            materials: [{ name: 'Strategy Guide', type: 'pdf', url: 'https://strategy.com/guide' }],
            steps: [{ id: 'bs6', title: 'Strategy', content: 'Business strategy', type: 'learn' as const, duration: 5 }]
          }
        ]
      },
      {
        id: 'm15',
        title: 'Marketing & Sales',
        content: [{ id: 'c15', type: 'text', content: '<h3>Branding, Promotion & Customer Acquisition</h3><p>Market your business.</p>' }],
        order: 3,
        estimatedTime: 180,
        lessons: [
          {
            id: 'biz-l7',
            title: 'Branding',
            description: 'Building your brand',
            duration: 60,
            videoUrl: 'https://www.youtube.com/watch?v=branding',
            slides: [{ name: 'Brand Slides', type: 'slides', url: 'https://slides.com/branding' }],
            materials: [{ name: 'Brand Guide', type: 'pdf', url: 'https://branding.com/guide' }],
            externalLinks: [{ name: 'Branding Resources', url: 'https://branding.com/resources' }],
            steps: [{ id: 'bs7', title: 'Branding', content: 'Brand development', type: 'learn' as const, duration: 5 }]
          },
          {
            id: 'biz-l8',
            title: 'Promotion',
            description: 'Promoting your business',
            duration: 60,
            videoUrl: 'https://www.youtube.com/watch?v=promotion',
            slides: [{ name: 'Promotion Slides', type: 'slides', url: 'https://slides.com/promotion' }],
            materials: [{ name: 'Promotion Guide', type: 'pdf', url: 'https://promotion.com/guide' }],
            externalLinks: [{ name: 'Marketing Tools', url: 'https://marketing.com/tools' }],
            steps: [{ id: 'bs8', title: 'Promotion', content: 'Business promotion', type: 'learn' as const, duration: 5 }]
          },
          {
            id: 'biz-l9',
            title: 'Customer Acquisition',
            description: 'Getting customers',
            duration: 60,
            videoUrl: 'https://www.youtube.com/watch?v=customers',
            slides: [{ name: 'Customer Slides', type: 'slides', url: 'https://slides.com/customers' }],
            materials: [{ name: 'Acquisition Guide', type: 'pdf', url: 'https://acquisition.com/guide' }],
            externalLinks: [{ name: 'Sales Tips', url: 'https://sales.com/tips' }],
            steps: [{ id: 'bs9', title: 'Customers', content: 'Acquiring customers', type: 'learn' as const, duration: 5 }]
          }
        ]
      },
      {
        id: 'm16',
        title: 'Financial Management',
        content: [{ id: 'c16', type: 'text', content: '<h3>Budgeting & Accounting Basics</h3><p>Manage finances.</p>' }],
        order: 4,
        estimatedTime: 180,
        lessons: [
          {
            id: 'biz-l10',
            title: 'Budgeting',
            description: 'Creating budgets',
            duration: 60,
            videoUrl: 'https://www.youtube.com/watch?v=budgeting',
            slides: [{ name: 'Budget Slides', type: 'slides', url: 'https://slides.com/budget' }],
            materials: [{ name: 'Budget Worksheet', type: 'doc', url: 'https://worksheets.com/budget' }],
            steps: [{ id: 'bs10', title: 'Budgeting', content: 'Business budgeting', type: 'learn' as const, duration: 5 }]
          },
          {
            id: 'biz-l11',
            title: 'Accounting Basics',
            description: 'Basic accounting principles',
            duration: 90,
            videoUrl: 'https://www.youtube.com/watch?v=accounting',
            slides: [{ name: 'Accounting Slides', type: 'slides', url: 'https://slides.com/accounting' }],
            materials: [{ name: 'Accounting Guide', type: 'pdf', url: 'https://accounting.com/guide' }],
            steps: [{ id: 'bs11', title: 'Accounting', content: 'Accounting basics', type: 'learn' as const, duration: 5 }]
          },
          {
            id: 'biz-l12',
            title: 'Financial Planning',
            description: 'Planning finances',
            duration: 30,
            videoUrl: 'https://www.youtube.com/watch?v=financial-planning',
            slides: [{ name: 'Finance Slides', type: 'slides', url: 'https://slides.com/finance' }],
            materials: [{ name: 'Finance Worksheet', type: 'doc', url: 'https://worksheets.com/finance' }],
            steps: [{ id: 'bs12', title: 'Finance', content: 'Financial planning', type: 'learn' as const, duration: 5 }]
          }
        ]
      },
      {
        id: 'm17',
        title: 'Launch & Growth',
        content: [{ id: 'c17', type: 'text', content: '<h3>Pitching, Scaling & Operations</h3><p>Launch and grow.</p>' }],
        order: 5,
        estimatedTime: 180,
        lessons: [
          {
            id: 'biz-l13',
            title: 'Pitching',
            description: 'Pitching your business',
            duration: 60,
            videoUrl: 'https://www.youtube.com/watch?v=pitching',
            slides: [{ name: 'Pitch Slides', type: 'slides', url: 'https://slides.com/pitch' }],
            materials: [{ name: 'Pitch Template', type: 'doc', url: 'https://templates.com/pitch' }],
            steps: [{ id: 'bs13', title: 'Pitching', content: 'Business pitching', type: 'learn' as const, duration: 5 }]
          },
          {
            id: 'biz-l14',
            title: 'Scaling',
            description: 'Growing your business',
            duration: 60,
            videoUrl: 'https://www.youtube.com/watch?v=scaling',
            slides: [{ name: 'Scaling Slides', type: 'slides', url: 'https://slides.com/scaling' }],
            materials: [{ name: 'Growth Guide', type: 'pdf', url: 'https://growth.com/guide' }],
            steps: [{ id: 'bs14', title: 'Scaling', content: 'Business scaling', type: 'learn' as const, duration: 5 }]
          },
          {
            id: 'biz-l15',
            title: 'Operations',
            description: 'Managing operations',
            duration: 60,
            videoUrl: 'https://www.youtube.com/watch?v=operations',
            slides: [{ name: 'Operations Slides', type: 'slides', url: 'https://slides.com/operations' }],
            materials: [{ name: 'Operations Guide', type: 'pdf', url: 'https://operations.com/guide' }],
            steps: [{ id: 'bs15', title: 'Operations', content: 'Business operations', type: 'learn' as const, duration: 5 }]
          }
        ]
      }
    ],
    duration: 15,
    difficulty: 'intermediate',
    accessibilityFeatures: ['screen-reader', 'captions', 'simplified-ui'],
    createdAt: new Date('2024-03-20'),
    updatedAt: new Date('2024-03-25'),
  },
  {
    id: '7',
    title: 'Data Analysis & Excel Skills',
    description: 'Master data analysis using Excel and other tools. Perfect for administrative roles and business intelligence.',
    category: CourseCategory.TECHNOLOGY,
    instructorId: 'mentor6',
    learningOutcomes: [
      'Master Excel formulas and functions',
      'Create pivot tables and charts',
      'Analyze and visualize data',
      'Build interactive dashboards',
      'Apply data analysis techniques'
    ],
    resources: [
      { name: 'Excel Guide', type: 'pdf', url: 'https://excel-guide.com/pdf', description: 'Complete Excel reference' },
      { name: 'Data Analysis Videos', type: 'video', url: 'https://www.youtube.com/excel-analysis', description: 'Video tutorials' },
      { name: 'Sample Datasets', type: 'other', url: 'https://datasets.com/samples', description: 'Practice data files' }
    ],
    externalLinks: [
      { name: 'Excel Easy', url: 'https://www.excel-easy.com/', description: 'Excel tutorials' },
      { name: 'Chandoo.org', url: 'https://chandoo.org/', description: 'Excel tips and tricks' },
      { name: 'Excel Jet', url: 'https://exceljet.net/', description: 'Excel formulas' }
    ],
    modules: [
      {
        id: 'm16',
        title: 'Data Analysis with Excel',
        content: [{ id: 'c16', type: 'text', content: '<h3>Formulas, Pivot Tables, Charts & Data Visualization</h3><p>Analyze data with Excel.</p>' }],
        order: 1,
        estimatedTime: 216,
        lessons: [
          {
            id: 'excel-l1',
            title: 'Excel Basics',
            description: 'Introduction to Excel',
            duration: 36,
            videoUrl: 'https://www.youtube.com/watch?v=excel-basics',
            slides: [{ name: 'Excel Basics Slides', type: 'slides', url: 'https://slides.com/excel-basics' }],
            materials: [{ name: 'Excel Cheat Sheet', type: 'pdf', url: 'https://cheatsheet.com/excel' }],
            externalLinks: [{ name: 'Excel Tutorial', url: 'https://www.excel-easy.com/' }],
            steps: [{ id: 'es1', title: 'Excel Intro', content: 'Excel fundamentals', type: 'learn' as const, duration: 5 }]
          },
          {
            id: 'excel-l2',
            title: 'Formulas & Functions',
            description: 'Excel formulas and functions',
            duration: 54,
            videoUrl: 'https://www.youtube.com/watch?v=formulas',
            slides: [{ name: 'Formulas Slides', type: 'slides', url: 'https://slides.com/formulas' }],
            materials: [{ name: 'Formula Guide', type: 'pdf', url: 'https://formulas.com/guide' }],
            externalLinks: [{ name: 'Formula Reference', url: 'https://exceljet.net/formulas' }],
            steps: [{ id: 'es2', title: 'Formulas', content: 'Excel formulas', type: 'learn' as const, duration: 5 }]
          },
          {
            id: 'excel-l3',
            title: 'Pivot Tables',
            description: 'Creating pivot tables',
            duration: 54,
            videoUrl: 'https://www.youtube.com/watch?v=pivot-tables',
            slides: [{ name: 'Pivot Slides', type: 'slides', url: 'https://slides.com/pivot' }],
            materials: [{ name: 'Pivot Guide', type: 'pdf', url: 'https://pivot.com/guide' }, { name: 'Sample Data', type: 'other', url: 'https://data.com/samples' }],
            externalLinks: [{ name: 'Pivot Tutorial', url: 'https://chandoo.org/pivot' }],
            steps: [{ id: 'es3', title: 'Pivot', content: 'Pivot tables', type: 'learn' as const, duration: 5 }]
          },
          {
            id: 'excel-l4',
            title: 'Charts & Graphs',
            description: 'Data visualization',
            duration: 36,
            videoUrl: 'https://www.youtube.com/watch?v=charts',
            slides: [{ name: 'Charts Slides', type: 'slides', url: 'https://slides.com/charts' }],
            materials: [{ name: 'Chart Guide', type: 'pdf', url: 'https://charts.com/guide' }],
            externalLinks: [{ name: 'Chart Types', url: 'https://excel-easy.com/charts' }],
            steps: [{ id: 'es4', title: 'Charts', content: 'Creating charts', type: 'learn' as const, duration: 5 }]
          },
          {
            id: 'excel-l5',
            title: 'Data Visualization',
            description: 'Advanced visualization techniques',
            duration: 36,
            videoUrl: 'https://www.youtube.com/watch?v=visualization',
            slides: [{ name: 'Visualization Slides', type: 'slides', url: 'https://slides.com/visualization' }],
            materials: [{ name: 'Dashboard Template', type: 'other', url: 'https://templates.com/dashboard' }],
            externalLinks: [{ name: 'Dashboard Examples', url: 'https://chandoo.org/dashboards' }],
            steps: [{ id: 'es5', title: 'Visualization', content: 'Data visualization', type: 'learn' as const, duration: 5 }]
          }
        ]
      },
      {
        id: 'm23',
        title: 'Advanced Excel',
        content: [{ id: 'c23', type: 'text', content: '<h3>Advanced Functions & Macros</h3><p>Advanced Excel skills.</p>' }],
        order: 2,
        estimatedTime: 144,
        lessons: [
          {
            id: 'excel-l6',
            title: 'Advanced Functions',
            description: 'Complex Excel functions',
            duration: 72,
            videoUrl: 'https://www.youtube.com/watch?v=advanced-functions',
            slides: [{ name: 'Advanced Slides', type: 'slides', url: 'https://slides.com/advanced' }],
            materials: [{ name: 'Advanced Guide', type: 'pdf', url: 'https://advanced.com/guide' }],
            steps: [{ id: 'es6', title: 'Advanced', content: 'Advanced functions', type: 'learn' as const, duration: 5 }]
          },
          {
            id: 'excel-l7',
            title: 'Macros & Automation',
            description: 'Automating tasks with macros',
            duration: 72,
            videoUrl: 'https://www.youtube.com/watch?v=macros',
            slides: [{ name: 'Macros Slides', type: 'slides', url: 'https://slides.com/macros' }],
            materials: [{ name: 'Macro Examples', type: 'code', url: 'https://macros.com/examples' }],
            steps: [{ id: 'es7', title: 'Macros', content: 'Excel macros', type: 'learn' as const, duration: 5 }]
          }
        ]
      },
      {
        id: 'm24',
        title: 'Data Analysis Techniques',
        content: [{ id: 'c24', type: 'text', content: '<h3>Statistical Analysis</h3><p>Analyze data statistically.</p>' }],
        order: 3,
        estimatedTime: 180,
        lessons: [
          {
            id: 'excel-l8',
            title: 'Descriptive Statistics',
            description: 'Basic statistical analysis',
            duration: 90,
            videoUrl: 'https://www.youtube.com/watch?v=statistics',
            slides: [{ name: 'Stats Slides', type: 'slides', url: 'https://slides.com/stats' }],
            materials: [{ name: 'Stats Guide', type: 'pdf', url: 'https://stats.com/guide' }],
            steps: [{ id: 'es8', title: 'Statistics', content: 'Statistical analysis', type: 'learn' as const, duration: 5 }]
          },
          {
            id: 'excel-l9',
            title: 'Data Cleaning',
            description: 'Preparing data for analysis',
            duration: 90,
            videoUrl: 'https://www.youtube.com/watch?v=data-cleaning',
            slides: [{ name: 'Cleaning Slides', type: 'slides', url: 'https://slides.com/cleaning' }],
            materials: [{ name: 'Cleaning Guide', type: 'pdf', url: 'https://cleaning.com/guide' }],
            steps: [{ id: 'es9', title: 'Cleaning', content: 'Data cleaning', type: 'learn' as const, duration: 5 }]
          }
        ]
      },
      {
        id: 'm25',
        title: 'Business Intelligence',
        content: [{ id: 'c25', type: 'text', content: '<h3>Dashboards & Reports</h3><p>Create business reports.</p>' }],
        order: 4,
        estimatedTime: 180,
        lessons: [
          {
            id: 'excel-l10',
            title: 'Dashboard Design',
            description: 'Creating interactive dashboards',
            duration: 90,
            videoUrl: 'https://www.youtube.com/watch?v=dashboards',
            slides: [{ name: 'Dashboard Slides', type: 'slides', url: 'https://slides.com/dashboards' }],
            materials: [{ name: 'Dashboard Templates', type: 'other', url: 'https://templates.com/dashboards' }],
            steps: [{ id: 'es10', title: 'Dashboards', content: 'Dashboard creation', type: 'learn' as const, duration: 5 }]
          },
          {
            id: 'excel-l11',
            title: 'Report Generation',
            description: 'Creating business reports',
            duration: 90,
            videoUrl: 'https://www.youtube.com/watch?v=reports',
            slides: [{ name: 'Reports Slides', type: 'slides', url: 'https://slides.com/reports' }],
            materials: [{ name: 'Report Templates', type: 'doc', url: 'https://templates.com/reports' }],
            steps: [{ id: 'es11', title: 'Reports', content: 'Business reports', type: 'learn' as const, duration: 5 }]
          }
        ]
      },
      {
        id: 'm26',
        title: 'Final Project',
        content: [{ id: 'c26', type: 'text', content: '<h3>Complete Data Analysis Project</h3><p>Analyze real data.</p>' }],
        order: 5,
        estimatedTime: 360,
        lessons: [
          {
            id: 'excel-l12',
            title: 'Data Analysis Project',
            description: 'Complete data analysis project',
            duration: 360,
            videoUrl: 'https://www.youtube.com/watch?v=excel-project',
            slides: [{ name: 'Project Slides', type: 'slides', url: 'https://slides.com/excel-project' }],
            materials: [{ name: 'Project Dataset', type: 'other', url: 'https://datasets.com/project' }],
            steps: [{ id: 'es12', title: 'Project', content: 'Final analysis project', type: 'learn' as const, duration: 10 }]
          }
        ]
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
    learningOutcomes: [
      'Communicate professionally with customers',
      'Handle complaints effectively',
      'Demonstrate empathy and problem-solving',
      'Maintain professional service standards',
      'Build customer loyalty'
    ],
    resources: [
      { name: 'Customer Service Guide', type: 'pdf', url: 'https://service-guide.com/pdf', description: 'Complete service guide' },
      { name: 'Service Videos', type: 'video', url: 'https://www.youtube.com/customer-service', description: 'Service training videos' },
      { name: 'Roleplay Scenarios', type: 'doc', url: 'https://scenarios.com/roleplay', description: 'Practice scenarios' }
    ],
    externalLinks: [
      { name: 'Service Quality Institute', url: 'https://www.customer-service.com/', description: 'Service resources' },
      { name: 'Help Scout Blog', url: 'https://www.helpscout.com/blog/', description: 'Service tips' },
      { name: 'Customer Service Zone', url: 'https://www.customerservicezone.com/', description: 'Service training' }
    ],
    modules: [
      {
        id: 'm17',
        title: 'Customer Service Fundamentals',
        content: [{ id: 'c17', type: 'text', content: '<h3>Communication, Empathy & Problem-Solving</h3><p>Service fundamentals.</p>' }],
        order: 1,
        estimatedTime: 120,
        lessons: [
          {
            id: 'service-l1',
            title: 'Communication Skills',
            description: 'Professional customer communication',
            duration: 40,
            videoUrl: 'https://www.youtube.com/watch?v=service-comm',
            slides: [{ name: 'Communication Slides', type: 'slides', url: 'https://slides.com/service-comm' }],
            materials: [{ name: 'Communication Guide', type: 'pdf', url: 'https://comm.com/service' }],
            steps: [{ id: 'ss1', title: 'Communication', content: 'Customer communication', type: 'learn' as const, duration: 5 }]
          },
          {
            id: 'service-l2',
            title: 'Empathy',
            description: 'Understanding customer needs',
            duration: 40,
            videoUrl: 'https://www.youtube.com/watch?v=empathy-service',
            slides: [{ name: 'Empathy Slides', type: 'slides', url: 'https://slides.com/empathy-service' }],
            materials: [{ name: 'Empathy Exercises', type: 'pdf', url: 'https://exercises.com/empathy' }],
            steps: [{ id: 'ss2', title: 'Empathy', content: 'Customer empathy', type: 'learn' as const, duration: 5 }]
          },
          {
            id: 'service-l3',
            title: 'Problem-Solving',
            description: 'Resolving customer issues',
            duration: 40,
            videoUrl: 'https://www.youtube.com/watch?v=problem-solving',
            slides: [{ name: 'Problem-Solving Slides', type: 'slides', url: 'https://slides.com/problem-solving' }],
            materials: [{ name: 'Problem-Solving Guide', type: 'pdf', url: 'https://problem-solving.com/guide' }],
            steps: [{ id: 'ss3', title: 'Problem-Solving', content: 'Solving problems', type: 'learn' as const, duration: 5 }]
          }
        ]
      },
      {
        id: 'm27',
        title: 'Handling Complaints & Feedback',
        content: [{ id: 'c27', type: 'text', content: '<h3>Scenario Exercises & Roleplays</h3><p>Handle complaints.</p>' }],
        order: 2,
        estimatedTime: 120,
        lessons: [
          {
            id: 'service-l4',
            title: 'Complaint Handling',
            description: 'Managing customer complaints',
            duration: 60,
            videoUrl: 'https://www.youtube.com/watch?v=complaints',
            slides: [{ name: 'Complaints Slides', type: 'slides', url: 'https://slides.com/complaints' }],
            materials: [{ name: 'Complaint Scenarios', type: 'doc', url: 'https://scenarios.com/complaints' }],
            steps: [{ id: 'ss4', title: 'Complaints', content: 'Handling complaints', type: 'learn' as const, duration: 5 }]
          },
          {
            id: 'service-l5',
            title: 'Feedback Management',
            description: 'Receiving and acting on feedback',
            duration: 60,
            videoUrl: 'https://www.youtube.com/watch?v=feedback-service',
            slides: [{ name: 'Feedback Slides', type: 'slides', url: 'https://slides.com/feedback-service' }],
            materials: [{ name: 'Feedback Worksheet', type: 'doc', url: 'https://worksheets.com/feedback' }],
            steps: [{ id: 'ss5', title: 'Feedback', content: 'Managing feedback', type: 'learn' as const, duration: 5 }]
          }
        ]
      },
      {
        id: 'm28',
        title: 'Professionalism & Etiquette',
        content: [{ id: 'c28', type: 'text', content: '<h3>Behavior & Service Standards</h3><p>Professional standards.</p>' }],
        order: 3,
        estimatedTime: 120,
        lessons: [
          {
            id: 'service-l6',
            title: 'Professional Behavior',
            description: 'Maintaining professionalism',
            duration: 60,
            videoUrl: 'https://www.youtube.com/watch?v=professionalism',
            slides: [{ name: 'Professionalism Slides', type: 'slides', url: 'https://slides.com/professionalism' }],
            materials: [{ name: 'Behavior Guide', type: 'pdf', url: 'https://behavior.com/guide' }],
            steps: [{ id: 'ss6', title: 'Professionalism', content: 'Professional behavior', type: 'learn' as const, duration: 5 }]
          },
          {
            id: 'service-l7',
            title: 'Service Standards',
            description: 'Meeting service standards',
            duration: 60,
            videoUrl: 'https://www.youtube.com/watch?v=standards',
            slides: [{ name: 'Standards Slides', type: 'slides', url: 'https://slides.com/standards' }],
            materials: [{ name: 'Standards Checklist', type: 'pdf', url: 'https://standards.com/checklist' }],
            steps: [{ id: 'ss7', title: 'Standards', content: 'Service standards', type: 'learn' as const, duration: 5 }]
          }
        ]
      },
      {
        id: 'm29',
        title: 'Difficult Situations',
        content: [{ id: 'c29', type: 'text', content: '<h3>De-escalation & Conflict Resolution</h3><p>Handle difficult situations.</p>' }],
        order: 4,
        estimatedTime: 120,
        lessons: [
          {
            id: 'service-l8',
            title: 'De-escalation',
            description: 'Calming upset customers',
            duration: 60,
            videoUrl: 'https://www.youtube.com/watch?v=de-escalation',
            slides: [{ name: 'De-escalation Slides', type: 'slides', url: 'https://slides.com/de-escalation' }],
            materials: [{ name: 'De-escalation Guide', type: 'pdf', url: 'https://de-escalation.com/guide' }],
            steps: [{ id: 'ss8', title: 'De-escalation', content: 'De-escalation techniques', type: 'learn' as const, duration: 5 }]
          },
          {
            id: 'service-l9',
            title: 'Conflict Resolution',
            description: 'Resolving customer conflicts',
            duration: 60,
            videoUrl: 'https://www.youtube.com/watch?v=conflict-service',
            slides: [{ name: 'Conflict Slides', type: 'slides', url: 'https://slides.com/conflict-service' }],
            materials: [{ name: 'Conflict Guide', type: 'pdf', url: 'https://conflict-service.com/guide' }],
            steps: [{ id: 'ss9', title: 'Conflict', content: 'Conflict resolution', type: 'learn' as const, duration: 5 }]
          }
        ]
      },
      {
        id: 'm30',
        title: 'Building Loyalty',
        content: [{ id: 'c30', type: 'text', content: '<h3>Customer Retention & Relationships</h3><p>Build customer loyalty.</p>' }],
        order: 5,
        estimatedTime: 120,
        lessons: [
          {
            id: 'service-l10',
            title: 'Customer Retention',
            description: 'Keeping customers satisfied',
            duration: 60,
            videoUrl: 'https://www.youtube.com/watch?v=retention',
            slides: [{ name: 'Retention Slides', type: 'slides', url: 'https://slides.com/retention' }],
            materials: [{ name: 'Retention Strategies', type: 'pdf', url: 'https://retention.com/strategies' }],
            steps: [{ id: 'ss10', title: 'Retention', content: 'Customer retention', type: 'learn' as const, duration: 5 }]
          },
          {
            id: 'service-l11',
            title: 'Relationship Building',
            description: 'Building lasting relationships',
            duration: 60,
            videoUrl: 'https://www.youtube.com/watch?v=relationships',
            slides: [{ name: 'Relationships Slides', type: 'slides', url: 'https://slides.com/relationships' }],
            materials: [{ name: 'Relationship Guide', type: 'pdf', url: 'https://relationships.com/guide' }],
            steps: [{ id: 'ss11', title: 'Relationships', content: 'Building relationships', type: 'learn' as const, duration: 5 }]
          }
        ]
      },
      {
        id: 'm31',
        title: 'Final Assessment',
        content: [{ id: 'c31', type: 'text', content: '<h3>Service Excellence Project</h3><p>Demonstrate service skills.</p>' }],
        order: 6,
        estimatedTime: 120,
        lessons: [
          {
            id: 'service-l12',
            title: 'Service Project',
            description: 'Final customer service assessment',
            duration: 120,
            videoUrl: 'https://www.youtube.com/watch?v=service-project',
            slides: [{ name: 'Project Slides', type: 'slides', url: 'https://slides.com/service-project' }],
            materials: [{ name: 'Assessment Rubric', type: 'pdf', url: 'https://assessment.com/rubric' }],
            steps: [{ id: 'ss12', title: 'Project', content: 'Final service project', type: 'learn' as const, duration: 10 }]
          }
        ]
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
      // Try to fetch from API
      try {
        const { api } = await import('../services/api');
        const response = await api.get('/courses');
        const apiCourses = response.data || [];
        
        // Transform API courses to match Course type
        const transformedCourses: Course[] = apiCourses.map((c: any) => ({
          id: c.id,
          title: c.title,
          description: c.description || '',
          category: c.category as any,
          instructorId: c.instructor_id || c.instructorId || '',
          modules: c.modules || [],
          duration: c.duration || 0,
          difficulty: c.difficulty as 'beginner' | 'intermediate' | 'advanced',
          accessibilityFeatures: c.accessibility_features || [],
          createdAt: c.created_at ? new Date(c.created_at) : new Date(),
          updatedAt: c.updated_at ? new Date(c.updated_at) : new Date(),
        }));
      
      // Load enrolled courses from localStorage
        const savedEnrollments = localStorage.getItem('enrolledCourses');
        const enrolled = savedEnrollments ? JSON.parse(savedEnrollments) : [];
        
        set({
          courses: transformedCourses.length > 0 ? transformedCourses : mockCourses, // Fallback to mock if API returns empty
          enrolledCourses: enrolled,
          isLoading: false,
          error: null,
        });
      } catch (apiError) {
        // If API fails, use mock data as fallback
        console.warn('Failed to fetch courses from API, using mock data', apiError);
      const savedEnrollments = localStorage.getItem('enrolledCourses');
      const enrolled = savedEnrollments ? JSON.parse(savedEnrollments) : [];
      
      set({
        courses: mockCourses,
        enrolledCourses: enrolled,
        isLoading: false,
        error: null,
      });
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch courses',
        isLoading: false,
      });
    }
  },

  enrollInCourse: async (courseId: string) => {
    try {
      const { enrolledCourses } = get();
      if (enrolledCourses.includes(courseId)) {
        return; // Already enrolled
      }

      // Try to enroll via backend API first
      try {
        const { api } = await import('../services/api');
        await api.post(`/enrollments/${courseId}`);
        console.log('Successfully enrolled in course via backend API');
      } catch (apiError: any) {
        // If API call fails (e.g., not authenticated, network error), 
        // still save to localStorage for offline access
        console.warn('Failed to enroll via backend API, saving to localStorage only:', apiError?.response?.data || apiError?.message);
        
        // If it's a 400 (already enrolled), that's okay - continue
        if (apiError?.response?.status === 400 && apiError?.response?.data?.detail?.includes('Already enrolled')) {
          console.log('Already enrolled in backend, syncing with localStorage');
        } else if (apiError?.response?.status !== 401) {
          // If it's not a 401 (unauthorized), throw the error
          // 401 means not logged in, which is okay for localStorage fallback
          throw apiError;
        }
      }

      // Update localStorage and store
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
      throw error; // Re-throw so calling code can handle it
    }
  },

  unenrollFromCourse: async (courseId: string) => {
    try {
      const { enrolledCourses } = get();
      
      // Normalize IDs for comparison
      const normalizeId = (id: string) => String(id).toLowerCase().trim();
      const courseIdNormalized = normalizeId(courseId);
      const isEnrolled = enrolledCourses.some(id => normalizeId(id) === courseIdNormalized);
      
      if (!isEnrolled) {
        console.log('Not enrolled in course, nothing to unenroll');
        return; // Not enrolled
      }

      // Try to unenroll via backend API first
      try {
        const { api } = await import('../services/api');
        await api.delete(`/enrollments/${courseId}`);
        console.log('Successfully unenrolled from course via backend API');
      } catch (apiError: any) {
        // If API call fails, check the error type
        const status = apiError?.response?.status;
        const errorDetail = apiError?.response?.data?.detail || apiError?.message;
        
        // If it's a 404 (not enrolled), that's okay - continue with local cleanup
        if (status === 404) {
          console.log('Not enrolled in backend, removing from localStorage');
        } 
        // If it's a 401 (unauthorized), don't throw - let the auth interceptor handle it
        // but still remove from local state since the user might have been logged out
        else if (status === 401) {
          console.warn('Unauthorized during unenroll - may need to re-authenticate');
          // Don't throw - continue with local cleanup
        }
        // For other errors, log but continue with local cleanup
        else {
          console.warn('Failed to unenroll via backend API, removing from localStorage only:', errorDetail);
          // Don't throw - continue with local cleanup
        }
      }

      // Remove from localStorage and store (always do this, even if API call failed)
      const normalizeIdForFilter = (id: string) => String(id).toLowerCase().trim();
      const newEnrollments = enrolledCourses.filter(id => normalizeIdForFilter(id) !== courseIdNormalized);
      localStorage.setItem('enrolledCourses', JSON.stringify(newEnrollments));

      // Remove progress
      set((state) => {
        const newProgress = { ...state.progress };
        // Remove progress for all variations of the course ID
        Object.keys(newProgress).forEach(key => {
          if (normalizeIdForFilter(key) === courseIdNormalized) {
            delete newProgress[key];
          }
        });
        return {
          enrolledCourses: newEnrollments,
          progress: newProgress,
          error: null, // Clear any previous errors
        };
      });
    } catch (error) {
      console.error('Error in unenrollFromCourse:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to unenroll from course',
      });
      throw error; // Re-throw so calling code can handle it
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

