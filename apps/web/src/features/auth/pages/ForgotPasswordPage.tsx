// =====================================================
// MatFlow - Forgot Password Page
// =====================================================

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema, type ForgotPasswordInput } from '@matflow/validators';
import { apiPost } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    try {
      setError(null);
      await apiPost('/auth/forgot-password', data);
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  };

  if (submitted) {
    return (
      <div className="space-y-6 text-center">
        <h2 className="text-2xl font-bold">Email envoyé</h2>
        <p className="text-muted-foreground">
          Si un compte existe avec cette adresse email, vous recevrez un lien
          pour réinitialiser votre mot de passe.
        </p>
        <Link to="/login">
          <Button variant="outline" className="w-full">
            Retour à la connexion
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold">Mot de passe oublié</h2>
        <p className="text-sm text-muted-foreground">
          Entrez votre adresse email pour recevoir un lien de réinitialisation
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="nom@entreprise.ch"
            error={Boolean(errors.email)}
            {...register('email')}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full" loading={isSubmitting}>
          Envoyer le lien
        </Button>
      </form>

      <div className="text-center">
        <Link to="/login" className="text-sm text-primary hover:underline">
          Retour à la connexion
        </Link>
      </div>
    </div>
  );
}
