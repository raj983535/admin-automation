import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';
import styles from './Form.module.css';

interface FormFieldProps {
  label: string;
  htmlFor: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: ReactNode;
}

export function FormField({
  label,
  htmlFor,
  required,
  hint,
  error,
  children,
}: FormFieldProps) {
  return (
    <div className={styles.field}>
      <label htmlFor={htmlFor} className={styles.label}>
        {label}
        {required && <span className={styles.required}>*</span>}
      </label>
      {children}
      {hint && !error && <p className={styles.hint}>{hint}</p>}
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}

export function FormGroup({
  children,
  columns = 1,
}: {
  children: ReactNode;
  columns?: 1 | 2;
}) {
  return (
    <div
      className={styles.group}
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
    >
      {children}
    </div>
  );
}

export function Input({
  className = '',
  error,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { error?: boolean }) {
  return (
    <input
      className={[styles.input, error ? styles.inputError : '', className]
        .filter(Boolean)
        .join(' ')}
      {...props}
    />
  );
}

export function Select({
  className = '',
  error,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { error?: boolean }) {
  return (
    <select
      className={[styles.select, error ? styles.inputError : '', className]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </select>
  );
}

export function Textarea({
  className = '',
  error,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: boolean }) {
  return (
    <textarea
      className={[styles.textarea, error ? styles.inputError : '', className]
        .filter(Boolean)
        .join(' ')}
      {...props}
    />
  );
}

export function Form({
  children,
  onSubmit,
  id,
}: {
  children: ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
  id?: string;
}) {
  return (
    <form id={id} className={styles.form} onSubmit={onSubmit}>
      {children}
    </form>
  );
}
