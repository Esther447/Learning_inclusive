import { Response } from 'express';
import { User } from '../models/User';
import { AuthRequest } from '../middleware/auth';

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      data: {
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
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { name, disabilityType } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, disabilityType },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

export const updateAccessibilitySettings = async (req: AuthRequest, res: Response) => {
  try {
    const accessibilitySettings = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { accessibilitySettings },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ 
      success: true, 
      data: { accessibilitySettings: user.accessibilitySettings }
    });
  } catch (error) {
    console.error('Update accessibility settings error:', error);
    res.status(500).json({ error: 'Failed to update accessibility settings' });
  }
};

export const getDashboard = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const dashboardData = {
      user: {
        id: user._id,
        name: user.name,
        role: user.role
      },
      enrolledCoursesCount: user.enrolledCourses.length,
      completedCoursesCount: user.progress.filter(p => p.completionPercentage === 100).length,
      certificationsCount: user.certifications.length,
      recentProgress: user.progress
        .sort((a, b) => new Date(b.lastAccessed).getTime() - new Date(a.lastAccessed).getTime())
        .slice(0, 5)
    };

    res.json({ success: true, data: dashboardData });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
};