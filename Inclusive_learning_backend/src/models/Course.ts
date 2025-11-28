import mongoose, { Schema, Document } from 'mongoose';

export interface ICourse extends Document {
  title: string;
  description: string;
  category: string;
  instructorId: string;
  modules: Array<{
    title: string;
    content: Array<{
      type: 'text' | 'video' | 'audio' | 'interactive' | 'quiz';
      content: string;
      altText?: string;
      captions?: string;
      transcript?: string;
    }>;
    order: number;
    estimatedTime: number;
  }>;
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  accessibilityFeatures: string[];
}

const CourseSchema = new Schema<ICourse>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  instructorId: { type: String, required: true },
  modules: [{
    title: { type: String, required: true },
    content: [{
      type: { type: String, enum: ['text', 'video', 'audio', 'interactive', 'quiz'], required: true },
      content: { type: String, required: true },
      altText: String,
      captions: String,
      transcript: String
    }],
    order: { type: Number, required: true },
    estimatedTime: { type: Number, required: true }
  }],
  duration: { type: Number, required: true },
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], required: true },
  accessibilityFeatures: [{ type: String }]
}, { timestamps: true });

export const Course = mongoose.model<ICourse>('Course', CourseSchema);