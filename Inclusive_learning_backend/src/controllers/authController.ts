import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

const generateToken = (id: string): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET not defined');
  return jwt.sign({ id }, secret, { expiresIn: '7d' });
};

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name, role, disabilityType } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const user = new User({
      email,
      password,
      name,
      role: role || 'learner',
      disabilityType
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
          accessibilitySettings: user.accessibilitySettings,
          enrolledCourses: user.enrolledCourses,
          progress: user.progress
        }
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
};