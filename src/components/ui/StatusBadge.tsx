import { STATUS_TONE, type StatusTone } from '@/constants/status';
import { humanizeStatus } from '@/utils/format';
import { Badge } from './primitives';

const TONE_MAP: Record<StatusTone, 'neutral' | 'info' | 'success' | 'warning' | 'danger'> = {
  neutral: 'neutral',
  info: 'info',
  success: 'success',
  warning: 'warning',
  danger: 'danger',
};

export function StatusBadge({ status }: { status: string }) {
  const tone = TONE_MAP[STATUS_TONE[status] ?? 'neutral'];
  return <Badge tone={tone}>{humanizeStatus(status)}</Badge>;
}
