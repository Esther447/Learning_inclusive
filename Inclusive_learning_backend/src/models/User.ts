import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  name: string;
  password: string;
  role: 'learner' | 'mentor' | 'administrator';
  disabilityType?: string[];
  accessibilitySettings?: {
    screenReaderEnabled: boolean;
    textToSpeechEnabled: boolean;
    highContrastMode: boolean;
    fontSize: 'small' | 'medium' | 'large' | 'extra-large';
    colorTheme: 'default' | 'high-contrast' | 'dark' | 'light';
    captionsEnabled: boolean;
    keyboardOnlyNavigation: boolean;
    simplifiedNavigation: boolean;
  };
  enrolledCourses: string[];
  progress: Array<{
    courseId: string;
    completionPercentage: number;
    lastAccessed: Date;
    completedModules: string[];
  }>;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true, lowercase: true },
  name: { type: String, required: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['learner', 'mentor', 'administrator'], default: 'learner' },
  disabilityType: [{ type: String }],
  accessibilitySettings: {
    screenReaderEnabled: { type: Boolean, default: false },
    textToSpeechEnabled: { type: Boolean, default: false },
    highContrastMode: { type: Boolean, default: false },
    fontSize: { type: String, enum: ['small', 'medium', 'large', 'extra-large'], default: 'medium' },
    colorTheme: { type: String, enum: ['default', 'high-contrast', 'dark', 'light'], default: 'default' },
    captionsEnabled: { type: Boolean, default: true },
    keyboardOnlyNavigation: { type: Boolean, default: false },
    simplifiedNavigation: { type: Boolean, default: false }
  },
  enrolledCourses: [{ type: String }],
  progress: [{
    courseId: { type: String },
    completionPercentage: { type: Number, default: 0 },
    lastAccessed: { type: Date, default: Date.now },
    completedModules: [{ type: String }]
  }]
}, { timestamps: true });

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>('User', UserSchema);