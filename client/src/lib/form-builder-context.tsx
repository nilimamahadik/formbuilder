import { createContext, useContext, useState, useCallback } from "react";
import { type FormField } from "@shared/schema";
import { generateId } from "./drag-drop";

interface FormBuilderState {
  form: {
    title: string;
    description: string;
  };
  fields: FormField[];
  selectedFieldId: string | null;
  showPreview: boolean;
  history: FormField[][];
  historyIndex: number;
  isLoading: boolean;
  isSaving: boolean;
  currentFormId: string | null;
}

interface FormBuilderContextType extends FormBuilderState {
  setForm: (form: { title: string; description: string }) => void;
  addField: (field: Omit<FormField, 'id'>) => void;
  updateField: (id: string, updates: Partial<FormField>) => void;
  deleteField: (id: string) => void;
  duplicateField: (id: string) => void;
  reorderFields: (startIndex: number, endIndex: number) => void;
  selectField: (id: string | null) => void;
  setShowPreview: (show: boolean) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  exportFormAsJSON: () => void;
  saveForm: () => Promise<void>;
  loadForm: (formId: string) => Promise<void>;
  isLoading: boolean;
  isSaving: boolean;
  currentFormId: string | null;
  getSelectedField: () => FormField | null;
}

const FormBuilderContext = createContext<FormBuilderContextType | null>(null);

export function useFormBuilder() {
  const context = useContext(FormBuilderContext);
  if (!context) {
    throw new Error("useFormBuilder must be used within a FormBuilderProvider");
  }
  return context;
}

export function FormBuilderProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<FormBuilderState>({
    form: {
      title: "New Form",
      description: "Please fill out this form.",
    },
    fields: [],
    selectedFieldId: null,
    showPreview: false,
    history: [[]],
    historyIndex: 0,
    isLoading: false,
    isSaving: false,
    currentFormId: null,
  });

  const saveToHistory = useCallback((fields: FormField[]) => {
    setState(prev => {
      const newHistory = prev.history.slice(0, prev.historyIndex + 1);
      newHistory.push([...fields]);
      return {
        ...prev,
        history: newHistory.slice(-50), // Keep only last 50 states
        historyIndex: newHistory.length - 1,
      };
    });
  }, []);

  const setForm = useCallback((form: { title: string; description: string }) => {
    setState(prev => ({ ...prev, form }));
  }, []);

  const addField = useCallback((field: Omit<FormField, 'id'>) => {
    const newField: FormField = {
      ...field,
      id: generateId(),
    };
    
    setState(prev => {
      const newFields = [...prev.fields, newField];
      saveToHistory(newFields);
      return {
        ...prev,
        fields: newFields,
        selectedFieldId: newField.id,
      };
    });
  }, [saveToHistory]);

  const updateField = useCallback((id: string, updates: Partial<FormField>) => {
    setState(prev => {
      const newFields = prev.fields.map(field =>
        field.id === id ? { ...field, ...updates } : field
      );
      saveToHistory(newFields);
      return {
        ...prev,
        fields: newFields,
      };
    });
  }, [saveToHistory]);

  const deleteField = useCallback((id: string) => {
    setState(prev => {
      const newFields = prev.fields.filter(field => field.id !== id);
      saveToHistory(newFields);
      return {
        ...prev,
        fields: newFields,
        selectedFieldId: prev.selectedFieldId === id ? null : prev.selectedFieldId,
      };
    });
  }, [saveToHistory]);

  const duplicateField = useCallback((id: string) => {
    setState(prev => {
      const fieldToDuplicate = prev.fields.find(field => field.id === id);
      if (!fieldToDuplicate) return prev;

      const duplicatedField: FormField = {
        ...fieldToDuplicate,
        id: generateId(),
        label: `${fieldToDuplicate.label} (Copy)`,
      };

      const fieldIndex = prev.fields.findIndex(field => field.id === id);
      const newFields = [
        ...prev.fields.slice(0, fieldIndex + 1),
        duplicatedField,
        ...prev.fields.slice(fieldIndex + 1),
      ];
      
      saveToHistory(newFields);
      return {
        ...prev,
        fields: newFields,
        selectedFieldId: duplicatedField.id,
      };
    });
  }, [saveToHistory]);

  const reorderFields = useCallback((startIndex: number, endIndex: number) => {
    setState(prev => {
      const newFields = [...prev.fields];
      const [removed] = newFields.splice(startIndex, 1);
      newFields.splice(endIndex, 0, removed);
      
      saveToHistory(newFields);
      return {
        ...prev,
        fields: newFields,
      };
    });
  }, [saveToHistory]);

  const selectField = useCallback((id: string | null) => {
    setState(prev => ({ ...prev, selectedFieldId: id }));
  }, []);

  const setShowPreview = useCallback((show: boolean) => {
    setState(prev => ({ ...prev, showPreview: show }));
  }, []);

  const undo = useCallback(() => {
    setState(prev => {
      if (prev.historyIndex > 0) {
        const newIndex = prev.historyIndex - 1;
        return {
          ...prev,
          fields: [...prev.history[newIndex]],
          historyIndex: newIndex,
          selectedFieldId: null,
        };
      }
      return prev;
    });
  }, []);

  const redo = useCallback(() => {
    setState(prev => {
      if (prev.historyIndex < prev.history.length - 1) {
        const newIndex = prev.historyIndex + 1;
        return {
          ...prev,
          fields: [...prev.history[newIndex]],
          historyIndex: newIndex,
          selectedFieldId: null,
        };
      }
      return prev;
    });
  }, []);

  const exportFormAsJSON = useCallback(() => {
    const formData = {
      title: state.form.title,
      description: state.form.description,
      fields: state.fields,
    };
    
    const dataStr = JSON.stringify(formData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${state.form.title.toLowerCase().replace(/\s+/g, '-')}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  }, [state.form, state.fields]);

  const saveForm = useCallback(async () => {
    setState(prev => ({ ...prev, isSaving: true }));
    
    try {
      const formData = {
        title: state.form.title,
        description: state.form.description,
        fields: state.fields,
      };

      const url = state.currentFormId 
        ? `/api/forms/${state.currentFormId}` 
        : '/api/forms';
      const method = state.currentFormId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to save form');
      }

      const savedForm = await response.json();
      setState(prev => ({ 
        ...prev, 
        currentFormId: savedForm.id,
        isSaving: false 
      }));
    } catch (error) {
      setState(prev => ({ ...prev, isSaving: false }));
      throw error;
    }
  }, [state.form, state.fields, state.currentFormId]);

  const loadForm = useCallback(async (formId: string) => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const response = await fetch(`/api/forms/${formId}`);
      if (!response.ok) {
        throw new Error('Failed to load form');
      }

      const form = await response.json();
      const fields = typeof form.fields === 'string' 
        ? JSON.parse(form.fields) 
        : form.fields || [];

      setState(prev => ({
        ...prev,
        form: {
          title: form.title,
          description: form.description || '',
        },
        fields,
        currentFormId: formId,
        history: [fields],
        historyIndex: 0,
        selectedFieldId: null,
        isLoading: false,
      }));
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, []);

  const getSelectedField = useCallback(() => {
    return state.fields.find(field => field.id === state.selectedFieldId) || null;
  }, [state.fields, state.selectedFieldId]);

  const contextValue: FormBuilderContextType = {
    ...state,
    setForm,
    addField,
    updateField,
    deleteField,
    duplicateField,
    reorderFields,
    selectField,
    setShowPreview,
    undo,
    redo,
    canUndo: state.historyIndex > 0,
    canRedo: state.historyIndex < state.history.length - 1,
    exportFormAsJSON,
    saveForm,
    loadForm,
    getSelectedField,
  };

  return (
    <FormBuilderContext.Provider value={contextValue}>
      {children}
    </FormBuilderContext.Provider>
  );
}
