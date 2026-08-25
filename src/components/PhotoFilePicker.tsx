import { ChangeEvent, ReactNode, useRef } from 'react';
import { IMAGE_FILE_ACCEPT } from '../utils/photoUpload';

interface PhotoFilePickerProps {
  onFileSelected?: (file: File) => void;
  onFilesSelected?: (files: File[]) => void;
  multiple?: boolean;
  maxFiles?: number;
  label: ReactNode;
  className?: string;
  disabled?: boolean;
}

export default function PhotoFilePicker({
  onFileSelected,
  onFilesSelected,
  multiple = false,
  maxFiles,
  label,
  className = '',
  disabled = false,
}: PhotoFilePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.target.files ?? []) as File[];
    event.target.value = '';
    if (selected.length === 0) return;

    if (multiple) {
      const limited = maxFiles ? selected.slice(0, maxFiles) : selected;
      onFilesSelected?.(limited);
      return;
    }

    const first = selected[0];
    if (first) onFileSelected?.(first);
  };

  return (
    <>
      <button
        type="button"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        className={className}
      >
        {label}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={IMAGE_FILE_ACCEPT}
        multiple={multiple}
        onChange={handleChange}
        disabled={disabled}
        className="sr-only"
        aria-hidden="true"
        tabIndex={-1}
      />
    </>
  );
}
