import { type FormField } from "@shared/schema";

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export interface ComponentType {
  type: FormField['type'];
  label: string;
  description: string;
  icon: string;
  defaultProps: Omit<FormField, 'id' | 'type'>;
}

export const componentTypes: ComponentType[] = [
  {
    type: 'text',
    label: 'Text Input',
    description: 'Single line text field',
    icon: 'fa-align-left',
    defaultProps: {
      label: 'Text Input',
      placeholder: 'Enter text...',
      required: false,
      disabled: false,
      hidden: false,
      size: 'medium',
      width: 'full',
    },
  },
  {
    type: 'number',
    label: 'Number',
    description: 'Numeric input field',
    icon: 'fa-hashtag',
    defaultProps: {
      label: 'Number Input',
      placeholder: 'Enter number...',
      required: false,
      disabled: false,
      hidden: false,
      size: 'medium',
      width: 'full',
    },
  },
  {
    type: 'email',
    label: 'Email',
    description: 'Email input field',
    icon: 'fa-envelope',
    defaultProps: {
      label: 'Email Address',
      placeholder: 'Enter email address...',
      required: false,
      disabled: false,
      hidden: false,
      size: 'medium',
      width: 'full',
    },
  },
  {
    type: 'textarea',
    label: 'Textarea',
    description: 'Multi-line text field',
    icon: 'fa-align-justify',
    defaultProps: {
      label: 'Message',
      placeholder: 'Enter your message...',
      required: false,
      disabled: false,
      hidden: false,
      size: 'medium',
      width: 'full',
    },
  },
  {
    type: 'select',
    label: 'Dropdown',
    description: 'Select from list',
    icon: 'fa-chevron-down',
    defaultProps: {
      label: 'Select Option',
      placeholder: 'Choose an option...',
      required: false,
      disabled: false,
      hidden: false,
      size: 'medium',
      width: 'full',
      options: [
        { label: 'Option 1', value: 'option1' },
        { label: 'Option 2', value: 'option2' },
        { label: 'Option 3', value: 'option3' },
      ],
    },
  },
  {
    type: 'radio',
    label: 'Radio Group',
    description: 'Single choice selection',
    icon: 'fa-dot-circle',
    defaultProps: {
      label: 'Choose One',
      required: false,
      disabled: false,
      hidden: false,
      size: 'medium',
      width: 'full',
      options: [
        { label: 'Option 1', value: 'option1' },
        { label: 'Option 2', value: 'option2' },
        { label: 'Option 3', value: 'option3' },
      ],
    },
  },
  {
    type: 'checkbox',
    label: 'Checkbox Group',
    description: 'Multiple selections',
    icon: 'fa-check-square',
    defaultProps: {
      label: 'Select All That Apply',
      required: false,
      disabled: false,
      hidden: false,
      size: 'medium',
      width: 'full',
      options: [
        { label: 'Option 1', value: 'option1' },
        { label: 'Option 2', value: 'option2' },
        { label: 'Option 3', value: 'option3' },
      ],
    },
  },
  {
    type: 'date',
    label: 'Date Picker',
    description: 'Select date',
    icon: 'fa-calendar',
    defaultProps: {
      label: 'Date',
      placeholder: 'Select date...',
      required: false,
      disabled: false,
      hidden: false,
      size: 'medium',
      width: 'full',
    },
  },
  {
    type: 'time',
    label: 'Time Picker',
    description: 'Select time',
    icon: 'fa-clock',
    defaultProps: {
      label: 'Time',
      placeholder: 'Select time...',
      required: false,
      disabled: false,
      hidden: false,
      size: 'medium',
      width: 'full',
    },
  },
];

export const componentCategories = [
  {
    title: 'Basic Inputs',
    types: ['text', 'number', 'email', 'textarea'],
  },
  {
    title: 'Choice Inputs',
    types: ['select', 'radio', 'checkbox'],
  },
  {
    title: 'Date & Time',
    types: ['date', 'time'],
  },
];
