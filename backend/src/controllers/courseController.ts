import { Response } from 'express';
import { Course } from '../models/Course';
import { User } from '../models/User';
import { AuthRequest } from '../middleware/auth';

export const getCourses = async (req: AuthRequest, res: Response) => {
  try {
    const { category, difficulty, accessibility } = req.query;
    
    let filter: any = {};
    
    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;
    if (accessibility) filter.accessibilityFeatures = { $in: [accessibility] };

    const courses = await Course.find(filter);
    res.json({ success: true, data: courses });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
};

export const getCourse = async (req: AuthRequest, res: Response) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.json({ success: true, data: course });
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({ error: 'Failed to fetch course' });
  }
};

export const createCourse = async (req: AuthRequest, res: Response) => {
  try {
    const courseData = {
      ...req.body,
      instructorId: req.user._id.toString()
    };

    const course = new Course(courseData);
    await course.save();

    res.status(201).json({ success: true, data: course });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({ error: 'Failed to create course' });
  }
};

export const updateCourse = async (req: AuthRequest, res: Response) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    if (course.instructorId !== req.user._id.toString() && req.user.role !== 'administrator') {
      return res.status(403).json({ error: 'Not authorized to update this course' });
    }

    const updatedCourse = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: updatedCourse });
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({ error: 'Failed to update course' });
  }
};

export const enrollInCourse = async (req: AuthRequest, res: Response) => {
  try {
    const courseId = req.params.id;
    const userId = req.user._id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.enrolledCourses.includes(courseId)) {
      return res.status(400).json({ error: 'Already enrolled in this course' });
    }

    user.enrolledCourses.push(courseId);
    user.progress.push({
      courseId,
      moduleId: course.modules[0]?._id || '',
      completionPercentage: 0,
      lastAccessed: new Date(),
      completedModules: []
    });

    await user.save();

    res.json({ success: true, message: 'Successfully enrolled in course' });
  } catch (error) {
    console.error('Enroll course error:', error);
    res.status(500).json({ error: 'Failed to enroll in course' });
  }
};

export const updateProgress = async (req: AuthRequest, res: Response) => {
  try {
    const { courseId, moduleId, completionPercentage, completedModules } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const progressIndex = user.progress.findIndex(p => p.courseId === courseId);
    
    if (progressIndex === -1) {
      return res.status(404).json({ error: 'Course progress not found' });
    }

    user.progress[progressIndex] = {
      courseId,
      moduleId,
      completionPercentage,
      lastAccessed: new Date(),
      completedModules: completedModules || user.progress[progressIndex].completedModules
    };

    await user.save();

    res.json({ success: true, data: user.progress[progressIndex] });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({ error: 'Failed to update progress' });
  }
};