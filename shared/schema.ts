import { z } from "zod";
import mongoose, { Schema, Document, Model } from "mongoose";

// Zod schemas for validation
export const formFieldSchema = z.object({
  id: z.string(),
  type: z.enum(['text', 'number', 'email', 'textarea', 'select', 'radio', 'checkbox', 'date', 'time']),
  label: z.string(),
  placeholder: z.string().optional(),
  helpText: z.string().optional(),
  required: z.boolean().default(false),
  disabled: z.boolean().default(false),
  hidden: z.boolean().default(false),
  minLength: z.number().optional(),
  maxLength: z.number().optional(),
  size: z.enum(['small', 'medium', 'large']).default('medium'),
  width: z.enum(['full', 'half', 'quarter']).default('full'),
  cssClasses: z.string().optional(),
  options: z.array(z.object({
    label: z.string(),
    value: z.string(),
  })).optional(),
  validation: z.object({
    pattern: z.string().optional(),
    min: z.number().optional(),
    max: z.number().optional(),
  }).optional(),
});

export const insertFormSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  fields: z.array(formFieldSchema),
});

export const updateFormSchema = insertFormSchema.partial();

export const insertFormSubmissionSchema = z.object({
  formId: z.string(),
  data: z.record(z.any()),
});

export const insertUserSchema = z.object({
  username: z.string(),
  email: z.string().email(),
});

// TypeScript types
export type FormField = z.infer<typeof formFieldSchema>;
export type InsertForm = z.infer<typeof insertFormSchema>;
export type UpdateForm = z.infer<typeof updateFormSchema>;
export type InsertFormSubmission = z.infer<typeof insertFormSubmissionSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;

// MongoDB interfaces
export interface IForm extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  fields: FormField[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IFormSubmission extends Document {
  _id: mongoose.Types.ObjectId;
  formId: mongoose.Types.ObjectId;
  data: Record<string, any>;
  submittedAt: Date;
}

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  username: string;
  email: string;
  createdAt: Date;
}

// Mongoose schemas
const FormFieldMongooseSchema = new Schema({
  id: { type: String, required: true },
  type: { 
    type: String, 
    required: true,
    enum: ['text', 'number', 'email', 'textarea', 'select', 'radio', 'checkbox', 'date', 'time']
  },
  label: { type: String, required: true },
  placeholder: String,
  helpText: String,
  required: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  hidden: { type: Boolean, default: false },
  minLength: Number,
  maxLength: Number,
  size: { 
    type: String, 
    enum: ['small', 'medium', 'large'], 
    default: 'medium' 
  },
  width: { 
    type: String, 
    enum: ['full', 'half', 'quarter'], 
    default: 'full' 
  },
  cssClasses: String,
  options: [{
    label: { type: String, required: true },
    value: { type: String, required: true },
  }],
  validation: {
    pattern: String,
    min: Number,
    max: Number,
  },
});

const FormMongooseSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  fields: [FormFieldMongooseSchema],
}, {
  timestamps: true
});

const FormSubmissionMongooseSchema = new Schema({
  formId: { type: Schema.Types.ObjectId, ref: 'Form', required: true },
  data: { type: Schema.Types.Mixed, required: true },
  submittedAt: { type: Date, default: Date.now },
});

const UserMongooseSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
}, {
  timestamps: true
});

// MongoDB models
export const FormModel: Model<IForm> = mongoose.models.Form || mongoose.model<IForm>('Form', FormMongooseSchema);
export const FormSubmissionModel: Model<IFormSubmission> = mongoose.models.FormSubmission || mongoose.model<IFormSubmission>('FormSubmission', FormSubmissionMongooseSchema);
export const UserModel: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserMongooseSchema);

// Transformed types for API responses (to match previous interface)
export interface Form {
  id: string;
  title: string;
  description: string | null;
  fields: string; // JSON stringified for compatibility
  createdAt: string | null;
  updatedAt: string | null;
}

export interface FormSubmission {
  id: string;
  formId: string;
  data: string; // JSON stringified for compatibility
  submittedAt: string | null;
}

export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string | null;
}