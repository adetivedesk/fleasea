import { SHIPMENT_TIMELINE } from '@/constants';
import { humanizeStatus } from '@/utils/format';
import { StepTimeline, type TimelineStep } from '@/components/common/StepTimeline';
import type { Shipment } from '@/types';

/** Preparing → Packed → Dispatched → In Transit → At Destination → Out for Delivery → Delivered (spec §26). */
export function ShipmentTimeline({ shipment }: { shipment: Shipment }) {
  const idx = SHIPMENT_TIMELINE.indexOf(shipment.status);
  const steps: TimelineStep[] = SHIPMENT_TIMELINE.map((status, i) => ({
    label: humanizeStatus(status),
    state: i < idx ? 'done' : i === idx ? 'current' : 'todo',
  }));
  return <StepTimeline steps={steps} />;
}
