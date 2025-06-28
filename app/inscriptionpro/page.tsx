'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import toast from 'react-hot-toast';
import Link from 'next/link';
import {
  Box,
  TextField,
  Button,
  Stack,
  Typography
} from '@mui/material';
import { Poppins } from 'next/font/google';
import { useTheme } from '@mui/material/styles';

const font = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
});

interface FormData {
  responsableEntreprise: string;
  nomUtilisateurPro: string;
  email: string;
  motDePasse: string;
  motDePasseConfirmation: string;
}

export default function Page() {
  const theme = useTheme();
  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    if (data.motDePasse !== data.motDePasseConfirmation) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    try {
      const res = await axios.get(
        `http://localhost:8080/api/entreprises/email/${data.email}`
      );

      if (res.data) {
        toast.error('Un compte existe déjà avec cette adresse email');
        return;
      }
    } catch (err: any) {
      if (err.response?.status !== 404) {
        toast.error("Erreur lors de la vérification de l'email");
        return;
      }
    }

    try {
      const response= await axios.post('http://localhost:8080/api/entreprises', {
        responsableEntreprise: data.responsableEntreprise,
        nomUtilisateurPro: data.nomUtilisateurPro,
        email: data.email,
        motDePasse: data.motDePasse,
      });

      toast.success('Inscription réussie');
      const idUtilisateur = response.data.id;
      localStorage.setItem("idUtilisateur", idUtilisateur);
      localStorage.removeItem('compteurUtilisation');
      router.push('/connexionpro');
    } catch (error) {
      console.error(error);
      toast.error("Une erreur est survenue lors de l'inscription");
    }
  };

  return (
    <div className="min-h-screen flex lg:p-20 p-4 rounded-3xl shadow-lg">
      {/* Left Section */}
      <div className="hidden lg:flex w-1/2 bg-blue-700 dark:bg-[#0D1B2A] rounded-l-3xl text-white p-16 flex-col justify-center">
        <h1 className="text-4xl font-bold mb-4">
          Fare Calculator Pro <br /> Votre Tarif à Portée De Main
        </h1>
        <p className="text-lg leading-relaxed">
          Plus besoin de stresser sur le coût du trajet, <br />
          Avec Fare Calculator, obtenez une estimation <br />
          rapide du coût de vos déplacements.
        </p>
      </div>

      {/* Right Section */}
      <div className="lg:w-1/2 w-full lg:p-16 p-0 bg-white dark:bg-gray-400 flex flex-col rounded-3xl lg:rounded-l-none lg:rounded-r-3xl justify-center">
        <div className="flex justify-center lg:justify-end mb-6 mt-2 lg:mt-0">
          <Link href="/inscription1">
            <button className="border border-blue-900 text-blue-900 px-4 py-1 dark:text-white rounded-full hover:bg-blue-900 dark:bg-[#0D1B2A] hover:text-white transition">
              Version Standard
            </button>
          </Link>
        </div>

        <h2 className="text-2xl text-center lg:text-start font-bold mb-6">Inscription</h2>
        <p className="mb-6 text-center text-gray-600">Créer votre compte pro gratuitement</p>

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
              label="Nom de l'entreprise"
              fullWidth
              {...register('nomUtilisateurPro', { required: 'Ce champ est requis' })}
              error={!!errors.nomUtilisateurPro}
              helperText={errors.nomUtilisateurPro?.message}
            />

            <TextField
              label="Responsable de l'entreprise"
              fullWidth
              {...register('responsableEntreprise', { required: 'Ce champ est requis' })}
              error={!!errors.responsableEntreprise}
              helperText={errors.responsableEntreprise?.message}
            />

            <TextField
              type="email"
              label="Adresse email"
              placeholder="you@example.com"
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

            <TextField
              type="password"
              label="Confirmer le mot de passe"
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
              S'inscrire
            </Button>

            <Typography variant="body2" align="center" sx={{ marginBottom: '5px' }}>
              Déjà inscrit à la version pro ?{' '}
              <Link href="/connexionpro" style={{ color: '#1e3a8a' }}>
                Cliquez-ici
              </Link>
            </Typography>
          </Stack>
        </Box>
      </div>
    </div>
  );
}
