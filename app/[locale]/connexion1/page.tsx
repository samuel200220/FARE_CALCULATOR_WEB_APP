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
import Header from '@/components/navbar/header';
import { motion } from 'framer-motion';

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
      const response = await utilisateurService.login(data.email);
      localStorage.setItem('token', response.token);
      setUser(response.user);
      localStorage.setItem('utilisateur', JSON.stringify(response.user));
      localStorage.setItem('idUtilisateur', response.user.id);
      toast.success(t('errors.success'));
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
    <main className="min-h-screen relative overflow-hidden bg-slate-50 dark:bg-slate-950 flex flex-col">
      <Header />

      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-400/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="flex-grow flex items-center justify-center p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-5xl grid lg:grid-cols-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-[2.5rem] border border-white/20 shadow-2xl overflow-hidden"
        >
          {/* Left Visual Section */}
          <div className="hidden lg:flex flex-col justify-center p-16 bg-gradient-to-br from-primary to-blue-700 text-white relative h-full">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_2px_2px,white_1px,transparent_0)] bg-[size:32px_32px]"></div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <h1 className="text-5xl font-black mb-6 leading-tight">
                Fare Calculator <br />
                <span className="text-white/80">{t('title')}</span>
              </h1>
              <p className="text-xl leading-relaxed font-medium opacity-90 max-w-md italic">
                "{a('left.subtitle')}"
              </p>
            </motion.div>

            <div className="mt-12 flex gap-4 overflow-hidden">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-white animate-pulse"></div>
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-sm font-bold">Trusted by Thousands</p>
                <p className="text-xs opacity-60">Join the movement today</p>
              </div>
            </div>
          </div>

          {/* Right Form Section */}
          <div className="p-8 md:p-16 flex flex-col justify-center relative">
            <div className="flex justify-end mb-8">
              <Link href="/inscriptionpro">
                <button className="text-xs font-black uppercase tracking-wider px-6 py-2.5 rounded-full bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 text-slate-900 border border-amber-500/20 hover:from-amber-500 hover:to-amber-700 transition-all duration-300 shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95">
                  {t('proVersion')}
                </button>
              </Link>
            </div>

            <div className="mb-10">
              <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
                {t('title')}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium">
                Enter your details to access your account
              </p>
            </div>

            <Box
              component="form"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              autoComplete="off"
            >
              <Stack spacing={4}>
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
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '1rem',
                      '& fieldset': { borderColor: 'rgba(var(--primary), 0.2)' },
                      '&:hover fieldset': { borderColor: 'var(--primary)' },
                    },
                    '& .MuiInputLabel-root': { fontFamily: 'inherit' }
                  }}
                />

                <Button
                  variant="contained"
                  fullWidth
                  type="submit"
                  disabled={isSubmitting}
                  sx={{
                    py: 2,
                    borderRadius: '1rem',
                    fontFamily: 'inherit',
                    fontWeight: 900,
                    textTransform: 'none',
                    fontSize: '1.1rem',
                    boxShadow: '0 10px 20px -5px rgba(29, 78, 216, 0.3)',
                    bgcolor: 'primary.main',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                      boxShadow: '0 15px 25px -5px rgba(29, 78, 216, 0.4)',
                    }
                  }}
                >
                  {isSubmitting ? <CircularProgress size={24} sx={{ color: 'white' }} /> : t('loginButton')}
                </Button>

                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
                  </div>
                  <div className="relative flex justify-center text-sm uppercase">
                    <span className="bg-transparent px-2 text-slate-500 font-bold tracking-widest text-[10px]">Or continue with</span>
                  </div>
                </div>

                <Googleconnexion />

                <Typography variant="body2" align="center" className="text-slate-500 font-medium">
                  {t('noAccount')}{' '}
                  <Link href="/inscription1" className="text-primary font-black hover:underline underline-offset-4 decoration-2">
                    {t('clickHere')}
                  </Link>
                </Typography>
              </Stack>
            </Box>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
