import { useFormBuilder } from "@/lib/form-builder-context";
import { FormFieldRenderer } from "./form-field-renderer";
import { Button } from "@/components/ui/button";
import { Settings, Copy, Trash2, GripVertical } from "lucide-react";
import { type FormField } from "@shared/schema";
import { cn } from "@/lib/utils";

interface FormFieldWrapperProps {
  field: FormField;
  index: number;
}

export function FormFieldWrapper({ field, index }: FormFieldWrapperProps) {
  const { 
    selectedFieldId, 
    selectField, 
    updateField, 
    deleteField, 
    duplicateField 
  } = useFormBuilder();

  const isSelected = selectedFieldId === field.id;

  const handleClick = () => {
    selectField(field.id);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectField(field.id);
  };

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    duplicateField(field.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteField(field.id);
  };

  return (
    <div
      className={cn(
        "form-field-wrapper bg-white border border-gray-200 rounded-lg p-4 relative group cursor-pointer transition-all duration-150",
        isSelected && "ring-2 ring-primary border-primary",
        "hover:shadow-sm"
      )}
      onClick={handleClick}
    >
      {/* Field Actions */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleEdit}
            className="p-1 h-auto w-auto hover:bg-gray-100 text-gray-400 hover:text-gray-600"
          >
            <Settings className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDuplicate}
            className="p-1 h-auto w-auto hover:bg-gray-100 text-gray-400 hover:text-gray-600"
          >
            <Copy className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="p-1 h-auto w-auto hover:bg-gray-100 text-gray-400 hover:text-red-600"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Drag Handle */}
      <div className="absolute left-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-move">
        <GripVertical className="w-3 h-3 text-gray-400" />
      </div>

      {/* Field Content */}
      <div className="ml-6">
        <FormFieldRenderer field={field} preview={false} />
      </div>
    </div>
  );
}
