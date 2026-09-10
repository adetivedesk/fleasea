import { ORDER_STATUS, ORDER_TIMELINE } from '@/constants';
import type { OrderStatus } from '@/constants/status';
import { humanizeStatus, formatDateTime } from '@/utils/format';
import { StepTimeline, type TimelineStep } from '@/components/common/StepTimeline';
import type { Order } from '@/types';

/** Order Placed → Confirmed → Processing → Packed → Shipped → Out for Delivery → Delivered (spec §25). */
export function OrderTimeline({ order }: { order: Order }) {
  if (order.status === ORDER_STATUS.CANCELLED) {
    const steps: TimelineStep[] = order.timeline.map((e) => ({
      label: humanizeStatus(e.status),
      at: formatDateTime(e.at),
      note: e.note,
      state: e.status === ORDER_STATUS.CANCELLED ? 'current' : 'done',
    }));
    return <StepTimeline steps={steps} />;
  }

  const flow: OrderStatus[] = ORDER_TIMELINE.filter((s) => s !== ORDER_STATUS.DRAFT);
  const currentIdx = flow.findIndex((s) => s === order.status);
  const byStatus = new Map(order.timeline.map((e) => [e.status, e]));

  const steps: TimelineStep[] = flow.map((status, i) => {
    const entry = byStatus.get(status);
    return {
      label: status === ORDER_STATUS.PENDING_PAYMENT ? 'Order placed' : humanizeStatus(status),
      at: entry ? formatDateTime(entry.at) : undefined,
      note: entry?.note,
      state: i < currentIdx ? 'done' : i === currentIdx ? 'current' : 'todo',
    };
  });
  return <StepTimeline steps={steps} />;
}
