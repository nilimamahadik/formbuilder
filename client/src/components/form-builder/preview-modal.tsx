import { useState } from "react";
import { useFormBuilder } from "@/lib/form-builder-context";
import { FormFieldRenderer } from "./form-field-renderer";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export function PreviewModal() {
  const { form, fields, showPreview, setShowPreview } = useFormBuilder();
  const [formData, setFormData] = useState<Record<string, any>>({});

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Form submitted! Check console for data.');
  };

  return (
    <Dialog open={showPreview} onOpenChange={setShowPreview}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Form Preview
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPreview(false)}
              className="h-auto p-2"
            >
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {form.title}
              </h1>
              <p className="text-gray-600">
                {form.description}
              </p>
            </div>
            
            {fields.map((field) => (
              <div key={field.id}>
                <FormFieldRenderer
                  field={field}
                  preview={true}
                  value={formData[field.id]}
                  onChange={(value) => handleFieldChange(field.id, value)}
                />
              </div>
            ))}
            
            {fields.length > 0 && (
              <Button
                type="submit"
                className="w-full bg-primary text-white hover:bg-blue-600"
              >
                Submit Form
              </Button>
            )}
            
            {fields.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>No fields added to the form yet.</p>
                <p className="text-sm">Add some fields to see the preview.</p>
              </div>
            )}
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
