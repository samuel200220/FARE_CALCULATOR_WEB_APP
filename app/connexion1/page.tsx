'use client';

import Link from 'next/link';
import { Box, TextField, Button, Stack, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Poppins } from 'next/font/google';
import { useTheme } from '@mui/material/styles';



interface ConnexionFormData {
  motDePasse: string;
  motDePasseConfirmation: string;
}

export default function Page() {
  const theme = useTheme();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ConnexionFormData>();

  const onSubmit = (data: ConnexionFormData) => {
    if (data.motDePasse !== data.motDePasseConfirmation) {
      toast.error('Les mots de passe ne correspondent pas');
    } else {
      // Ici vous pouvez ajouter la logique de connexion (vérification d'email, etc.)
      toast.success('Connexion réussie');
      router.push('/'); // rediriger vers une autre page
    }
  };

  return (
    <div className="min-h-screen flex p-20 rounded-2xl shadow-lg font-[Poppins]">
      {/* Left Section */}
      <div className="w-1/2 bg-blue-700 dark:bg-[#0D1B2A] rounded-l-3xl text-white p-16 flex flex-col justify-center">
        <h1 className="text-4xl font-bold mb-4">
          Fare Calculator <br /> Votre Tarif à Portée De Main
        </h1>
        <p className="text-lg leading-relaxed">
          Plus besoin de stresser sur le coût du trajet, <br />
          Avec Fare Calculator, obtenez une estimation <br />
          rapide du coût de vos déplacements.
        </p>
      </div>

      {/* Right Section */}
      <div className="w-1/2 p-16 bg-white dark:bg-gray-400 flex flex-col rounded-r-3xl justify-center">
        <h2 className="text-2xl font-bold mb-6">Connexion</h2>

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          autoComplete="off"
          sx={{ fontFamily: 'Poppins, sans-serif', maxWidth: 400 }}
        >
          <Stack spacing={3}>
            <TextField
              type="password"
              label="Votre mot de passe"
              variant="outlined"
              fullWidth
              {...register('motDePasse', { required: 'Mot de passe requis' })}
              error={!!errors.motDePasse}
              helperText={errors.motDePasse?.message}
            />

            <TextField
              type="password"
              label="Confirmer le mot de passe"
              variant="outlined"
              fullWidth
              {...register('motDePasseConfirmation', {
                required: 'Confirmation requise',
              })}
              error={!!errors.motDePasseConfirmation}
              helperText={errors.motDePasseConfirmation?.message}
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
                Se connecter
            </Button>
            <Typography variant="body2" align="center">
              Pas de compte ?{' '}
              <Link href="/inscription1" className="text-blue-900 ml-1">
                Cliquez ici
              </Link>
            </Typography>
          </Stack>
        </Box>
      </div>
    </div>
  );
}
