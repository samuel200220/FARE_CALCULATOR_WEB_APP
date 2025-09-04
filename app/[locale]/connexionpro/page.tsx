'use client';

import Link from 'next/link';
import { Box, TextField, Button, Stack, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';

interface ConnexionFormData {
  email: string;
  motDePasse: string;
}

export default function Page() {
  const theme = useTheme();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ConnexionFormData>();

  const onSubmit = async (data: ConnexionFormData) => {
    try {
      const res = await axios.get(`http://localhost:8080/api/entreprises/email/${data.email}`);
      const entreprise = res.data;

      if (!entreprise || entreprise.motDePasse !== data.motDePasse) {
        toast.error('Email ou mot de passe incorrect');
        return;
      }

      // Enregistrer temporairement les infos en localStorage
      localStorage.setItem('entrepriseConnectee', JSON.stringify(entreprise));

      toast.success('Connexion réussie');
      router.push('/versionpro');
    } catch (error: any) {
      if (error.response?.status === 404) {
        toast.error("Aucun compte associé à cet email");
      } else {
        toast.error("Erreur lors de la connexion");
      }
    }
  };

  return (
    <div className="min-h-screen flex lg:p-20 p-4 rounded-2xl shadow-lg font-[Poppins]">
      {/* Left Section */}
      <div className="hidden lg:flex w-1/2 bg-blue-700 dark:bg-[#0D1B2A] rounded-l-3xl text-white p-16 flex-col justify-center">
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
      <div className="lg:w-1/2 w-full lg:p-16 p-0 bg-white dark:bg-gray-400 flex flex-col rounded-3xl lg:rounded-l-none lg:rounded-r-3xl justify-center">
        <h2 className="text-2xl text-center lg:text-start font-bold mb-6">Connexion</h2>

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
              label="Adresse email"
              type="email"
              fullWidth
              {...register('email', { required: 'Email requis' })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />

            <TextField
              type="password"
              label="Mot de passe"
              fullWidth
              {...register('motDePasse', { required: 'Mot de passe requis' })}
              error={!!errors.motDePasse}
              helperText={errors.motDePasse?.message}
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
              Pas de compte pro ?{' '}
              <Link href="/inscriptionpro" className="text-blue-900 ml-1">
                Cliquez-ici
              </Link>
            </Typography>
          </Stack>
        </Box>
      </div>
    </div>
  );
}
