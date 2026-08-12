import { useEffect, useState } from 'react';
import type { Product } from '../../types';
import { getProducts } from '../../api/apiService';
import MenuItem from './MenuItem';

interface MenuListProps {
  onAddToCart: (product: Product) => void;
}

type Status = 'loading' | 'ready' | 'error';

export default function MenuList({ onAddToCart }: MenuListProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<Status>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let cancelled = false;

    getProducts()
      .then((data) => {
        if (cancelled) return;
        setProducts(data);
        setStatus('ready');
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setErrorMessage(err instanceof Error ? err.message : 'Failed to load the menu.');
        setStatus('error');
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (status === 'loading') {
    return <p className="px-6 py-12 text-center text-ink-muted">Loading menu…</p>;
  }

  if (status === 'error') {
    return <p className="px-6 py-12 text-center text-danger">{errorMessage}</p>;
  }

  if (products.length === 0) {
    return <p className="px-6 py-12 text-center text-ink-muted">No items on the menu yet.</p>;
  }

  const byCategory: Record<string, Product[]> = {};
  for (const product of products) {
    (byCategory[product.category] ??= []).push(product);
  }

  return (
    <div className="mx-auto max-w-[960px] space-y-8 p-6">
      {Object.entries(byCategory).map(([category, items]) => (
        <section key={category}>
          <h2 className="mb-3 border-b border-border pb-2 text-lg text-primary-dark">
            {category}
          </h2>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
            {items.map((product) => (
              <MenuItem key={product.id} product={product} onAddToCart={onAddToCart} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}