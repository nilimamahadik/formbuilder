import { type FormField } from "@shared/schema";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface FormFieldRendererProps {
  field: FormField;
  preview?: boolean;
  value?: any;
  onChange?: (value: any) => void;
}

export function FormFieldRenderer({ 
  field, 
  preview = false, 
  value, 
  onChange 
}: FormFieldRendererProps) {
  const getSizeClasses = () => {
    switch (field.size) {
      case 'small':
        return 'text-sm py-1.5';
      case 'large':
        return 'text-lg py-3';
      default:
        return 'py-2';
    }
  };

  const getWidthClasses = () => {
    switch (field.width) {
      case 'half':
        return 'w-1/2';
      case 'quarter':
        return 'w-1/4';
      default:
        return 'w-full';
    }
  };

  const fieldClasses = cn(
    getSizeClasses(),
    getWidthClasses(),
    field.cssClasses
  );

  const renderField = () => {
    const commonProps = {
      disabled: field.disabled,
      className: fieldClasses,
    };

    switch (field.type) {
      case 'text':
        return (
          <Input
            type="text"
            placeholder={field.placeholder}
            value={value || ''}
            onChange={(e) => onChange?.(e.target.value)}
            {...commonProps}
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            placeholder={field.placeholder}
            value={value || ''}
            onChange={(e) => onChange?.(e.target.value)}
            min={field.validation?.min}
            max={field.validation?.max}
            {...commonProps}
          />
        );

      case 'email':
        return (
          <Input
            type="email"
            placeholder={field.placeholder}
            value={value || ''}
            onChange={(e) => onChange?.(e.target.value)}
            {...commonProps}
          />
        );

      case 'textarea':
        return (
          <Textarea
            placeholder={field.placeholder}
            value={value || ''}
            onChange={(e) => onChange?.(e.target.value)}
            rows={4}
            {...commonProps}
          />
        );

      case 'select':
        return (
          <Select value={value || ''} onValueChange={onChange} disabled={field.disabled}>
            <SelectTrigger className={fieldClasses}>
              <SelectValue placeholder={field.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'radio':
        return (
          <RadioGroup
            value={value || ''}
            onValueChange={onChange}
            disabled={field.disabled}
            className="space-y-2"
          >
            {field.options?.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={`${field.id}-${option.value}`} />
                <Label htmlFor={`${field.id}-${option.value}`} className="text-sm text-gray-700">
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'checkbox':
        return (
          <div className="space-y-2">
            {field.options?.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`${field.id}-${option.value}`}
                  checked={Array.isArray(value) ? value.includes(option.value) : false}
                  onCheckedChange={(checked) => {
                    if (!onChange) return;
                    const currentValues = Array.isArray(value) ? value : [];
                    if (checked) {
                      onChange([...currentValues, option.value]);
                    } else {
                      onChange(currentValues.filter((v: string) => v !== option.value));
                    }
                  }}
                  disabled={field.disabled}
                />
                <Label htmlFor={`${field.id}-${option.value}`} className="text-sm text-gray-700">
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        );

      case 'date':
        return (
          <Input
            type="date"
            value={value || ''}
            onChange={(e) => onChange?.(e.target.value)}
            {...commonProps}
          />
        );

      case 'time':
        return (
          <Input
            type="time"
            value={value || ''}
            onChange={(e) => onChange?.(e.target.value)}
            {...commonProps}
          />
        );

      default:
        return (
          <Input
            type="text"
            placeholder={field.placeholder}
            value={value || ''}
            onChange={(e) => onChange?.(e.target.value)}
            {...commonProps}
          />
        );
    }
  };

  if (field.hidden && !preview) {
    return null;
  }

  return (
    <div className={getWidthClasses()}>
      <Label className="block text-sm font-medium text-gray-700 mb-2">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      {renderField()}
      {field.helpText && (
        <p className="text-xs text-gray-500 mt-1">{field.helpText}</p>
      )}
    </div>
  );
}
