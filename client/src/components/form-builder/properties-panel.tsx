import { useState } from "react";
import { useFormBuilder } from "@/lib/form-builder-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, MousePointer } from "lucide-react";
import { cn } from "@/lib/utils";

export function PropertiesPanel() {
  const [collapsed, setCollapsed] = useState(false);
  const { getSelectedField, updateField, selectedFieldId } = useFormBuilder();
  
  const selectedField = getSelectedField();

  const handleFieldUpdate = (updates: any) => {
    if (selectedFieldId) {
      updateField(selectedFieldId, updates);
    }
  };

  const handleOptionUpdate = (index: number, key: 'label' | 'value', value: string) => {
    if (!selectedField?.options) return;
    
    const newOptions = [...selectedField.options];
    newOptions[index] = { ...newOptions[index], [key]: value };
    handleFieldUpdate({ options: newOptions });
  };

  const addOption = () => {
    const newOptions = [...(selectedField?.options || [])];
    newOptions.push({ label: `Option ${newOptions.length + 1}`, value: `option${newOptions.length + 1}` });
    handleFieldUpdate({ options: newOptions });
  };

  const removeOption = (index: number) => {
    if (!selectedField?.options) return;
    const newOptions = selectedField.options.filter((_, i) => i !== index);
    handleFieldUpdate({ options: newOptions });
  };

  return (
    <div className={cn(
      "bg-white border-l border-gray-200 flex flex-col transition-all duration-300",
      collapsed ? "w-0 overflow-hidden" : "w-80"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Field Properties</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 hover:bg-gray-100"
          >
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {!selectedField ? (
          <div className="p-6 text-center text-gray-500">
            <MousePointer className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p className="font-medium">No field selected</p>
            <p className="text-sm">Click on a form field to edit its properties</p>
          </div>
        ) : (
          <div className="p-4 space-y-6">
            {/* Basic Properties */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Basic Settings</h3>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-1">Field Label</Label>
                  <Input
                    value={selectedField.label}
                    onChange={(e) => handleFieldUpdate({ label: e.target.value })}
                    className="text-sm"
                  />
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-1">Placeholder Text</Label>
                  <Input
                    value={selectedField.placeholder || ''}
                    onChange={(e) => handleFieldUpdate({ placeholder: e.target.value })}
                    className="text-sm"
                  />
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-1">Help Text</Label>
                  <Textarea
                    rows={2}
                    value={selectedField.helpText || ''}
                    onChange={(e) => handleFieldUpdate({ helpText: e.target.value })}
                    placeholder="Optional help text for this field"
                    className="text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Options for select, radio, checkbox */}
            {selectedField.type in { select: true, radio: true, checkbox: true } && (
              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Options</h3>
                <div className="space-y-2">
                  {selectedField.options?.map((option, index) => (
                    <div key={index} className="flex space-x-2">
                      <Input
                        placeholder="Label"
                        value={option.label}
                        onChange={(e) => handleOptionUpdate(index, 'label', e.target.value)}
                        className="text-sm"
                      />
                      <Input
                        placeholder="Value"
                        value={option.value}
                        onChange={(e) => handleOptionUpdate(index, 'value', e.target.value)}
                        className="text-sm"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeOption(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addOption}
                    className="w-full"
                  >
                    Add Option
                  </Button>
                </div>
              </div>
            )}

            {/* Validation Settings */}
            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Validation</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={selectedField.required}
                    onCheckedChange={(checked) => handleFieldUpdate({ required: checked })}
                  />
                  <Label className="text-sm text-gray-700">Required field</Label>
                </div>
                
                {selectedField.type in { text: true, textarea: true, email: true } && (
                  <>
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-1">Minimum Length</Label>
                      <Input
                        type="number"
                        min="0"
                        value={selectedField.minLength || ''}
                        onChange={(e) => handleFieldUpdate({ minLength: parseInt(e.target.value) || undefined })}
                        className="text-sm"
                      />
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-1">Maximum Length</Label>
                      <Input
                        type="number"
                        min="0"
                        value={selectedField.maxLength || ''}
                        onChange={(e) => handleFieldUpdate({ maxLength: parseInt(e.target.value) || undefined })}
                        className="text-sm"
                      />
                    </div>
                  </>
                )}

                {selectedField.type === 'number' && (
                  <>
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-1">Minimum Value</Label>
                      <Input
                        type="number"
                        value={selectedField.validation?.min || ''}
                        onChange={(e) => handleFieldUpdate({ 
                          validation: { 
                            ...selectedField.validation, 
                            min: parseInt(e.target.value) || undefined 
                          } 
                        })}
                        className="text-sm"
                      />
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-1">Maximum Value</Label>
                      <Input
                        type="number"
                        value={selectedField.validation?.max || ''}
                        onChange={(e) => handleFieldUpdate({ 
                          validation: { 
                            ...selectedField.validation, 
                            max: parseInt(e.target.value) || undefined 
                          } 
                        })}
                        className="text-sm"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Styling Options */}
            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Styling</h3>
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-1">Field Size</Label>
                  <Select
                    value={selectedField.size}
                    onValueChange={(value) => handleFieldUpdate({ size: value })}
                  >
                    <SelectTrigger className="text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-1">Width</Label>
                  <Select
                    value={selectedField.width}
                    onValueChange={(value) => handleFieldUpdate({ width: value })}
                  >
                    <SelectTrigger className="text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full">Full Width</SelectItem>
                      <SelectItem value="half">Half Width</SelectItem>
                      <SelectItem value="quarter">Quarter Width</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Advanced Options */}
            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Advanced</h3>
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-1">CSS Classes</Label>
                  <Input
                    value={selectedField.cssClasses || ''}
                    onChange={(e) => handleFieldUpdate({ cssClasses: e.target.value })}
                    placeholder="custom-class another-class"
                    className="text-sm"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={selectedField.disabled}
                    onCheckedChange={(checked) => handleFieldUpdate({ disabled: checked })}
                  />
                  <Label className="text-sm text-gray-700">Disabled</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={selectedField.hidden}
                    onCheckedChange={(checked) => handleFieldUpdate({ hidden: checked })}
                  />
                  <Label className="text-sm text-gray-700">Hidden</Label>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
