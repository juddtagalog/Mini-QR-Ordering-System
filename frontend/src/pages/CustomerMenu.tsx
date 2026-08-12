import { useState, useRef } from 'react';
import { useSearchParams } from 'react-router';
import { QrCode } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import MenuList from '../components/menu/MenuList';
import CartDrawer from '../components/common/cart/CartDrawer';
import QRCodeModal from '../components/qr/QRCodeModal';
import MockPaymentModal from '../components/payment/MockPaymentModal';
import { createOrder, ApiRequestError } from '../api/apiService';
import type { CartItem, Order, Product } from '../types';


export default function CustomerMenu() {
  const [searchParams] = useSearchParams();
  const [tableNumber, setTableNumber] = useState(() => searchParams.get('table') ?? '');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [tableInputError, setTableInputError] = useState(false);
  const tableInputRef = useRef<HTMLInputElement>(null);


  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  function handleAddToCart(product: Product) {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product_id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product_id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        { product_id: product.id, name: product.name, price: product.price, quantity: 1 },
      ];
    });
    setIsCartOpen(true);
  }

  function handleUpdateQuantity(productId: number, quantity: number) {
    setCartItems((prev) =>
      prev.map((item) => (item.product_id === productId ? { ...item, quantity } : item))
    );
  }

  function handleRemoveItem(productId: number) {
    setCartItems((prev) => prev.filter((item) => item.product_id !== productId));
  }

  function handleCheckout() {
    if (!tableNumber.trim()) {
        setToast('Please enter your table number before checking out.');
        setTableInputError(true);
        setIsCartOpen(false);
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => {
        tableInputRef.current?.focus();
        }, 300);
        
        setTimeout(() => setToast(null), 4000);
        
        return;
    }
    
    setTableInputError(false);
    setToast(null);
    setCheckoutError('');
    setIsCartOpen(false);
    setIsPaymentModalOpen(true);
    }

  async function handlePaymentResult(success: boolean) {
    setIsPaymentModalOpen(false);

    if (!success) {
      setCheckoutError('Payment was not successful. Your cart has been kept — please try again.');
      return;
    }

    try {
      const order = await createOrder({
        table_number: tableNumber.trim(),
        items: cartItems.map(({ product_id, name, price, quantity }) => ({
          product_id,
          name,
          price,
          quantity,
        })),
      });
      setCartItems([]);
      setCheckoutError('');
      setConfirmedOrder(order);
    } catch (error) {
      const message =
        error instanceof ApiRequestError
          ? error.message
          : 'Payment succeeded but the order could not be submitted. Please notify staff.';
      setCheckoutError(message);
    }
  }

  const qrUrl = `http://192.168.0.118:5173/?table=${encodeURIComponent(tableNumber)}`;

  return (
    <>
    {toast && (
      <div className="fixed top-20 left-1/2 z-50 -translate-x-1/2 animate-bounce">
        <div className="flex items-center gap-2 rounded-lg bg-danger px-5 py-3 font-medium text-white shadow-lg">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {toast}
        </div>
      </div>
    )}
      <Navbar cartItemCount={cartItemCount} onCartClick={() => setIsCartOpen(true)} />

      <div className="mx-auto flex max-w-240 flex-wrap items-start gap-3 px-6 pt-6">
        <div>
            <div className="flex items-center gap-3">
            <label
                htmlFor="table-number"
                className={`text-sm font-medium transition-colors ${
                tableInputError ? 'text-danger' : 'text-ink-muted'
                }`}
            >
                Table
            </label>
            <input
                ref={tableInputRef}
                id="table-number"
                type="text"
                value={tableNumber}
                onChange={(event) => {
                setTableNumber(event.target.value);
                if (event.target.value.trim()) {
                    setTableInputError(false);
                }
                }}
                placeholder="e.g. 5"
                className={`w-24 rounded-md border px-3 py-1.5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-primary ${
                tableInputError
                    ? 'border-danger bg-danger/5 ring-2 ring-danger/30'
                    : 'border-border'
                }`}
            />
            <button
                type="button"
                onClick={() => setIsQrModalOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-ink transition hover:border-primary hover:text-primary"
            >
                <QrCode size={16} aria-hidden="true" />
                Show table QR
            </button>
            </div>
            {tableInputError && (
            <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-danger">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                Required — enter your table number to continue
            </p>
            )}
        </div>
        </div>

      {checkoutError && (
        <p className="mx-auto max-w-240 px-6 pt-3 text-sm text-danger">{checkoutError}</p>
      )}

      {confirmedOrder && (
        <div className="mx-auto max-w-240 px-6 pt-4">
          <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
            <p className="font-semibold text-primary-dark">
              Order #{confirmedOrder.id} placed for table {confirmedOrder.table_number}
            </p>
            <p className="text-sm text-ink-muted">
              Status: {confirmedOrder.status} · Total: ₱{confirmedOrder.total_amount.toFixed(2)}
            </p>
            <button
              type="button"
              onClick={() => setConfirmedOrder(null)}
              className="mt-2 text-sm font-medium text-primary hover:underline"
            >
              Place another order
            </button>
          </div>
        </div>
      )}

      <MenuList onAddToCart={handleAddToCart} />

      <CartDrawer
        isOpen={isCartOpen}
        items={cartItems}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
      />

      <QRCodeModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        url={qrUrl}
        tableNumber={tableNumber}
      />

      <MockPaymentModal
        isOpen={isPaymentModalOpen}
        amount={cartTotal}
        onClose={() => setIsPaymentModalOpen(false)}
        onResult={handlePaymentResult}
      />
    </>
  );
}