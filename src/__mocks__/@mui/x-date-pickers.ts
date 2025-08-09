const React = require('react');

export const AdapterDateFns = class MockAdapterDateFns {
  constructor() {}
};

interface LocalizationProviderProps {
  children: React.ReactNode;
}

export const LocalizationProvider = ({ children }: LocalizationProviderProps) => {
  return React.createElement('div', { 'data-testid': 'localization-provider' }, children);
};

interface DatePickerProps {
  label?: string;
  onChange?: (date: Date | null) => void;
  value?: Date | null | string;
  [key: string]: any;
}

export const DatePicker = ({ label, onChange, value, ...props }: DatePickerProps) => {
  const testId = `date-picker-${label?.toLowerCase().replace(/\s+/g, '-') || 'date'}`;
  return React.createElement('div', { 'data-testid': testId }, 
    React.createElement('input', {
      type: 'date',
      onChange: (e: any) => onChange?.(new Date(e.target.value)),
      value: value ? new Date(value).toISOString().split('T')[0] : '',
      'aria-label': label,
      ...props
    })
  );
};

interface StaticDatePickerProps {
  onChange?: (date: Date | null) => void;
  value?: Date | null | string;
  [key: string]: any;
}

export const StaticDatePicker = ({ onChange, value, ...props }: StaticDatePickerProps) => {
  return React.createElement('div', { 'data-testid': 'static-date-picker' },
    React.createElement('input', {
      type: 'date',
      onChange: (e: any) => onChange?.(new Date(e.target.value)),
      value: value ? new Date(value).toISOString().split('T')[0] : '',
      ...props
    })
  );
};

interface TimePickerProps {
  label?: string;
  onChange?: (time: Date | null) => void;
  value?: Date | null | string;
  [key: string]: any;
}

export const TimePicker = ({ label, onChange, value, ...props }: TimePickerProps) => {
  const testId = `time-picker-${label?.toLowerCase().replace(/\s+/g, '-') || 'time'}`;
  return React.createElement('div', { 'data-testid': testId },
    React.createElement('input', {
      type: 'time',
      onChange: (e: any) => onChange?.(new Date(`2000-01-01T${e.target.value}:00`)),
      value: value ? new Date(value).toTimeString().slice(0, 5) : '',
      'aria-label': label,
      ...props
    })
  );
};
