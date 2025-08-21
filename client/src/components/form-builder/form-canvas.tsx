import { useFormBuilder } from "@/lib/form-builder-context";
import { FormFieldWrapper } from "./form-field-wrapper";
import { Plus } from "lucide-react";

export function FormCanvas() {
  const { form, fields } = useFormBuilder();

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Canvas Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Form Designer</h2>
            <p className="text-sm text-gray-500">
              Drag components from the left panel to build your form
            </p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span>{fields.length}</span>
            <span>fields</span>
          </div>
        </div>
      </div>

      {/* Form Canvas */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-2xl mx-auto">
          {/* Form Header */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {form.title}
              </h1>
              <p className="text-gray-600">
                {form.description}
              </p>
            </div>
          </div>

          {/* Form Fields Container */}
          <div className="space-y-4">
            {fields.length === 0 ? (
              <div className="drop-zone border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <div className="text-gray-500">
                  <Plus className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p className="text-lg font-medium">Drop components here</p>
                  <p className="text-sm">
                    Click on components from the left panel to start building your form
                  </p>
                </div>
              </div>
            ) : (
              fields.map((field, index) => (
                <FormFieldWrapper
                  key={field.id}
                  field={field}
                  index={index}
                />
              ))
            )}
          </div>

          {/* Form Submit Button */}
          {fields.length > 0 && (
            <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
              <button
                type="submit"
                className="w-full bg-primary text-white font-medium py-3 px-4 rounded-md hover:bg-blue-600 transition-colors"
              >
                Submit Form
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
