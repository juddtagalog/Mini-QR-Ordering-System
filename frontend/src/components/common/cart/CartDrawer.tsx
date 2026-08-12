import { Minus, Plus, X } from 'lucide-react';
import type { CartItem } from '../../../types';

interface CartDrawerProps {
  isOpen: boolean;
  items: CartItem[];
  onClose: () => void;
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemoveItem: (productId: number) => void;
  onCheckout: () => void;
}

export default function CartDrawer({
  isOpen,
  items,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}: CartDrawerProps) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <>
      <div
        className={`fixed inset-0 z-20 bg-ink/40 transition-opacity duration-200 ${
          isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
      />
      <aside
        className={`fixed top-0 right-0 bottom-0 z-30 flex w-[min(380px,100vw)] flex-col bg-surface shadow-[-8px_0_24px_rgba(32,31,28,0.12)] transition-transform duration-200 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-hidden={!isOpen}
        aria-label="Your cart"
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-lg">Your Order</h2>
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-ink-muted hover:bg-bg"
            onClick={onClose}
            aria-label="Close cart"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        {items.length === 0 ? (
          <p className="px-6 py-12 text-center text-ink-muted">
            Your cart is empty. Add something from the menu.
          </p>
        ) : (
          <ul className="flex-1 list-none overflow-y-auto p-0 m-0">
            {items.map((item) => (
              <li key={item.product_id} className="border-b border-border px-6 py-4">
                <div className="mb-2 flex justify-between gap-2">
                  <span className="font-medium">{item.name}</span>
                  <span className="font-display font-semibold whitespace-nowrap text-primary-dark">
                    ₱{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-border bg-surface text-ink hover:border-primary hover:text-primary"
                    onClick={() => onUpdateQuantity(item.product_id, Math.max(1, item.quantity - 1))}
                    aria-label={`Decrease quantity of ${item.name}`}
                  >
                    <Minus size={14} aria-hidden="true" />
                  </button>
                  <span className="min-w-5 text-center font-medium">{item.quantity}</span>
                  <button
                    type="button"
                    className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-border bg-surface text-ink hover:border-primary hover:text-primary"
                    onClick={() => onUpdateQuantity(item.product_id, item.quantity + 1)}
                    aria-label={`Increase quantity of ${item.name}`}
                  >
                    <Plus size={14} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    className="ml-auto px-2 py-1 text-xs text-danger hover:underline"
                    onClick={() => onRemoveItem(item.product_id)}
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="border-t border-border px-6 py-4">
          <div className="mb-3 flex items-baseline justify-between font-display text-lg font-semibold">
            <span>Total</span>
            <span>₱{total.toFixed(2)}</span>
          </div>
          <button
            type="button"
            className="w-full rounded-lg bg-primary py-3 font-semibold text-white transition hover:brightness-90 disabled:cursor-not-allowed disabled:bg-border disabled:text-ink-muted disabled:hover:brightness-100"
            onClick={onCheckout}
            disabled={items.length === 0}
          >
            Checkout
          </button>
        </div>
      </aside>
    </>
  );
}