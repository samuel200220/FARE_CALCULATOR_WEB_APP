'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import Link from 'next/link';
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
import { useState } from 'react';
import { utilisateurService } from '@/app/services/api';
import { useAuth } from '@/context/AuthContext';
import Googleconnexion from '@/components/googleconnexion';

interface FormData {
  nom: string;
  email: string;
}

export default function Page() {
  const t = useTranslations('Inscription');
  const a = useTranslations('Verification');
  const theme = useTheme();
  const router = useRouter();
  const { setUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      // Appel de l'API pour l'inscription
      const response = await utilisateurService.register({
        nom: data.nom,
        email: data.email,
      });

      // Stocker le token
      localStorage.setItem('token', response.token);

      // Mettre l'utilisateur dans le contexte Auth
      setUser(response.user);

      // Stockage optionnel pour compatibilité
      localStorage.setItem('utilisateur', JSON.stringify(response.user));
      localStorage.setItem('idUtilisateur', response.user.id);

      toast.success(a('success.verification'));

      // Redirection vers l'accueil
      router.push('/accueil');
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      const axiosError = error as AxiosError;

      if (axiosError.response) {
        switch (axiosError.response.status) {
          case 409:
            toast.error(t('errors.emailExists'));
            break;
          case 500:
            toast.error(t('errors.serverError'));
            break;
          default:
            toast.error(t('errors.generic'));
        }
      } else {
        toast.error(t('errors.generic'));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex lg:p-20 p-4 rounded-3xl shadow-lg">
      {/* Left Section */}
      <div className="hidden lg:flex w-1/2 bg-blue-700 dark:bg-[#0D1B2A] rounded-l-3xl text-white p-16 flex-col justify-center">
        <h1 className="text-4xl font-bold mb-4">{t('left.title')}</h1>
        <p className="text-lg leading-relaxed">{t('left.subtitle')}</p>
      </div>

      {/* Right Section */}
      <div className="lg:w-1/2 w-full lg:p-16 p-0 bg-white dark:bg-gray-400 flex flex-col rounded-3xl lg:rounded-l-none lg:rounded-r-3xl justify-center">
        <div className="flex justify-center gap-3 lg:justify-end sm:justify-end md:justify-end lg:mb-6 sm:mb-6 md:mb-6 mb-2 mt-2 lg:mt-0 sm:mt-0 md:mt-0">
          <Link href="/inscriptionpro">
            <button className="border border-blue-900 text-blue-900 px-4 py-1 dark:text-white rounded-full hover:bg-blue-900 dark:bg-[#0D1B2A] hover:text-white transition">
              {t('buttons.proVersion')}
            </button>
          </Link>
        </div>

        <h2 className="text-2xl text-center lg:text-start font-bold mb-6">{t('title')}</h2>
        <p className="mb-6 text-center text-gray-600">{t('subtitle')}</p>

        <Box
          component="form"
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            fontFamily: 'Poppins, sans-serif',
            width: { lg: '100%' },
            ml: 0,
            maxWidth: { xs: 300, sm: 300, md: 400, lg: 400 },
            mx: { xs: 'auto', sm: 0 },
          }}
        >
          <Stack spacing={3} sx={{ fontFamily: 'Poppins, sans-serif' }}>
            {/* Nom */}
            <TextField
              label={t('form.username')}
              fullWidth
              {...register('nom', { required: t('errors.required') })}
              error={!!errors.nom}
              helperText={errors.nom?.message}
              disabled={isSubmitting}
            />

            {/* Email */}
            <TextField
              type="email"
              label={t('form.email')}
              placeholder="you@example.com"
              variant="outlined"
              fullWidth
              {...register('email', { 
                required: t('errors.required'),
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: t('errors.invalidEmail')
                }
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
              disabled={isSubmitting}
            />

            {/* Submit */}
            <Button
              variant="contained"
              fullWidth
              type="submit"
              disabled={isSubmitting}
              sx={{
                fontFamily: 'Poppins, sans-serif',
                bgcolor: theme.palette.mode === 'light' ? '#1D4ED8' : '#0D1B2A',
                color: '#FFFFFF',
                '&:hover': {
                  bgcolor: theme.palette.mode === 'light' ? '#1E40AF' : '#1B263B',
                },
                '&:disabled': {
                  bgcolor: theme.palette.mode === 'light' ? '#93C5FD' : '#415A77',
                },
              }}
            >
              {isSubmitting ? <CircularProgress size={24} sx={{ color: 'white' }} /> : t('buttons.signup')}
            </Button>

            {/* Lien vers connexion */}
            <Typography
              variant="body2"
              align="center"
              sx={{ fontFamily: 'Poppins, sans-serif', marginBottom: '5px' }}
            >
              {t('alreadyRegistered')}{' '}
              <Link href="/connexion1" style={{ color: '#1e3a8a' }}>
                {t('buttons.login')}
              </Link>
            </Typography>

            {/* Google connexion */}
            <Googleconnexion />
          </Stack>
        </Box>
      </div>
    </div>
  );
}
