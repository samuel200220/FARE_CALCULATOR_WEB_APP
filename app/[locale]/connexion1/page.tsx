'use client';

<<<<<<< HEAD
//import { useState } from 'react';
=======
import { useState } from 'react';
>>>>>>> internationalisation
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { Box, TextField, Button, Stack, Typography } from '@mui/material';
<<<<<<< HEAD
//import { Poppins } from 'next/font/google';
=======
import { Poppins } from 'next/font/google';
>>>>>>> internationalisation
import { useTheme } from '@mui/material/styles';
import axios from 'axios';
import { useTranslations } from 'next-intl';

// const font = Poppins({
//   subsets: ['latin'],
//   weight: ['400', '500', '600', '700'],
//   variable: '--font-poppins',
// });

interface ConnexionFormData {
  email: string;
}

export default function Page() {
  const t = useTranslations('Connexion'); // ⚡ clé de traduction
  const a = useTranslations('ConnexionPro');
  const theme = useTheme();
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<ConnexionFormData>();

  const onSubmit = async (data: ConnexionFormData) => {
    try {
      const res = await axios.get(`http://localhost:8080/api/utilisateurs/email/${data.email}`);
      if (res.data) {
        toast.success(t('errors.success'));
        localStorage.setItem('utilisateur', JSON.stringify(res.data));
        localStorage.setItem('idUtilisateur', res.data.id);
        router.push('/accueil');
      } else {
        toast.error(t('errors.notFound'));
      }
<<<<<<< HEAD
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
=======
    } catch (error: any) {
      if (error.response?.status === 404) {
>>>>>>> internationalisation
        toast.error(t('errors.notFound'));
      } else {
        console.error(error);
        toast.error(t('errors.generic'));
      }
    }
  };

  return (
    <div className="min-h-screen flex lg:p-20 p-4 rounded-2xl shadow-lg font-[Poppins]">
      {/* Left Section */}
      <div className="hidden lg:flex w-1/2 bg-blue-700 dark:bg-[#0D1B2A] rounded-l-3xl text-white p-16 flex-col justify-center">
        <h1 className="text-4xl font-bold mb-4">
          Fare Calculator <br /> {t('title')}
        </h1>
        <p className="text-lg leading-relaxed">
          {a('left.subtitle')}
        </p>
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
            <TextField
              type="email"
              label={t('emailLabel')}
              placeholder={t('emailPlaceholder')}
              variant="outlined"
              fullWidth
              {...register('email', { required: t('errors.requiredEmail') })}
              error={!!errors.email}
              helperText={errors.email?.message}
              sx={{ fontFamily: 'Poppins, sans-serif' }}
            />

            <Button
              variant="contained"
              fullWidth
              type="submit"
              sx={{
                fontFamily: 'Poppins, sans-serif',
                bgcolor: theme.palette.mode === 'light' ? '#1D4ED8' : '#0D1B2A',
                color: '#FFFFFF',
                '&:hover': {
                  bgcolor: theme.palette.mode === 'light' ? '#1E40AF' : '#1B263B',
                },
              }}
            >
              {t('loginButton')}
            </Button>

            <Typography variant="body2" align="center">
              {t('noAccount')}{' '}
              <Link href="/inscription1" className="text-blue-900 ml-1">
                {t('clickHere')}
              </Link>
            </Typography>
          </Stack>
        </Box>
      </div>
    </div>
  );
}