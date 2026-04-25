import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import type { CreateJobRequest } from '../../../types/api';
import { toIsoString } from '../../../lib/date';

const schema = z
  .object({
    name: z.string().min(2),
    description: z.string().optional(),
    taskType: z.enum(['EMAIL', 'WEBHOOK']),
    payload: z.string().min(2),
    scheduleType: z.enum(['ONE_TIME', 'RECURRING']),
    recurrenceFrequency: z
      .enum(['MINUTE', 'HOURLY', 'DAILY', 'WEEKLY', 'MONTHLY'])
      .optional(),
    scheduledAt: z.string().min(1),
    maxAttempts: z.number().min(1).max(10),
  })
  .superRefine((value, ctx) => {
    if (value.scheduleType === 'RECURRING' && !value.recurrenceFrequency) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['recurrenceFrequency'],
        message: 'Recurrence frequency is required for recurring jobs',
      });
    }
  });

type JobCreateFormData = z.infer<typeof schema>;

interface JobCreateFormProps {
  onCreate: (payload: CreateJobRequest) => Promise<unknown>;
}

export const JobCreateForm = ({ onCreate }: JobCreateFormProps) => {
  const {
    register,
    watch,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<JobCreateFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      taskType: 'EMAIL',
      scheduleType: 'ONE_TIME',
      maxAttempts: 3,
    },
  });

  const scheduleType = watch('scheduleType');

  const onSubmit = async (values: JobCreateFormData) => {
    await onCreate({
      ...values,
      scheduledAt: toIsoString(values.scheduledAt),
      recurrenceFrequency: values.scheduleType === 'RECURRING' ? values.recurrenceFrequency : undefined,
    });
    reset();
  };

  return (
    <form className="card form-grid" onSubmit={handleSubmit(onSubmit)}>
      <h3>Create Job</h3>

      <label>
        Name
        <input {...register('name')} />
        {errors.name ? <span className="field-error">{errors.name.message}</span> : null}
      </label>

      <label>
        Description
        <input {...register('description')} />
      </label>

      <label>
        Task Type
        <select {...register('taskType')}>
          <option value="EMAIL">EMAIL</option>
          <option value="WEBHOOK">WEBHOOK</option>
        </select>
      </label>

      <label>
        Payload (JSON string)
        <textarea rows={4} {...register('payload')} />
      </label>

      <label>
        Schedule Type
        <select {...register('scheduleType')}>
          <option value="ONE_TIME">ONE_TIME</option>
          <option value="RECURRING">RECURRING</option>
        </select>
      </label>

      {scheduleType === 'RECURRING' ? (
        <label>
          Recurrence Frequency
          <select {...register('recurrenceFrequency')}>
            <option value="">Select frequency</option>
            <option value="MINUTE">MINUTE</option>
            <option value="HOURLY">HOURLY</option>
            <option value="DAILY">DAILY</option>
            <option value="WEEKLY">WEEKLY</option>
            <option value="MONTHLY">MONTHLY</option>
          </select>
          {errors.recurrenceFrequency ? (
            <span className="field-error">{errors.recurrenceFrequency.message}</span>
          ) : null}
        </label>
      ) : null}

      <label>
        Scheduled At
        <input type="datetime-local" {...register('scheduledAt')} />
        {errors.scheduledAt ? <span className="field-error">{errors.scheduledAt.message}</span> : null}
      </label>

      <label>
        Max Attempts
        <input
          type="number"
          min={1}
          max={10}
          {...register('maxAttempts', {
            valueAsNumber: true,
          })}
        />
      </label>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating...' : 'Create Job'}
      </button>
    </form>
  );
};
