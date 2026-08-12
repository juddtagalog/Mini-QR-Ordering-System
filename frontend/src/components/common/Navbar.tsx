import { ShoppingBag } from 'lucide-react';

interface NavbarProps {
    title?: string,
    cartItemCount: number,
    onCartClick: ()=> void,
}

export default function Navbar({
    title = 'Mini QR Ordering',
    cartItemCount,
    onCartClick,
}: NavbarProps) {
    return (
        <header className="sticky top-0 z-10 flex items-center justify-between bg-primary px-6 py-4 text-white">
      <h1 className="text-xl tracking-wide">{title}</h1>
      <button
        type="button"
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary-dark text-white transition hover:brightness-90"
        onClick={onCartClick}
        aria-label={`Open cart, ${cartItemCount} item${cartItemCount === 1 ? '' : 's'}`}
      >
        <ShoppingBag size={20} strokeWidth={2} aria-hidden="true" />
        {cartItemCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-xs font-semibold text-ink">
            {cartItemCount}
          </span>
        )}
      </button>
    </header>
    );
} 