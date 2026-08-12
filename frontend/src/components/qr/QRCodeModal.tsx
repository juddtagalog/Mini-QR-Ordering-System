import { useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X } from 'lucide-react';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  tableNumber: string;
}

export default function QRCodeModal({ isOpen, onClose, url, tableNumber }: QRCodeModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  async function handleCopyLink() {
    await navigator.clipboard.writeText(url);
  }

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-ink/40 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-surface p-6"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`QR code for table ${tableNumber}`}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg">Table {tableNumber || '—'}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-ink-muted hover:bg-bg"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <div className="flex justify-center rounded-xl border border-border p-4">
          <QRCodeSVG value={url} size={200} fgColor="#164f42" marginSize={2} />
        </div>

        <p className="mt-4 break-all text-center text-sm text-ink-muted">{url}</p>

        <button
          type="button"
          onClick={handleCopyLink}
          className="mt-4 w-full rounded-lg border border-border py-2 text-sm font-medium text-ink transition hover:border-primary hover:text-primary"
        >
          Copy link
        </button>
      </div>
    </div>
  );
}