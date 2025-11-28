import { User } from '../models/User';
import { Course } from '../models/Course';

export const seedDatabase = async () => {
  try {
    // Check if data already exists
    const userCount = await User.countDocuments();
    const courseCount = await Course.countDocuments();

    if (userCount > 0 || courseCount > 0) {
      console.log('Database already has data, skipping seed');
      return;
    }

    // Create sample users
    const mentor = new User({
      email: 'mentor@example.com',
      password: 'password123',
      name: 'John Mentor',
      role: 'mentor',
      accessibilitySettings: {
        screenReaderEnabled: false,
        textToSpeechEnabled: false,
        highContrastMode: false,
        fontSize: 'medium',
        colorTheme: 'default',
        brailleDisplaySupport: false,
        captionsEnabled: true,
        transcriptsEnabled: true,
        signLanguageEnabled: false,
        volumeBoost: 0,
        voiceOutputEnabled: false,
        symbolBasedCommunication: false,
        alternativeInputMethods: [],
        keyboardOnlyNavigation: false,
        voiceCommandNavigation: false,
        switchControlEnabled: false,
        simplifiedNavigation: false,
        chunkedContent: false,
        visualCues: true,
        remindersEnabled: false,
        readingSpeed: 'normal'
      }
    });

    const learner = new User({
      email: 'learner@example.com',
      password: 'password123',
      name: 'Jane Learner',
      role: 'learner',
      disabilityType: ['visual'],
      accessibilitySettings: {
        screenReaderEnabled: true,
        textToSpeechEnabled: true,
        highContrastMode: true,
        fontSize: 'large',
        colorTheme: 'high-contrast',
        brailleDisplaySupport: true,
        captionsEnabled: true,
        transcriptsEnabled: true,
        signLanguageEnabled: false,
        volumeBoost: 20,
        voiceOutputEnabled: true,
        symbolBasedCommunication: false,
        alternativeInputMethods: ['keyboard'],
        keyboardOnlyNavigation: true,
        voiceCommandNavigation: false,
        switchControlEnabled: false,
        simplifiedNavigation: true,
        chunkedContent: true,
        visualCues: true,
        remindersEnabled: true,
        readingSpeed: 'slow'
      }
    });

    await mentor.save();
    await learner.save();

    // Create sample courses
    const course1 = new Course({
      title: 'Introduction to Web Development',
      description: 'Learn the basics of HTML, CSS, and JavaScript with full accessibility support.',
      category: 'technology',
      instructorId: mentor._id.toString(),
      modules: [
        {
          title: 'HTML Fundamentals',
          content: [
            {
              type: 'text',
              content: 'HTML (HyperText Markup Language) is the standard markup language for creating web pages.',
              altText: 'Introduction to HTML basics'
            },
            {
              type: 'video',
              content: 'https://example.com/html-video',
              captions: 'Full captions available for HTML video tutorial',
              transcript: 'Complete transcript of HTML fundamentals video lesson'
            }
          ],
          order: 1,
          estimatedTime: 60
        },
        {
          title: 'CSS Styling',
          content: [
            {
              type: 'text',
              content: 'CSS (Cascading Style Sheets) is used to style and layout web pages.',
              altText: 'CSS styling introduction'
            }
          ],
          order: 2,
          estimatedTime: 90
        }
      ],
      duration: 10,
      difficulty: 'beginner',
      accessibilityFeatures: ['screen-reader', 'captions', 'transcripts', 'keyboard-navigation']
    });

    const course2 = new Course({
      title: 'Digital Literacy for Everyone',
      description: 'Essential computer skills designed with accessibility in mind.',
      category: 'literacy',
      instructorId: mentor._id.toString(),
      modules: [
        {
          title: 'Computer Basics',
          content: [
            {
              type: 'text',
              content: 'Learn fundamental computer operations and navigation.',
              altText: 'Computer basics overview'
            },
            {
              type: 'interactive',
              content: 'Interactive tutorial for mouse and keyboard usage',
              altText: 'Interactive computer skills practice'
            }
          ],
          order: 1,
          estimatedTime: 45
        }
      ],
      duration: 5,
      difficulty: 'beginner',
      accessibilityFeatures: ['simplified-ui', 'voice-control', 'text-to-speech']
    });

    await course1.save();
    await course2.save();

    console.log('✅ Database seeded successfully');
    console.log('Sample accounts:');
    console.log('Mentor: mentor@example.com / password123');
    console.log('Learner: learner@example.com / password123');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
};