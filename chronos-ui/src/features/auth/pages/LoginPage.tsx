import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginUser } from '../../../api/auth.api';
import { useAuthStore } from '../store/authStore';
import { toApiError } from '../../../api/client';
import { ErrorBanner } from '../../../components/common/ErrorBanner';

const schema = z.object({
  username: z.string().min(3, 'Username is required'),
  password: z.string().min(6, 'Password is required'),
});

type LoginFormData = z.infer<typeof schema>;

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const setSession = useAuthStore((state) => state.setSession);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: LoginFormData) => {
    try {
      setApiError(null);
      const response = await loginUser(values);
      setSession({
        token: response.accessToken,
        userId: response.userId,
        username: response.username,
      });

      const from = (location.state as { from?: string } | null)?.from ?? '/';
      navigate(from, { replace: true });
    } catch (error) {
      const parsed = toApiError(error);
      setApiError(parsed.message);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <h1>Welcome Back</h1>
        <p>Sign in to monitor jobs and executions.</p>

        {apiError ? <ErrorBanner title="Login failed" message={apiError} /> : null}

        <form onSubmit={handleSubmit(onSubmit)} className="form-grid">
          <label>
            Username
            <input type="text" {...register('username')} />
            {errors.username ? <span className="field-error">{errors.username.message}</span> : null}
          </label>

          <label>
            Password
            <input type="password" {...register('password')} />
            {errors.password ? <span className="field-error">{errors.password.message}</span> : null}
          </label>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Login'}
          </button>
        </form>

        <p className="auth-switch">
          No account yet? <Link to="/register">Create one</Link>
        </p>
      </div>
    </section>
  );
};
