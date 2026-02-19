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
import Header from '@/components/navbar/header';
import { motion } from 'framer-motion';

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
      const response = await utilisateurService.register({
        nom: data.nom,
        email: data.email,
      });
      localStorage.setItem('token', response.token);
      setUser(response.user);
      localStorage.setItem('utilisateur', JSON.stringify(response.user));
      localStorage.setItem('idUtilisateur', response.user.id);
      toast.success(a('success.verification'));
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
    <main className="min-h-screen relative overflow-hidden bg-slate-50 dark:bg-slate-950 flex flex-col">
      <Header />

      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-5%] right-[-5%] w-[45%] h-[45%] bg-primary/10 blur-[130px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="flex-grow flex items-center justify-center p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="w-full max-w-6xl grid lg:grid-cols-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-[3rem] border border-white/20 shadow-2xl overflow-hidden"
        >
          {/* Left Visual Section */}
          <div className="hidden lg:flex flex-col justify-center p-20 bg-gradient-to-br from-blue-600 to-indigo-800 text-white relative">
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_2px_2px,white_1px,transparent_0)] bg-[size:24px_24px]"></div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <h1 className="text-5xl font-black mb-8 leading-[1.15]">
                {t('left.title')}
              </h1>
              <p className="text-xl leading-relaxed font-medium opacity-90 max-w-md">
                {t('left.subtitle')}
              </p>

              <div className="mt-16 grid grid-cols-2 gap-6">
                <div className="p-6 rounded-3xl bg-white/10 backdrop-blur-md border border-white/10">
                  <p className="text-3xl font-black mb-1">10k+</p>
                  <p className="text-sm opacity-60">Active Users</p>
                </div>
                <div className="p-6 rounded-3xl bg-white/10 backdrop-blur-md border border-white/10">
                  <p className="text-3xl font-black mb-1">99%</p>
                  <p className="text-sm opacity-60">Accuracy</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Form Section */}
          <div className="p-10 md:p-20 flex flex-col justify-center relative">
            <div className="flex justify-end mb-10">
              <Link href="/inscriptionpro">
                <button className="text-[10px] font-black uppercase tracking-[0.2em] px-8 py-3 rounded-full bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 text-slate-900 border border-amber-500/20 hover:from-amber-500 hover:to-amber-700 transition-all duration-500 hover:scale-105 active:scale-95 shadow-lg shadow-amber-500/20">
                  {t('buttons.proVersion')}
                </button>
              </Link>
            </div>

            <div className="mb-12">
              <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-3 tracking-tighter">
                {t('title')}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">
                {t('subtitle')}
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
                  label={t('form.username')}
                  fullWidth
                  {...register('nom', { required: t('errors.required') })}
                  error={!!errors.nom}
                  helperText={errors.nom?.message}
                  disabled={isSubmitting}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '1.25rem',
                      '& fieldset': { borderColor: 'rgba(var(--primary), 0.1)' },
                      '&:hover fieldset': { borderColor: 'var(--primary)' },
                    }
                  }}
                />

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
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '1.25rem',
                      '& fieldset': { borderColor: 'rgba(var(--primary), 0.1)' },
                      '&:hover fieldset': { borderColor: 'var(--primary)' },
                    }
                  }}
                />

                <Button
                  variant="contained"
                  fullWidth
                  type="submit"
                  disabled={isSubmitting}
                  sx={{
                    py: 2.2,
                    borderRadius: '1.25rem',
                    fontFamily: 'inherit',
                    fontWeight: 900,
                    textTransform: 'none',
                    fontSize: '1.1rem',
                    boxShadow: '0 12px 24px -6px rgba(29, 78, 216, 0.4)',
                    bgcolor: 'primary.main',
                    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                      boxShadow: '0 18px 30px -6px rgba(29, 78, 216, 0.5)',
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  {isSubmitting ? <CircularProgress size={24} sx={{ color: 'white' }} /> : t('buttons.signup')}
                </Button>

                <div className="relative py-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t-2 border-slate-100 dark:border-slate-800"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-transparent px-4 text-slate-400 font-black uppercase tracking-[0.3em] text-[9px]">Social Join</span>
                  </div>
                </div>

                <Googleconnexion />

                <Typography variant="body2" align="center" className="text-slate-500 font-medium pt-4">
                  {t('alreadyRegistered')}{' '}
                  <Link href="/connexion1" className="text-primary font-black hover:underline underline-offset-4 decoration-2">
                    {t('buttons.login')}
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
