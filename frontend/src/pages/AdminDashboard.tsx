import { useCallback, useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import OrderTable from '../components/admin/OrderTable';
import { getOrders, updateOrderStatus, ApiRequestError } from '../api/apiService';
import type { Order, OrderStatus } from '../types';

type Status = 'loading' | 'ready' | 'error';

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [status, setStatus] = useState<Status>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(null);

  const loadOrders = useCallback(async () => {
    setStatus('loading');
    try {
      const data = await getOrders();
      setOrders(data);
      setStatus('ready');
      setErrorMessage('');
    } catch (error) {
      setErrorMessage(
        error instanceof ApiRequestError ? error.message : 'Failed to load orders.'
      );
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  async function handleStatusChange(orderId: number, newStatus: OrderStatus) {
    setUpdatingOrderId(orderId);
    try {
      const updated = await updateOrderStatus(orderId, newStatus);
      setOrders((prev) => prev.map((order) => (order.id === orderId ? updated : order)));
      setErrorMessage('');
    } catch (error) {
      setErrorMessage(
        error instanceof ApiRequestError ? error.message : 'Failed to update order status.'
      );
    } finally {
      setUpdatingOrderId(null);
    }
  }

  return (
    <>
      <header className="sticky top-0 z-10 flex items-center justify-between bg-primary px-6 py-4 text-white">
        <h1 className="text-xl tracking-wide">Admin Dashboard</h1>
        <button
          type="button"
          onClick={loadOrders}
          disabled={status === 'loading'}
          className="inline-flex items-center gap-2 rounded-lg bg-primary-dark px-3 py-2 text-sm font-medium transition hover:brightness-90 disabled:opacity-60"
        >
          <RefreshCw
            size={16}
            className={status === 'loading' ? 'animate-spin' : ''}
            aria-hidden="true"
          />
          Refresh
        </button>
      </header>

      <div className="mx-auto max-w-5xl p-4 sm:p-6">
        {errorMessage && (
          <p className="mb-4 rounded-lg border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
            {errorMessage}
          </p>
        )}

        {status === 'loading' && orders.length === 0 ? (
          <p className="px-6 py-12 text-center text-ink-muted">Loading orders…</p>
        ) : (
          <OrderTable
            orders={orders}
            onStatusChange={handleStatusChange}
            updatingOrderId={updatingOrderId}
          />
        )}
      </div>
    </>
  );
}