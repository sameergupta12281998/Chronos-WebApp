import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerUser } from '../../../api/auth.api';
import { toApiError } from '../../../api/client';
import { ErrorBanner } from '../../../components/common/ErrorBanner';

const schema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Valid email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type RegisterFormData = z.infer<typeof schema>;

export const RegisterPage = () => {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState<{ message: string; details?: string[] } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: RegisterFormData) => {
    try {
      setApiError(null);
      await registerUser(values);
      navigate('/login');
    } catch (error) {
      const parsed = toApiError(error);
      setApiError({ message: parsed.message, details: parsed.details });
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <h1>Create Account</h1>
        <p>Register to start scheduling Chronos jobs.</p>

        {apiError ? (
          <ErrorBanner title="Registration failed" message={apiError.message} details={apiError.details} />
        ) : null}

        <form onSubmit={handleSubmit(onSubmit)} className="form-grid">
          <label>
            Username
            <input type="text" {...register('username')} />
            {errors.username ? <span className="field-error">{errors.username.message}</span> : null}
          </label>

          <label>
            Email
            <input type="email" {...register('email')} />
            {errors.email ? <span className="field-error">{errors.email.message}</span> : null}
          </label>

          <label>
            Password
            <input type="password" {...register('password')} />
            {errors.password ? <span className="field-error">{errors.password.message}</span> : null}
          </label>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </section>
  );
};
