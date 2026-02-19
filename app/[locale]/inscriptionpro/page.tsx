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
import Header from '@/components/navbar/header';
import { motion } from 'framer-motion';

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
    if (data.motDePasse !== data.motDePasseConfirmation) {
      toast.error(t('errors.passwordMismatch'));
      return;
    }
    setIsSubmitting(true);
    try {
      const emailExists = await entrepriseService.checkEmailExists(data.email);
      if (emailExists) {
        toast.error(t('errors.emailExists'));
        setIsSubmitting(false);
        return;
      }
      const response = await entrepriseService.create({
        nom: data.nomUtilisateurPro,
        responsable: data.responsableEntreprise,
        email: data.email,
        motDePasse: data.motDePasse,
      });
      toast.success(t('success.signup'));
      if (response.id) {
        localStorage.setItem("idUtilisateur", response.id);
        localStorage.removeItem('compteurUtilisation');
      }
      router.push('/connexionpro');
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      const axiosError = error as AxiosError;
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
      } else {
        toast.error(a('errors.generic'));
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
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/10 dark:bg-blue-900/30 blur-[150px] rounded-full opacity-40"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-slate-200/50 dark:bg-slate-800/30 blur-[150px] rounded-full opacity-40"></div>
      </div>

      <div className="flex-grow flex items-center justify-center p-4 py-12 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-6xl grid lg:grid-cols-2 bg-card/80 dark:bg-slate-900/40 backdrop-blur-3xl rounded-[3.5rem] border border-border dark:border-white/5 shadow-2xl overflow-hidden"
        >
          {/* Left Visual Section */}
          <div className="hidden lg:flex flex-col justify-center p-20 bg-muted/30 dark:bg-slate-950/50 border-r border-border dark:border-white/5 relative">
            <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="relative z-10"
            >
              <h1 className="text-6xl font-black text-foreground leading-tight mb-8 tracking-tighter">
                {t('left.title')}
              </h1>
              <p className="text-xl leading-relaxed font-medium text-muted-foreground max-w-md">
                {t('left.subtitle')}
              </p>

              <div className="mt-20 space-y-8">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-[1.25rem] bg-primary/5 dark:bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-sm">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <div>
                      <h4 className="text-foreground font-bold text-lg">Scalable Infrastructure</h4>
                      <p className="text-muted-foreground text-sm">Grows with your business needs</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Form Section */}
          <div className="p-10 md:p-20 flex flex-col justify-center">
            <div className="flex justify-end mb-12">
              <Link href="/inscription1">
                <button className="text-[10px] font-black uppercase tracking-[0.4em] px-8 py-3 rounded-full bg-slate-950 text-white border border-slate-800 hover:bg-black transition-all duration-300 shadow-lg shadow-slate-900/40 hover:scale-105 active:scale-95">
                  {t('buttons.standardVersion')}
                </button>
              </Link>
            </div>

            <h2 className="text-4xl font-black text-foreground mb-4 tracking-tight">
              {t('title')}
            </h2>
            <p className="text-muted-foreground font-medium text-lg mb-12">
              {t('subtitle')}
            </p>

            <Box
              component="form"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              autoComplete="off"
            >
              <Stack spacing={4}>
                <div className="grid md:grid-cols-2 gap-4">
                  <TextField
                    label={t('form.companyName')}
                    fullWidth
                    {...register('nomUtilisateurPro', { required: t('errors.required') })}
                    error={!!errors.nomUtilisateurPro}
                    helperText={errors.nomUtilisateurPro?.message}
                    disabled={isSubmitting}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '1.25rem', color: 'hsl(var(--foreground))', bgcolor: 'hsl(var(--background))',
                        '& fieldset': { borderColor: 'hsl(var(--border))' },
                        '&:hover fieldset': { borderColor: 'hsl(var(--primary))' },
                      },
                      '& .MuiInputLabel-root': { color: 'hsl(var(--muted-foreground))', fontFamily: 'inherit' }
                    }}
                  />
                  <TextField
                    label={t('form.companyOwner')}
                    fullWidth
                    {...register('responsableEntreprise', { required: t('errors.required') })}
                    error={!!errors.responsableEntreprise}
                    helperText={errors.responsableEntreprise?.message}
                    disabled={isSubmitting}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '1.25rem', color: 'hsl(var(--foreground))', bgcolor: 'hsl(var(--background))',
                        '& fieldset': { borderColor: 'hsl(var(--border))' },
                        '&:hover fieldset': { borderColor: 'hsl(var(--primary))' },
                      },
                      '& .MuiInputLabel-root': { color: 'hsl(var(--muted-foreground))', fontFamily: 'inherit' }
                    }}
                  />
                </div>

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
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '1.25rem', color: 'hsl(var(--foreground))', bgcolor: 'hsl(var(--background))',
                      '& fieldset': { borderColor: 'hsl(var(--border))' },
                      '&:hover fieldset': { borderColor: 'hsl(var(--primary))' },
                    },
                    '& .MuiInputLabel-root': { color: 'hsl(var(--muted-foreground))', fontFamily: 'inherit' }
                  }}
                />

                <div className="grid md:grid-cols-2 gap-4">
                  <TextField
                    type="password"
                    label={t('form.password')}
                    fullWidth
                    {...register('motDePasse', {
                      required: t('errors.required'),
                      minLength: { value: 6, message: t('errors.passwordTooShort') }
                    })}
                    error={!!errors.motDePasse}
                    helperText={errors.motDePasse?.message}
                    disabled={isSubmitting}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '1.25rem', color: 'hsl(var(--foreground))', bgcolor: 'hsl(var(--background))',
                        '& fieldset': { borderColor: 'hsl(var(--border))' },
                        '&:hover fieldset': { borderColor: 'hsl(var(--primary))' },
                      },
                      '& .MuiInputLabel-root': { color: 'hsl(var(--muted-foreground))', fontFamily: 'inherit' }
                    }}
                  />
                  <TextField
                    type="password"
                    label={t('form.confirmPassword')}
                    fullWidth
                    {...register('motDePasseConfirmation', { required: t('errors.required') })}
                    error={!!errors.motDePasseConfirmation}
                    helperText={errors.motDePasseConfirmation?.message}
                    disabled={isSubmitting}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '1.25rem', color: 'hsl(var(--foreground))', bgcolor: 'hsl(var(--background))',
                        '& fieldset': { borderColor: 'hsl(var(--border))' },
                        '&:hover fieldset': { borderColor: 'hsl(var(--primary))' },
                      },
                      '& .MuiInputLabel-root': { color: 'hsl(var(--muted-foreground))', fontFamily: 'inherit' }
                    }}
                  />
                </div>

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
                    transition: 'all 0.4s ease',
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
                    t('buttons.signup')
                  )}
                </Button>

                <Typography variant="body2" align="center" className="text-muted-foreground font-medium">
                  {t('alreadyRegistered')}{' '}
                  <Link href="/connexionpro" className="text-primary font-black hover:underline underline-offset-4 decoration-2">
                    {t('buttons.loginPro')}
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