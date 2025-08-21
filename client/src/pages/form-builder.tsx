import { FormBuilderProvider } from "@/lib/form-builder-context";
import { ComponentPalette } from "@/components/form-builder/component-palette";
import { FormCanvas } from "@/components/form-builder/form-canvas";
import { PropertiesPanel } from "@/components/form-builder/properties-panel";
import { PreviewModal } from "@/components/form-builder/preview-modal";
import { Button } from "@/components/ui/button";
import { Eye, Download, Undo, Redo } from "lucide-react";
import { useFormBuilder } from "@/lib/form-builder-context";

function FormBuilderHeader() {
  const { 
    form, 
    showPreview, 
    setShowPreview, 
    undo, 
    redo, 
    canUndo, 
    canRedo,
    exportFormAsJSON 
  } = useFormBuilder();

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-4">
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
          size="sm"
          onClick={exportFormAsJSON}
          className="bg-primary text-white hover:bg-blue-600"
        >
          <Download className="w-4 h-4 mr-1" />
          Export JSON
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

export default function FormBuilder() {
  return (
    <FormBuilderProvider>
      <div className="h-screen flex flex-col bg-gray-50 font-inter">
        <FormBuilderHeader />
        <FormBuilderContent />
      </div>
    </FormBuilderProvider>
  );
}
