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
import { useAuth } from '@/context/AuthContext';
import Googleconnexion from '@/components/googleconnexion';
import Header from '@/components/navbar/header';
import { motion } from 'framer-motion';

interface ConnexionProFormData {
  email: string;
  motDePasse: string;
}

export default function Page() {
  const t = useTranslations('ConnexionPro');
  const a = useTranslations('Connexion');
  const theme = useTheme();
  const router = useRouter();
  const { setEntreprise } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ConnexionProFormData>();

  const onSubmit = async (data: ConnexionProFormData) => {
    setIsSubmitting(true);
    try {
      const response = await entrepriseService.login(data.email, data.motDePasse);
      const entrepriseData = response.user;
      if (!entrepriseData) {
        throw new Error('Login failed: entreprise non trouvée');
      }
      localStorage.setItem('token', response.token);
      localStorage.setItem('entreprise', JSON.stringify(entrepriseData));
      localStorage.setItem('entrepriseId', entrepriseData.id);
      setEntreprise(entrepriseData);
      toast.success(t('messages.loginSuccess'));
      router.push('/versionpro');
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      if (error instanceof Error && error.message === 'Invalid credentials') {
        toast.error(t('messages.loginFailed'));
        setIsSubmitting(false);
        return;
      }
      const axiosError = error as AxiosError;
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
      } else {
        toast.error(a('messages.genericError'));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen relative overflow-hidden bg-background flex flex-col transition-colors duration-500">
      <Header />

      {/* Background Decorative Elements - Pro Style */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/10 dark:bg-blue-900/40 blur-[150px] rounded-full opacity-50"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-slate-200/50 dark:bg-slate-800/40 blur-[150px] rounded-full opacity-50"></div>
        <div className="absolute top-1/4 left-1/4 w-full h-full bg-[url('/grid.svg')] opacity-[0.03] dark:opacity-5"></div>
      </div>

      <div className="flex-grow flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[1000px] grid lg:grid-cols-2 bg-card/80 dark:bg-slate-900/40 backdrop-blur-3xl rounded-[3rem] border border-border dark:border-white/5 shadow-2xl overflow-hidden"
        >
          {/* Left Visual Section */}
          <div className="hidden lg:flex flex-col justify-between p-16 bg-muted/30 dark:bg-slate-950/50 border-r border-border dark:border-white/5 relative">
            <div className="relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <span className="text-primary font-black uppercase tracking-[0.4em] text-[10px] mb-6 block border border-primary/20 w-fit px-4 py-1.5 rounded-full bg-primary/5">
                  Pro Dashboard
                </span>
                <h1 className="text-5xl font-black text-foreground leading-tight mb-8">
                  {t('left.title')}
                </h1>
              </motion.div>

              <p className="text-muted-foreground text-lg leading-relaxed font-medium">
                {t('left.subtitle')}
              </p>
            </div>

            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-card border border-border dark:bg-white/5 dark:border-white/5 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m12 14 4-4-4-4"></path><path d="M3 3h18c1 0 2 1 2 2v14c0 1-1 2-2 2H3c-1 0-2-1-2-2V5c0-1 1-2 2-2z"></path></svg>
                </div>
                <div>
                  <p className="text-foreground font-bold text-sm">Advanced Analytics</p>
                  <p className="text-muted-foreground text-xs text-balance">Real-time data at your fingertips</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form Section */}
          <div className="p-8 md:p-16 flex flex-col justify-center">
            <div className="flex justify-end mb-12">
              <Link href="/connexion1">
                <button className="text-[10px] font-black uppercase tracking-[0.4em] px-6 py-2.5 rounded-full bg-slate-950 text-white border border-slate-800 hover:bg-black transition-all duration-300 shadow-lg shadow-slate-900/40 hover:scale-105 active:scale-95">
                  {t('buttons.standardVersion')}
                </button>
              </Link>
            </div>

            <h2 className="text-3xl font-black text-foreground mb-3 tracking-tight">
              {t('title')}
            </h2>
            <p className="text-muted-foreground font-medium mb-10">
              {t('subtitle')}
            </p>

            <Box
              component="form"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              autoComplete="off"
            >
              <Stack spacing={4}>
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
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '1.25rem',
                      color: 'hsl(var(--foreground))',
                      bgcolor: 'hsl(var(--background))',
                      '& fieldset': { borderColor: 'hsl(var(--border))' },
                      '&:hover fieldset': { borderColor: 'hsl(var(--primary))' },
                    },
                    '& .MuiInputLabel-root': { color: 'hsl(var(--muted-foreground))', fontFamily: 'inherit' }
                  }}
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
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '1.25rem',
                      color: 'hsl(var(--foreground))',
                      bgcolor: 'hsl(var(--background))',
                      '& fieldset': { borderColor: 'hsl(var(--border))' },
                      '&:hover fieldset': { borderColor: 'hsl(var(--primary))' },
                    },
                    '& .MuiInputLabel-root': { color: 'hsl(var(--muted-foreground))', fontFamily: 'inherit' }
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
                    bgcolor: 'primary.main',
                    boxShadow: '0 10px 20px -5px rgba(29, 78, 216, 0.4)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 15px 30px -5px rgba(29, 78, 216, 0.5)',
                    }
                  }}
                >
                  {isSubmitting ? (
                    <CircularProgress size={24} sx={{ color: 'white' }} />
                  ) : (
                    t('buttons.login')
                  )}
                </Button>

                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border"></div>
                  </div>
                </div>

                <Typography variant="body2" align="center" className="text-muted-foreground font-medium">
                  {t('noAccount')}{' '}
                  <Link href="/inscriptionpro" className="text-primary font-black hover:underline underline-offset-4 decoration-2">
                    {t('buttons.signupPro')}
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