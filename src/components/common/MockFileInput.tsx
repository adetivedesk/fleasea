import { useRef, useState } from 'react';
import { Paperclip, X } from 'lucide-react';

export interface MockFileMeta {
  fileName: string;
  sizeKb: number;
}

/** Frontend-only file picker — captures name + size, never uploads (spec §12, §59). */
export function MockFileInput({
  label,
  onChange,
}: {
  label: string;
  onChange?: (file: MockFileMeta | null) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<MockFileMeta | null>(null);

  const pick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    const meta = f ? { fileName: f.name, sizeKb: Math.max(1, Math.round(f.size / 1024)) } : null;
    setFile(meta);
    onChange?.(meta);
  };

  const clear = () => {
    setFile(null);
    onChange?.(null);
    if (ref.current) ref.current.value = '';
  };

  return (
    <div>
      <span className="mb-1 block text-sm font-medium text-ink-700">{label}</span>
      {file ? (
        <div className="flex items-center justify-between rounded-lg border border-ink-200 bg-ink-50 px-3 py-2 text-sm">
          <span className="flex items-center gap-2 truncate text-ink-700">
            <Paperclip className="h-4 w-4 shrink-0 text-sea-600" />
            <span className="truncate">{file.fileName}</span>
            <span className="text-ink-400">({file.sizeKb} KB)</span>
          </span>
          <button type="button" onClick={clear} aria-label="Remove file" className="text-ink-400 hover:text-ink-700">
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => ref.current?.click()}
          className="flex w-full items-center gap-2 rounded-lg border border-dashed border-ink-300 px-3 py-2 text-sm text-ink-500 hover:border-sea-400 hover:text-ink-700"
        >
          <Paperclip className="h-4 w-4" /> Choose file
        </button>
      )}
      <input ref={ref} type="file" className="hidden" onChange={pick} />
    </div>
  );
}
