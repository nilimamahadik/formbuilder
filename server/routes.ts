import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertFormSchema, updateFormSchema, insertFormSubmissionSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all forms
  app.get("/api/forms", async (req, res) => {
    try {
      const forms = await storage.getForms();
      const formsWithParsedFields = forms.map(form => ({
        ...form,
        fields: typeof form.fields === 'string' ? JSON.parse(form.fields) : form.fields,
      }));
      res.json(formsWithParsedFields);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch forms" });
    }
  });

  // Get form by ID
  app.get("/api/forms/:id", async (req, res) => {
    try {
      const form = await storage.getForm(req.params.id);
      if (!form) {
        return res.status(404).json({ message: "Form not found" });
      }
      
      const formWithParsedFields = {
        ...form,
        fields: typeof form.fields === 'string' ? JSON.parse(form.fields) : form.fields,
      };
      
      res.json(formWithParsedFields);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch form" });
    }
  });

  // Create new form
  app.post("/api/forms", async (req, res) => {
    try {
      const validatedData = insertFormSchema.parse(req.body);
      const form = await storage.createForm(validatedData);
      
      const formWithParsedFields = {
        ...form,
        fields: typeof form.fields === 'string' ? JSON.parse(form.fields) : form.fields,
      };
      
      res.status(201).json(formWithParsedFields);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to create form" });
    }
  });

  // Update form
  app.put("/api/forms/:id", async (req, res) => {
    try {
      const validatedData = updateFormSchema.parse(req.body);
      const form = await storage.updateForm(req.params.id, validatedData);
      
      if (!form) {
        return res.status(404).json({ message: "Form not found" });
      }
      
      const formWithParsedFields = {
        ...form,
        fields: typeof form.fields === 'string' ? JSON.parse(form.fields) : form.fields,
      };
      
      res.json(formWithParsedFields);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to update form" });
    }
  });

  // Delete form
  app.delete("/api/forms/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteForm(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Form not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete form" });
    }
  });

  // Submit form data
  app.post("/api/forms/:id/submit", async (req, res) => {
    try {
      const form = await storage.getForm(req.params.id);
      if (!form) {
        return res.status(404).json({ message: "Form not found" });
      }

      const validatedData = insertFormSubmissionSchema.parse({
        formId: req.params.id,
        data: req.body,
      });

      const submission = await storage.createFormSubmission(validatedData);
      
      const submissionWithParsedData = {
        ...submission,
        data: typeof submission.data === 'string' ? JSON.parse(submission.data) : submission.data,
      };
      
      res.status(201).json(submissionWithParsedData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to submit form" });
    }
  });

  // Get form submissions
  app.get("/api/forms/:id/submissions", async (req, res) => {
    try {
      const submissions = await storage.getFormSubmissions(req.params.id);
      const submissionsWithParsedData = submissions.map(submission => ({
        ...submission,
        data: typeof submission.data === 'string' ? JSON.parse(submission.data) : submission.data,
      }));
      res.json(submissionsWithParsedData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch submissions" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
