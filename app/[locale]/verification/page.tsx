'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  Box,
  TextField,
  Button,
  Stack,
  Typography,
  CircularProgress
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslations } from 'next-intl';

interface FormData {
  code: string;
}

export default function VerificationPage() {
  const t = useTranslations('Verification');
  const a = useTranslations('Inscription');
  const theme = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [userEmail, setUserEmail] = useState('');

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>();

  useEffect(() => {
    // Récupérer l'email depuis les paramètres d'URL ou localStorage
    const email = searchParams.get('email') || localStorage.getItem('userEmailForVerification');
    if (email) {
      setUserEmail(email);
    } else {
      toast.error('Email non trouvé');
      router.push('/inscription1');
    }
  }, [searchParams, router]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail,
          code: data.code
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(t('success.verification'));
        localStorage.removeItem('userEmailForVerification');
        
        // Sauvegarder les infos utilisateur
        if (result.user) {
          localStorage.setItem("idUtilisateur", result.user.id);
          localStorage.setItem("userNom", result.user.nom);
          localStorage.setItem("userEmail", result.user.email);
        }
        
        router.push('/connexion1');
      } else {
        toast.error(result.message || t('errors.verificationFailed'));
      }
    } catch (error) {
      console.error('Erreur lors de la vérification:', error);
      toast.error(a('errors.generic'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    if (countdown > 0) return;

    setIsResending(true);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/send-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(t('success.codeResent'));
        setCountdown(60); // 60 secondes avant de pouvoir renvoyer
      } else {
        toast.error(result.message || t('errors.resendFailed'));
      }
    } catch (error) {
      console.error('Erreur lors du renvoi du code:', error);
      toast.error(a('errors.generic'));
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        <Box
          component="form"
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            fontFamily: 'Poppins, sans-serif',
          }}
        >
          <Stack spacing={4}>
            <Typography variant="h4" align="center" fontWeight="bold">
              {t('title')}
            </Typography>
            
            <Typography variant="body1" align="center" color="text.secondary">
              {t('subtitle', { email: userEmail })}
            </Typography>

            <TextField
              label={t('form.code')}
              fullWidth
              {...register('code', { 
                required: a('errors.required'),
                pattern: {
                  value: /^[0-9]{6}$/,
                  message: t('errors.invalidCode')
                }
              })}
              error={!!errors.code}
              helperText={errors.code?.message}
              disabled={isSubmitting}
              placeholder="123456"
              inputProps={{ maxLength: 6 }}
            />

            <Button
              variant="contained"
              fullWidth
              type="submit"
              disabled={isSubmitting}
              size="large"
              sx={{
                fontFamily: 'Poppins, sans-serif',
                bgcolor: theme.palette.mode === 'light' ? '#1D4ED8' : '#0D1B2A',
                color: '#FFFFFF',
                '&:hover': {
                  bgcolor: theme.palette.mode === 'light' ? '#1E40AF' : '#1B263B',
                },
                py: 1.5
              }}
            >
              {isSubmitting ? (
                <CircularProgress size={24} sx={{ color: 'white' }} />
              ) : (
                t('buttons.verify')
              )}
            </Button>

            <Button
              variant="outlined"
              fullWidth
              onClick={handleResendCode}
              disabled={isResending || countdown > 0}
              sx={{
                fontFamily: 'Poppins, sans-serif',
              }}
            >
              {isResending ? (
                <CircularProgress size={24} />
              ) : countdown > 0 ? (
                t('buttons.resendCountdown', { seconds: countdown })
              ) : (
                t('buttons.resendCode')
              )}
            </Button>
          </Stack>
        </Box>
      </div>
    </div>
  );
}