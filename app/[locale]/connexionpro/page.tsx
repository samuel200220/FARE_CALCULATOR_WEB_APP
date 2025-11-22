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
import { entrepriseService } from '../../services/api';
import Googleconnexion from '@/components/googleconnexion';

interface ConnexionProFormData {
  email: string;
  motDePasse: string;
}

export default function Page() {
  const t = useTranslations('ConnexionPro');
  const a = useTranslations('Connexion');
  const theme = useTheme();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ConnexionProFormData>();

  const onSubmit = async (data: ConnexionProFormData) => {
    setIsSubmitting(true);
    
    try {
      // Tentative de connexion
      const entreprise = await entrepriseService.login(data.email, data.motDePasse);
      
      if (entreprise) {
        toast.success(t('messages.loginSuccess'));
        
        // Sauvegarder les informations de l'entreprise
        localStorage.setItem('entrepriseConnectee', JSON.stringify(entreprise));
        localStorage.setItem('idUtilisateur', entreprise.id);
        localStorage.setItem('userType', 'pro');
        
        // Redirection vers la version pro
        router.push('/versionpro');
      }
      
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      
      if (error instanceof Error && error.message === 'Invalid credentials') {
        toast.error(t('messages.loginFailed'));
        setIsSubmitting(false);
        return;
      }
      
      const axiosError = error as AxiosError;
      
      // Gestion des erreurs spécifiques
      if (axiosError.response) {
        switch (axiosError.response.status) {
          case 404:
            toast.error(a('messages.accountNotFound'));
            break;
          case 500:
            toast.error(a('messages.serverError'));
            break;
          default:
            toast.error(a('messages.genericError'));
        }
      } else if (axiosError.request) {
        toast.error(a('messages.networkError'));
      } else {
        toast.error(a('messages.genericError'));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex lg:p-20 p-4 rounded-2xl shadow-lg font-[Poppins]">
      {/* Left Section */}
      <div className="hidden lg:flex w-1/2 bg-blue-700 dark:bg-[#0D1B2A] rounded-l-3xl text-white p-16 flex-col justify-center">
        <h1 className="text-4xl font-bold mb-4">{t('left.title')}</h1>
        <p className="text-lg leading-relaxed">{t('left.subtitle')}</p>
      </div>

      {/* Right Section */}
      <div className="lg:w-1/2 w-full lg:p-16 p-0 bg-white dark:bg-gray-400 flex flex-col rounded-3xl lg:rounded-l-none lg:rounded-r-3xl justify-center">
        <div className="flex justify-center gap-3 lg:justify-end sm:justify-end md:justify-end lg:mb-6 sm:mb-6 md:mb-6 mb-2 mt-2 lg:mt-0 sm:mt-0 md:mt-0">
          <Link href="/connexion1">
            <button className="border border-blue-900 text-blue-900 px-4 py-1 dark:text-white rounded-full hover:bg-blue-900 dark:bg-[#0D1B2A] hover:text-white transition">
              {t('buttons.standardVersion')}
            </button>
          </Link>
        </div>

        <h2 className="text-2xl text-center lg:text-start font-bold mb-6">{t('title')}</h2>
        <p className="mb-6 text-center text-gray-600">{t('subtitle')}</p>

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
            <TextField
              label={t('form.email')}
              type="email"
              placeholder="entreprise@exemple.com"
              variant="outlined"
              fullWidth
              {...register('email', { 
                required: a('errors.requiredEmail'),
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: a('errors.invalidEmail')
                }
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
              disabled={isSubmitting}
              sx={{ fontFamily: 'Poppins, sans-serif' }}
            />

            <TextField
              label={t('form.password')}
              type="password"
              placeholder="••••••••"
              variant="outlined"
              fullWidth
              {...register('motDePasse', { required: t('errors.required') })}
              error={!!errors.motDePasse}
              helperText={errors.motDePasse?.message}
              disabled={isSubmitting}
              sx={{ fontFamily: 'Poppins, sans-serif' }}
            />

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
              {isSubmitting ? (
                <CircularProgress size={24} sx={{ color: 'white' }} />
              ) : (
                t('buttons.login')
              )}
            </Button>

            <Typography variant="body2" align="center">
              {t('noAccount')}{' '}
              <Link href="/inscriptionpro" className="text-blue-900 ml-1">
                {t('buttons.signupPro')}
              </Link>
            </Typography>
            {/* <Googleconnexion /> */}
          </Stack>
        </Box>
      </div>
    </div>
  );
}