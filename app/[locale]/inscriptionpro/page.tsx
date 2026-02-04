'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { Box, TextField, Button, Stack, Typography, CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { entrepriseService } from '../../services/api';
import Googleconnexion from '@/components/googleconnexion';

interface FormData {
  responsableEntreprise: string;
  nomUtilisateurPro: string;
  email: string;
  motDePasse: string;
  motDePasseConfirmation: string;
}

export default function Page() {
  const t = useTranslations('InscriptionPro');
  const a = useTranslations('Connexion');
  const theme = useTheme();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { handleSubmit, register, formState: { errors } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    // Vérifier que les mots de passe correspondent
    if (data.motDePasse !== data.motDePasseConfirmation) {
      toast.error(t('errors.passwordMismatch'));
      return;
    }

    setIsSubmitting(true);

    try {
      // Vérifier si l'email existe déjà
      const emailExists = await entrepriseService.checkEmailExists(data.email);
      
      if (emailExists) {
        toast.error(t('errors.emailExists'));
        setIsSubmitting(false);
        return;
      }

      // Créer l'entreprise
      const response = await entrepriseService.create({
        nom: data.nomUtilisateurPro,
        responsable: data.responsableEntreprise,
        email: data.email,
        motDePasse: data.motDePasse,
      });

      toast.success(t('success.signup'));
      
      // Sauvegarder l'ID de l'entreprise
      if (response.id) {
        localStorage.setItem("idUtilisateur", response.id);
        localStorage.removeItem('compteurUtilisation');
      }
      
      router.push('/connexionpro');
      
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      
      const axiosError = error as AxiosError;
      
      // Gestion des erreurs spécifiques
      if (axiosError.response) {
        switch (axiosError.response.status) {
          case 400:
            toast.error(a('errors.invalidData'));
            break;
          case 409:
            toast.error(t('errors.emailExists'));
            break;
          case 500:
            toast.error(a('errors.serverError'));
            break;
          default:
            toast.error(a('errors.generic'));
        }
      } else if (axiosError.request) {
        toast.error(a('errors.networkError'));
      } else {
        toast.error(a('errors.generic'));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex lg:p-20 p-4 rounded-3xl shadow-lg">
      {/* Left Section */}
      <div className="hidden lg:flex w-1/2 bg-blue-700 dark:bg-[#0D1B2A] rounded-l-3xl text-white p-16 flex-col justify-center">
        <h1 className="text-4xl font-bold mb-4">
          {t('left.title')}
        </h1>
        <p className="text-lg leading-relaxed">{t('left.subtitle')}</p>
      </div>

      {/* Right Section */}
      <div className="lg:w-1/2 w-full lg:p-16 p-0 bg-white dark:bg-gray-400 flex flex-col rounded-3xl lg:rounded-l-none lg:rounded-r-3xl justify-center">
        <div className="flex justify-center lg:justify-end mb-6 mt-2 lg:mt-0">
          <Link href="/inscription1">
            <button className="border border-blue-900 text-blue-900 px-4 py-1 dark:text-white rounded-full hover:bg-blue-900 dark:bg-[#0D1B2A] hover:text-white transition">
              {t('buttons.standardVersion')}
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
            width: '100%',
            maxWidth: { xs: 300, sm: 300, md: 400, lg: 400 },
            mx: { xs: 'auto', sm: 0 },
          }}
        >
          <Stack spacing={3}>
            <TextField
              label={t('form.companyName')}
              fullWidth
              {...register('nomUtilisateurPro', { required: t('errors.required') })}
              error={!!errors.nomUtilisateurPro}
              helperText={errors.nomUtilisateurPro?.message}
              disabled={isSubmitting}
            />

            <TextField
              label={t('form.companyOwner')}
              fullWidth
              {...register('responsableEntreprise', { required: t('errors.required') })}
              error={!!errors.responsableEntreprise}
              helperText={errors.responsableEntreprise?.message}
              disabled={isSubmitting}
            />

            <TextField
              type="email"
              label={t('form.email')}
              placeholder="entreprise@example.com"
              fullWidth
              {...register('email', { 
                required: t('errors.required'),
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: a('errors.invalidEmail')
                }
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
              disabled={isSubmitting}
            />

            <TextField
              type="password"
              label={t('form.password')}
              fullWidth
              {...register('motDePasse', { 
                required: t('errors.required'),
                minLength: {
                  value: 6,
                  message: t('errors.passwordTooShort')
                }
              })}
              error={!!errors.motDePasse}
              helperText={errors.motDePasse?.message}
              disabled={isSubmitting}
            />

            <TextField
              type="password"
              label={t('form.confirmPassword')}
              fullWidth
              {...register('motDePasseConfirmation', { required: t('errors.required') })}
              error={!!errors.motDePasseConfirmation}
              helperText={errors.motDePasseConfirmation?.message}
              disabled={isSubmitting}
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
                t('buttons.signup')
              )}
            </Button>

            <Typography variant="body2" align="center" sx={{ marginBottom: '5px' }}>
              {t('alreadyRegistered')}{' '}
              <Link href="/connexionpro" style={{ color: '#1e3a8a' }}>
                {t('buttons.loginPro')}
              </Link>
            </Typography>
            {/* <Googleconnexion /> */}
          </Stack>
        </Box>
      </div>
    </div>
  );
}