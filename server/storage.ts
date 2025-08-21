import { 
  type Form, 
  type InsertForm, 
  type UpdateForm, 
  type FormSubmission, 
  type InsertFormSubmission, 
  type User, 
  type InsertUser,
  FormModel,
  FormSubmissionModel,
  UserModel,
  type IForm,
  type IFormSubmission,
  type IUser
} from "@shared/schema";
import { randomUUID } from "crypto";
import { connectToDatabase } from "./db";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Form methods
  getForms(): Promise<Form[]>;
  getForm(id: string): Promise<Form | undefined>;
  createForm(form: InsertForm): Promise<Form>;
  updateForm(id: string, updates: UpdateForm): Promise<Form | undefined>;
  deleteForm(id: string): Promise<boolean>;
  
  // Form submission methods
  getFormSubmissions(formId: string): Promise<FormSubmission[]>;
  createFormSubmission(submission: InsertFormSubmission): Promise<FormSubmission>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private forms: Map<string, Form>;
  private formSubmissions: Map<string, FormSubmission>;

  constructor() {
    this.users = new Map();
    this.forms = new Map();
    this.formSubmissions = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: new Date().toISOString() 
    };
    this.users.set(id, user);
    return user;
  }

  async getForms(): Promise<Form[]> {
    return Array.from(this.forms.values());
  }

  async getForm(id: string): Promise<Form | undefined> {
    return this.forms.get(id);
  }

  async createForm(insertForm: InsertForm): Promise<Form> {
    const id = randomUUID();
    const now = new Date().toISOString();
    const form: Form = {
      ...insertForm,
      id,
      description: insertForm.description || null,
      fields: JSON.stringify(insertForm.fields),
      createdAt: now,
      updatedAt: now,
    };
    this.forms.set(id, form);
    return form;
  }

  async updateForm(id: string, updates: UpdateForm): Promise<Form | undefined> {
    const existingForm = this.forms.get(id);
    if (!existingForm) return undefined;

    const updatedForm: Form = {
      ...existingForm,
      ...updates,
      fields: updates.fields ? JSON.stringify(updates.fields) : existingForm.fields,
      updatedAt: new Date().toISOString(),
    };
    
    this.forms.set(id, updatedForm);
    return updatedForm;
  }

  async deleteForm(id: string): Promise<boolean> {
    return this.forms.delete(id);
  }

  async getFormSubmissions(formId: string): Promise<FormSubmission[]> {
    return Array.from(this.formSubmissions.values()).filter(
      submission => submission.formId === formId
    );
  }

  async createFormSubmission(insertSubmission: InsertFormSubmission): Promise<FormSubmission> {
    const id = randomUUID();
    const submission: FormSubmission = {
      ...insertSubmission,
      id,
      data: JSON.stringify(insertSubmission.data),
      submittedAt: new Date().toISOString(),
    };
    this.formSubmissions.set(id, submission);
    return submission;
  }
}

// MongoDB Storage Implementation
export class MongoStorage implements IStorage {
  constructor() {
    // Ensure database connection on initialization
    connectToDatabase().catch(console.error);
  }

  private transformFormFromMongo(mongoForm: IForm): Form {
    return {
      id: mongoForm._id.toString(),
      title: mongoForm.title,
      description: mongoForm.description || null,
      fields: JSON.stringify(mongoForm.fields),
      createdAt: mongoForm.createdAt?.toISOString() || null,
      updatedAt: mongoForm.updatedAt?.toISOString() || null,
    };
  }

  private transformUserFromMongo(mongoUser: IUser): User {
    return {
      id: mongoUser._id.toString(),
      username: mongoUser.username,
      email: mongoUser.email,
      createdAt: mongoUser.createdAt?.toISOString() || null,
    };
  }

  private transformSubmissionFromMongo(mongoSubmission: IFormSubmission): FormSubmission {
    return {
      id: mongoSubmission._id.toString(),
      formId: mongoSubmission.formId.toString(),
      data: JSON.stringify(mongoSubmission.data),
      submittedAt: mongoSubmission.submittedAt?.toISOString() || null,
    };
  }

  async getUser(id: string): Promise<User | undefined> {
    try {
      await connectToDatabase();
      const user = await UserModel.findById(id);
      return user ? this.transformUserFromMongo(user) : undefined;
    } catch (error) {
      console.error('Error getting user:', error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      await connectToDatabase();
      const user = await UserModel.findOne({ username });
      return user ? this.transformUserFromMongo(user) : undefined;
    } catch (error) {
      console.error('Error getting user by username:', error);
      return undefined;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      await connectToDatabase();
      const user = new UserModel(insertUser);
      const savedUser = await user.save();
      return this.transformUserFromMongo(savedUser);
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async getForms(): Promise<Form[]> {
    try {
      await connectToDatabase();
      const forms = await FormModel.find().sort({ createdAt: -1 });
      return forms.map(form => this.transformFormFromMongo(form));
    } catch (error) {
      console.error('Error getting forms:', error);
      return [];
    }
  }

  async getForm(id: string): Promise<Form | undefined> {
    try {
      await connectToDatabase();
      const form = await FormModel.findById(id);
      return form ? this.transformFormFromMongo(form) : undefined;
    } catch (error) {
      console.error('Error getting form:', error);
      return undefined;
    }
  }

  async createForm(insertForm: InsertForm): Promise<Form> {
    try {
      await connectToDatabase();
      const form = new FormModel(insertForm);
      const savedForm = await form.save();
      return this.transformFormFromMongo(savedForm);
    } catch (error) {
      console.error('Error creating form:', error);
      throw error;
    }
  }

  async updateForm(id: string, updates: UpdateForm): Promise<Form | undefined> {
    try {
      await connectToDatabase();
      const updatedForm = await FormModel.findByIdAndUpdate(
        id, 
        updates, 
        { new: true, runValidators: true }
      );
      return updatedForm ? this.transformFormFromMongo(updatedForm) : undefined;
    } catch (error) {
      console.error('Error updating form:', error);
      return undefined;
    }
  }

  async deleteForm(id: string): Promise<boolean> {
    try {
      await connectToDatabase();
      const result = await FormModel.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      console.error('Error deleting form:', error);
      return false;
    }
  }

  async getFormSubmissions(formId: string): Promise<FormSubmission[]> {
    try {
      await connectToDatabase();
      const submissions = await FormSubmissionModel.find({ formId }).sort({ submittedAt: -1 });
      return submissions.map(submission => this.transformSubmissionFromMongo(submission));
    } catch (error) {
      console.error('Error getting form submissions:', error);
      return [];
    }
  }

  async createFormSubmission(insertSubmission: InsertFormSubmission): Promise<FormSubmission> {
    try {
      await connectToDatabase();
      const submission = new FormSubmissionModel(insertSubmission);
      const savedSubmission = await submission.save();
      return this.transformSubmissionFromMongo(savedSubmission);
    } catch (error) {
      console.error('Error creating form submission:', error);
      throw error;
    }
  }
}

// Use MongoDB storage by default, fallback to memory storage if MongoDB is not available
export const storage = process.env.NODE_ENV === 'production' || process.env.MONGODB_URI 
  ? new MongoStorage() 
  : new MemStorage();
