import { type Form, type InsertForm, type UpdateForm, type FormSubmission, type InsertFormSubmission, type User, type InsertUser } from "@shared/schema";
import { randomUUID } from "crypto";

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

export const storage = new MemStorage();
