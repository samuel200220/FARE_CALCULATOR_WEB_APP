'use client';

import { useState } from 'react';
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

const font = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
});

interface FormData {
  nomUtilisateur: string;
  mailUtilisateur: string;
  motDePasse: string;
  motDePasseConfirmation: string;
}

export default function Page() {
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
        `http://localhost:4000/user?mailUtilisateur=${data.mailUtilisateur}`
      );

      if (res.data.length > 0) {
        toast.error('Un compte existe déjà avec cette adresse mail');
        return;
      }

      await axios.post('http://localhost:4000/user', data);
      toast.success('Inscription réussie');
      localStorage.removeItem('compteurUtilisation');
      router.push('/connexion1');
    } catch (error) {
      console.error(error);
      toast.error('Une erreur est survenue');
    }
  };

  return (
    <div className="min-h-screen flex p-20 rounded-2xl shadow-lg">
      {/* Left Section */}
      <div className="w-1/2 bg-blue-700 text-white p-16 flex flex-col justify-center">
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
      <div className="w-1/2 p-16 bg-white flex flex-col justify-center">
        <div className="flex justify-end mb-6">
          <Link href="/">
            <button className="border border-blue-900 text-blue-900 px-4 py-1 rounded-full hover:bg-blue-900 hover:text-white transition">
              Commencez Gratuitement
            </button>
          </Link>
        </div>

        <h2 className="text-2xl font-bold mb-6">Inscription</h2>
        <p className="mb-6 text-gray-600">Créer votre compte gratuitement</p>

        <Box
          component="form"
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            fontFamily: 'Poppins, sans-serif',
            width: '100%',
            maxWidth: 400,
            mx: 'auto',
            ml:0,
          }}
        >
          <Stack spacing={3} sx={{fontFamily: 'Poppins, sans-serif'}}>
            {/* <TextField
              label="Nom d'utilisateur"
              fullWidth
              {...register('nomUtilisateur', { required: 'Ce champ est requis' })}
              error={!!errors.nomUtilisateur}
              helperText={errors.nomUtilisateur?.message}
            /> */}

            <TextField
              type="email"
              label="Adresse email"
              placeholder="you@example.com"
              variant="outlined"
              fullWidth
              {...register('mailUtilisateur', { required: 'Email requis' })}
              error={!!errors.mailUtilisateur}
              helperText={errors.mailUtilisateur?.message}
              sx={{fontFamily: 'Poppins, sans-serif'}}
            />

            <TextField
              type="password"
              label="Mot de passe"
              fullWidth
              {...register('motDePasse', { required: 'Mot de passe requis' })}
              error={!!errors.motDePasse}
              helperText={errors.motDePasse?.message}
              sx={{fontFamily: 'Poppins, sans-serif'}}
            />

            <TextField
              type="password"
              label="Confirmer le mot de passe"
              fullWidth
              {...register('motDePasseConfirmation', {
                required: 'Confirmation requise'
              })}
              error={!!errors.motDePasseConfirmation}
              helperText={errors.motDePasseConfirmation?.message}
              sx={{fontFamily: 'Poppins, sans-serif'}}
            />

            <Button
              variant="contained"
              color="primary"
              fullWidth
              type="submit" sx={{fontFamily: 'Poppins, sans-serif'}}
            >
              S'inscrire
            </Button>

            <Typography variant="body2" align="center" sx={{fontFamily: 'Poppins, sans-serif'}}>
              Déjà inscrit ?{' '}
              <Link href="/connexion1" style={{ fontFamily: 'Poppins, sans-serif',color: '#1e3a8a' }}>
                Cliquez-ici
              </Link>
            </Typography>
          </Stack>
        </Box>
      </div>
    </div>
  );
}
