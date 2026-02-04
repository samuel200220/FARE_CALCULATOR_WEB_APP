'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { Box, TextField, Button, Stack, Typography, CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { AxiosError } from 'axios';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { utilisateurService } from '@/app/services/api';
import { useAuth } from '@/context/AuthContext';
import Googleconnexion from '@/components/googleconnexion';

interface ConnexionFormData {
  email: string;
}

export default function Page() {
  const t = useTranslations('Connexion');
  const a = useTranslations('ConnexionPro');
  const theme = useTheme();
  const router = useRouter();
  const { setUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ConnexionFormData>();

  const onSubmit = async (data: ConnexionFormData) => {
    setIsSubmitting(true);
    try {
      // Appel du endpoint login
      const response = await utilisateurService.login(data.email);

      // Stockage du token
      localStorage.setItem('token', response.token);

      // Mettre l'utilisateur dans le contexte
      setUser(response.user);

      // Stockage optionnel de l'utilisateur et ID pour compatibilité
      localStorage.setItem('utilisateur', JSON.stringify(response.user));
      localStorage.setItem('idUtilisateur', response.user.id);

      toast.success(t('errors.success'));

      // Redirection vers l'accueil
      router.push('/accueil');
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      const axiosError = error as AxiosError;

      if (axiosError.response) {
        switch (axiosError.response.status) {
          case 401:
            toast.error(t('errors.notFound'));
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
    <div className="min-h-screen flex lg:p-20 p-4 rounded-2xl shadow-lg font-[Poppins]">
      {/* Left Section */}
      <div className="hidden lg:flex w-1/2 bg-blue-700 dark:bg-[#0D1B2A] rounded-l-3xl text-white p-16 flex-col justify-center">
        <h1 className="text-4xl font-bold mb-4">
          Fare Calculator <br /> {t('title')}
        </h1>
        <p className="text-lg leading-relaxed">{a('left.subtitle')}</p>
      </div>

      {/* Right Section */}
      <div className="lg:w-1/2 w-full lg:p-16 p-0 bg-white dark:bg-gray-400 flex flex-col rounded-3xl lg:rounded-l-none lg:rounded-r-3xl justify-center">
        <div className="flex justify-center gap-3 lg:justify-end sm:justify-end md:justify-end lg:mb-6 sm:mb-6 md:mb-6 mb-2 mt-2 lg:mt-0 sm:mt-0 md:mt-0">
          <Link href="/inscriptionpro">
            <button className="border border-blue-900 text-blue-900 px-4 py-1 dark:text-white rounded-full hover:bg-blue-900 dark:bg-[#0D1B2A] hover:text-white transition">
              {t('proVersion')}
            </button>
          </Link>
        </div>

        <h2 className="text-2xl text-center lg:text-start font-bold mb-6">{t('title')}</h2>

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          autoComplete="off"
          sx={{
            fontFamily: 'Poppins, sans-serif',
            maxWidth: { xs: 300, sm: 300, md: 400, lg: 400 },
            mx: { xs: 'auto', sm: 0 },
          }}
        >
          <Stack spacing={3}>
            {/* Email */}
            <TextField
              type="email"
              label={t('emailLabel')}
              placeholder={t('emailPlaceholder')}
              variant="outlined"
              fullWidth
              {...register('email', {
                required: t('errors.requiredEmail'),
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: t('errors.invalidEmail')
                }
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
              disabled={isSubmitting}
              sx={{ fontFamily: 'Poppins, sans-serif' }}
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
              {isSubmitting ? <CircularProgress size={24} sx={{ color: 'white' }} /> : t('loginButton')}
            </Button>

            {/* Footer */}
            <Typography variant="body2" align="center">
              {t('noAccount')}{' '}
              <Link href="/inscription1" className="text-blue-900 ml-1">
                {t('clickHere')}
              </Link>
            </Typography>

            {/* Google Login */}
            <Googleconnexion />
          </Stack>
        </Box>
      </div>
    </div>
  );
}
