import { Plus } from 'lucide-react';
import type { Product } from '../../types';

interface MenuItemProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export default function MenuItem({ product, onAddToCart }: MenuItemProps) {
  return (
    <article className="flex min-h-[148px] flex-col justify-between gap-3 rounded-2xl border border-border bg-surface p-4">
      <div>
        <h3 className="mb-1 text-lg">{product.name}</h3>
        <p className="text-sm leading-snug text-ink-muted">{product.description}</p>
      </div>
      <div className="flex items-center justify-between gap-3">
        <span className="font-display text-lg font-semibold text-primary-dark">
          ₱{product.price.toFixed(2)}
        </span>
        <button
          type="button"
          className="inline-flex items-center gap-1 rounded-md bg-accent px-3 py-2 text-sm font-semibold text-ink transition hover:brightness-90 disabled:cursor-not-allowed disabled:bg-border disabled:text-ink-muted disabled:hover:brightness-100"
          onClick={() => onAddToCart(product)}
          disabled={!product.is_available}
        >
          {product.is_available ? (
            <>
              <Plus size={16} strokeWidth={2.5} aria-hidden="true" />
              Add
            </>
          ) : (
            'Unavailable'
          )}
        </button>
      </div>
    </article>
  );
}