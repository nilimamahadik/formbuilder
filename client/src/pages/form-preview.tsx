import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormFieldRenderer } from "@/components/form-builder/form-field-renderer";
import { ArrowLeft, Edit, Share, Download } from "lucide-react";
import { type Form, type FormField } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export default function FormPreview() {
  const [, params] = useRoute("/form-preview/:id");
  const formId = params?.id;
  const [formData, setFormData] = useState<Record<string, any>>({});
  const { toast } = useToast();

  const { data: form, isLoading } = useQuery({
    queryKey: ["/api/forms", formId],
    queryFn: () => fetch(`/api/forms/${formId}`).then(res => res.json()) as Promise<Form>,
    enabled: !!formId,
  });

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`/api/forms/${formId}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: "Form submitted successfully!",
          description: "Your response has been recorded.",
        });
        setFormData({});
      } else {
        throw new Error("Failed to submit form");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit form. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}/form-preview/${formId}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copied!",
      description: "Form link has been copied to clipboard.",
    });
  };

  const handleExport = () => {
    if (!form) return;
    
    const formData = {
      title: form.title,
      description: form.description,
      fields: typeof form.fields === "string" ? JSON.parse(form.fields) : form.fields,
    };
    
    const dataStr = JSON.stringify(formData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${form.title.toLowerCase().replace(/\s+/g, '-')}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Form not found</h2>
          <p className="text-gray-500 mb-4">The form you're looking for doesn't exist.</p>
          <Link href="/forms">
            <Button>Back to Forms</Button>
          </Link>
        </div>
      </div>
    );
  }

  const fields: FormField[] = typeof form.fields === "string" 
    ? JSON.parse(form.fields) 
    : form.fields || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/forms">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Forms
                </Button>
              </Link>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">{form.title}</h1>
                <p className="text-sm text-gray-500">Form Preview</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Link href={`/form-builder?id=${formId}`}>
                <Button size="sm">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">
              {form.title}
            </CardTitle>
            {form.description && (
              <p className="text-gray-600 mt-2">{form.description}</p>
            )}
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
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
                <div className="pt-6">
                  <Button type="submit" className="w-full bg-primary hover:bg-blue-600">
                    Submit Form
                  </Button>
                </div>
              )}
              
              {fields.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>This form has no fields yet.</p>
                  <Link href={`/form-builder?id=${formId}`}>
                    <Button className="mt-4">
                      <Edit className="w-4 h-4 mr-2" />
                      Add Fields
                    </Button>
                  </Link>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}