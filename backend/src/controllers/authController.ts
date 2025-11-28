import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
// Removed unused import

const generateToken = (id: string): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET not defined');
  return jwt.sign({ id }, secret, { expiresIn: '7d' });
};

const getDefaultAccessibilitySettings = (disabilityTypes?: string[]) => {
  const hasVisual = disabilityTypes?.includes('visual');
  const hasHearing = disabilityTypes?.includes('hearing');
  const hasSpeech = disabilityTypes?.includes('speech');
  const hasMobility = disabilityTypes?.includes('mobility');
  const hasCognitive = disabilityTypes?.includes('cognitive');

  return {
    screenReaderEnabled: hasVisual || false,
    textToSpeechEnabled: hasVisual || false,
    highContrastMode: hasVisual || false,
    fontSize: 'medium' as const,
    colorTheme: 'default' as const,
    brailleDisplaySupport: false,
    captionsEnabled: hasHearing || true,
    transcriptsEnabled: hasHearing || true,
    signLanguageEnabled: hasHearing || false,
    volumeBoost: 0,
    voiceOutputEnabled: hasSpeech || false,
    symbolBasedCommunication: hasSpeech || false,
    alternativeInputMethods: [],
    keyboardOnlyNavigation: hasMobility || false,
    voiceCommandNavigation: hasMobility || false,
    switchControlEnabled: false,
    simplifiedNavigation: hasCognitive || false,
    chunkedContent: hasCognitive || false,
    visualCues: true,
    remindersEnabled: hasCognitive || false,
    readingSpeed: 'normal' as const
  };
};

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name, role, disabilityType } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const accessibilitySettings = getDefaultAccessibilitySettings(disabilityType);

    const user = new User({
      email,
      password,
      name,
      role: role || 'learner',
      disabilityType,
      accessibilitySettings
    });

    await user.save();

    const token = generateToken(user._id.toString());
    
    res.status(201).json({
      success: true,
      data: {
        access_token: token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          disabilityType: user.disabilityType,
          accessibilitySettings: user.accessibilitySettings,
          enrolledCourses: user.enrolledCourses,
          progress: user.progress,
          certifications: user.certifications,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user._id.toString());

    res.json({
      success: true,
      data: {
        access_token: token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          disabilityType: user.disabilityType,
          accessibilitySettings: user.accessibilitySettings,
          enrolledCourses: user.enrolledCourses,
          progress: user.progress,
          certifications: user.certifications,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const user = new User({
      email,
      password,
      name,
      role: 'learner',
      accessibilitySettings: getDefaultAccessibilitySettings()
    });

    await user.save();

    const token = generateToken(user._id.toString());
    
    res.status(201).json({
      success: true,
      data: {
        access_token: token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          accessibilitySettings: user.accessibilitySettings
        }
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Signup failed' });
  }
};