import { useEffect } from "react";
import { FormBuilderProvider } from "@/lib/form-builder-context";
import { ComponentPalette } from "@/components/form-builder/component-palette";
import { FormCanvas } from "@/components/form-builder/form-canvas";
import { PropertiesPanel } from "@/components/form-builder/properties-panel";
import { PreviewModal } from "@/components/form-builder/preview-modal";
import { Button } from "@/components/ui/button";
import { Eye, Download, Undo, Redo, Save, ArrowLeft } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useFormBuilder } from "@/lib/form-builder-context";
import { useToast } from "@/hooks/use-toast";

function FormBuilderHeader() {
  const { 
    form, 
    showPreview, 
    setShowPreview, 
    undo, 
    redo, 
    canUndo, 
    canRedo,
    exportFormAsJSON,
    saveForm,
    isSaving,
    currentFormId
  } = useFormBuilder();
  const { toast } = useToast();

  const handleSave = async () => {
    try {
      await saveForm();
      toast({
        title: "Form saved!",
        description: currentFormId ? "Form updated successfully." : "Form created successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save form. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Link href="/forms">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Forms
          </Button>
        </Link>
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 bg-primary rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold">F</span>
          </div>
          <h1 className="text-xl font-semibold text-gray-900">Form Builder</h1>
        </div>
        <div className="text-sm text-gray-500">
          <span>{form.title}</span>
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={undo}
          disabled={!canUndo}
          className="text-gray-600 hover:text-gray-900"
        >
          <Undo className="w-4 h-4 mr-1" />
          Undo
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={redo}
          disabled={!canRedo}
          className="text-gray-600 hover:text-gray-900"
        >
          <Redo className="w-4 h-4 mr-1" />
          Redo
        </Button>
        <div className="w-px h-6 bg-gray-300"></div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowPreview(true)}
          className="bg-gray-100 text-gray-700 hover:bg-gray-200"
        >
          <Eye className="w-4 h-4 mr-1" />
          Preview
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={exportFormAsJSON}
          className="text-gray-700 hover:bg-gray-100"
        >
          <Download className="w-4 h-4 mr-1" />
          Export JSON
        </Button>
        <Button
          size="sm"
          onClick={handleSave}
          disabled={isSaving}
          className="bg-primary text-white hover:bg-blue-600"
        >
          <Save className="w-4 h-4 mr-1" />
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </div>
    </header>
  );
}

function FormBuilderContent() {
  return (
    <div className="flex flex-1 overflow-hidden">
      <ComponentPalette />
      <FormCanvas />
      <PropertiesPanel />
      <PreviewModal />
    </div>
  );
}

function FormBuilderWithProvider() {
  const [location] = useLocation();
  const { loadForm, isLoading } = useFormBuilder();
  const { toast } = useToast();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.split('?')[1] || '');
    const formId = searchParams.get('id');
    
    if (formId) {
      loadForm(formId).catch(() => {
        toast({
          title: "Error",
          description: "Failed to load form. Please try again.",
          variant: "destructive",
        });
      });
    }
  }, [location, loadForm, toast]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 font-inter">
      <FormBuilderHeader />
      <FormBuilderContent />
    </div>
  );
}

export default function FormBuilder() {
  return (
    <FormBuilderProvider>
      <FormBuilderWithProvider />
    </FormBuilderProvider>
  );
}
