import { Fragment, useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { Order, OrderStatus } from '../../types';

interface OrderTableProps {
  orders: Order[];
  onStatusChange: (orderId: number, status: OrderStatus) => void;
  updatingOrderId: number | null;
}

const STATUS_OPTIONS: OrderStatus[] = ['Pending', 'Paid', 'Failed'];

const STATUS_STYLES: Record<OrderStatus, string> = {
  Pending: 'bg-accent/15 text-accent-dark',
  Paid: 'bg-primary/15 text-primary-dark',
  Failed: 'bg-danger/15 text-danger',
};

function formatDate(value: string): string {
  const date = new Date(value.replace(' ', 'T'));
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function OrderTable({ orders, onStatusChange, updatingOrderId }: OrderTableProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  if (orders.length === 0) {
    return <p className="px-6 py-12 text-center text-ink-muted">No orders yet.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full min-w-180 border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-border bg-bg text-ink-muted">
            <th className="w-10 px-4 py-3" />
            <th className="px-4 py-3 font-medium">Order</th>
            <th className="px-4 py-3 font-medium">Table</th>
            <th className="px-4 py-3 font-medium">Customer</th>
            <th className="px-4 py-3 font-medium">Placed</th>
            <th className="px-4 py-3 font-medium">Total</th>
            <th className="px-4 py-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const isExpanded = expandedId === order.id;
            const isUpdating = updatingOrderId === order.id;

            return (
              <Fragment key={order.id}>
                <tr className="border-b border-border last:border-0">
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => setExpandedId(isExpanded ? null : order.id)}
                      aria-label={isExpanded ? 'Collapse items' : 'Expand items'}
                      aria-expanded={isExpanded}
                      className="text-ink-muted hover:text-ink"
                    >
                      {isExpanded ? (
                        <ChevronDown size={16} aria-hidden="true" />
                      ) : (
                        <ChevronRight size={16} aria-hidden="true" />
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-3 font-medium">#{order.id}</td>
                  <td className="px-4 py-3">{order.table_number}</td>
                  <td className="px-4 py-3 text-ink-muted">{order.customer_name ?? '—'}</td>
                  <td className="px-4 py-3 text-ink-muted">{formatDate(order.created_at)}</td>
                  <td className="px-4 py-3 font-display font-semibold text-primary-dark">
                    ₱{order.total_amount.toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {STATUS_OPTIONS.map((option) => (
                        <button
                          key={option}
                          type="button"
                          disabled={isUpdating || option === order.status}
                          onClick={() => onStatusChange(order.id, option)}
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold transition disabled:cursor-default ${
                            option === order.status
                              ? STATUS_STYLES[option]
                              : 'text-ink-muted hover:bg-bg'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
                {isExpanded && (
                  <tr className="border-b border-border bg-bg/50 last:border-0">
                    <td />
                    <td colSpan={6} className="px-4 py-3">
                      <ul className="space-y-1">
                        {order.items.map((item, index) => (
                          <li key={index} className="flex justify-between text-ink-muted">
                            <span>
                              {item.quantity}× {item.name ?? `Product #${item.product_id}`}
                            </span>
                            <span>₱{(item.price * item.quantity).toFixed(2)}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}