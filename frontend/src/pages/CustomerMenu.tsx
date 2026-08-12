import { useState } from 'react';
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
      setCheckoutError('Enter a table number before checking out.');
      return;
    }
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

  const qrUrl = `${window.location.origin}${window.location.pathname}?table=${encodeURIComponent(
    tableNumber
  )}`;

  return (
    <>
      <Navbar cartItemCount={cartItemCount} onCartClick={() => setIsCartOpen(true)} />

      <div className="mx-auto flex max-w-240 flex-wrap items-center gap-3 px-6 pt-6">
        <label htmlFor="table-number" className="text-sm font-medium text-ink-muted">
          Table
        </label>
        <input
          id="table-number"
          type="text"
          value={tableNumber}
          onChange={(event) => setTableNumber(event.target.value)}
          placeholder="e.g. 5"
          className="w-24 rounded-md border border-border px-3 py-1.5 text-sm focus-visible:outline-2 focus-visible:outline-primary"
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