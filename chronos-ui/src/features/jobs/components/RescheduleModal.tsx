import { useState } from 'react';

interface RescheduleModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (newScheduledAt: string) => Promise<unknown>;
}

export const RescheduleModal = ({ open, onClose, onSubmit }: RescheduleModalProps) => {
  const [value, setValue] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!open) {
    return null;
  }

  const submit = async () => {
    if (!value) {
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(new Date(value).toISOString());
      onClose();
      setValue('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(event) => event.stopPropagation()}>
        <h3>Reschedule Job</h3>
        <input
          type="datetime-local"
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
        <div className="modal-actions">
          <button type="button" className="ghost-btn" onClick={onClose}>
            Close
          </button>
          <button type="button" onClick={submit} disabled={submitting || !value}>
            {submitting ? 'Saving...' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
};
