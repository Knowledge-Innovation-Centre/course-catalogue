import { useEffect, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { FileBadge, X } from 'lucide-react';
import { theme } from '../theme';
import { downloadEdcTemplate } from '../services/edcService';

interface EdcTemplateButtonProps {
  courseId: string;
  instanceId?: string;
  label?: string;
  className?: string;
}

interface Recipient {
  givenName: string;
  familyName: string;
  deliveryAddress: string;
}

// Remember the last recipient for this page session, so it needn't be retyped per offering.
let lastRecipient: Recipient = { givenName: '', familyName: '', deliveryAddress: '' };

export function EdcTemplateButton({ courseId, instanceId, label = 'EDC template', className = '' }: EdcTemplateButtonProps) {
  const [open, setOpen] = useState(false);
  const [recipient, setRecipient] = useState<Recipient>(lastRecipient);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openDialog = () => {
    setRecipient(lastRecipient);
    setError(null);
    setOpen(true);
  };

  const close = () => {
    if (!submitting) setOpen(false);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const update = (field: keyof Recipient) => (e: ChangeEvent<HTMLInputElement>) =>
    setRecipient(r => ({ ...r, [field]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const trimmed: Recipient = {
      givenName: recipient.givenName.trim(),
      familyName: recipient.familyName.trim(),
      deliveryAddress: recipient.deliveryAddress.trim(),
    };
    try {
      await downloadEdcTemplate({ courseId, instanceId, ...trimmed });
      lastRecipient = trimmed;
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Download failed');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    'w-full px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:border-transparent';
  const ringStyle = { ['--tw-ring-color' as any]: theme.colors.accent };

  return (
    <>
      <button
        type="button"
        onClick={openDialog}
        className={`shrink-0 h-9 px-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center gap-2 text-sm font-medium text-gray-700 transition-colors cursor-pointer whitespace-nowrap ${className}`}
        title="Download an EDC credential template"
      >
        <FileBadge className="w-4 h-4" style={{ color: theme.colors.accent }} />
        {label}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onMouseDown={e => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="edc-dialog-title"
            className="bg-white rounded-lg shadow-xl w-full max-w-sm p-6 flex flex-col gap-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-0.5">
                <h2 id="edc-dialog-title" className="font-semibold text-lg text-gray-900">
                  EDC credential template
                </h2>
                <p className="text-sm text-gray-500">
                  {instanceId ? 'For this offering' : 'For this learning opportunity'}
                </p>
              </div>
              <button
                type="button"
                onClick={close}
                className="text-gray-400 hover:text-gray-700 cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                Given name
                <input
                  type="text"
                  required
                  autoFocus
                  autoComplete="given-name"
                  value={recipient.givenName}
                  onChange={update('givenName')}
                  className={inputClass}
                  style={ringStyle}
                />
              </label>
              <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                Family name
                <input
                  type="text"
                  required
                  autoComplete="family-name"
                  value={recipient.familyName}
                  onChange={update('familyName')}
                  className={inputClass}
                  style={ringStyle}
                />
              </label>
              <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                Recipient email
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={recipient.deliveryAddress}
                  onChange={update('deliveryAddress')}
                  className={inputClass}
                  style={ringStyle}
                />
              </label>

              {error && <p className="text-sm text-red-600 break-words">{error}</p>}

              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={close}
                  disabled={submitting}
                  className="h-9 px-4 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="h-9 px-4 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90 cursor-pointer disabled:opacity-60 disabled:cursor-wait"
                  style={{ backgroundColor: theme.colors.accent }}
                >
                  {submitting ? 'Downloading…' : 'Download'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
