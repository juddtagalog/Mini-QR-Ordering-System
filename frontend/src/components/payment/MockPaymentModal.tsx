import { useState } from 'react';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';

interface MockPaymentModalProps {
  isOpen: boolean;
  amount: number;
  onClose: () => void;
  onResult: (success: boolean) => void;
}

type PaymentState = 'idle' | 'processing';

const SIMULATED_PROCESSING_MS = 1200;

export default function MockPaymentModal({
  isOpen,
  amount,
  onClose,
  onResult,
}: MockPaymentModalProps) {
  const [state, setState] = useState<PaymentState>('idle');

  if (!isOpen) return null;

  function simulate(success: boolean) {
    setState('processing');
    window.setTimeout(() => {
      setState('idle');
      onResult(success);
    }, SIMULATED_PROCESSING_MS);
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-ink/40 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-surface p-6">
        <h2 className="mb-1 text-lg">Payment</h2>
        <p className="mb-6 text-sm text-ink-muted">
          Simulated payment gateway. No real transaction is processed.
        </p>

        <div className="mb-6 rounded-xl border border-border p-4 text-center">
          <span className="text-sm text-ink-muted">Amount due</span>
          <p className="font-display text-2xl font-semibold text-primary-dark">
            ₱{amount.toFixed(2)}
          </p>
        </div>

        {state === 'processing' ? (
          <div className="flex flex-col items-center gap-2 py-4 text-ink-muted">
            <Loader2 className="animate-spin" size={28} aria-hidden="true" />
            <span>Processing payment…</span>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => simulate(true)}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary py-2.5 font-semibold text-white transition hover:brightness-90"
            >
              <CheckCircle2 size={18} aria-hidden="true" />
              Simulate Successful Payment
            </button>
            <button
              type="button"
              onClick={() => simulate(false)}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-danger py-2.5 font-semibold text-danger transition hover:bg-danger/5"
            >
              <XCircle size={18} aria-hidden="true" />
              Simulated Failed Payment
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-1 py-2 text-sm text-ink-muted hover:underline"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}