import { Response } from 'express';
import { Course } from '../models/Course';
import { AuthRequest } from '../middleware/auth';

export const getCourses = async (req: AuthRequest, res: Response) => {
  try {
    const courses = await Course.find().populate('instructorId', 'name email');
    res.json({ success: true, data: courses });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
};

export const getCourse = async (req: AuthRequest, res: Response) => {
  try {
    const course = await Course.findById(req.params.id).populate('instructorId', 'name email');
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.json({ success: true, data: course });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch course' });
  }
};

export const createCourse = async (req: AuthRequest, res: Response) => {
  try {
    const courseData = {
      ...req.body,
      instructorId: req.user._id
    };

    const course = new Course(courseData);
    await course.save();

    res.status(201).json({ success: true, data: course });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create course' });
  }
};

export const updateCourse = async (req: AuthRequest, res: Response) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    if (course.instructorId.toString() !== req.user._id.toString() && req.user.role !== 'administrator') {
      return res.status(403).json({ error: 'Not authorized to update this course' });
    }

    const updatedCourse = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: updatedCourse });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update course' });
  }
};