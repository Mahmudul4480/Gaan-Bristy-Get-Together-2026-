import { ChangeEvent, ReactNode, useRef } from 'react';
import { IMAGE_FILE_ACCEPT } from '../utils/photoUpload';

interface PhotoFilePickerProps {
  onFileSelected: (file: File) => void;
  label: ReactNode;
  className?: string;
  disabled?: boolean;
}

export default function PhotoFilePicker({
  onFileSelected,
  label,
  className = '',
  disabled = false,
}: PhotoFilePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0];
    event.target.value = '';
    if (selected) onFileSelected(selected);
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
        onChange={handleChange}
        disabled={disabled}
        className="sr-only"
        aria-hidden="true"
        tabIndex={-1}
      />
    </>
  );
}
