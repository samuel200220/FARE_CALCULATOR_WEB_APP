'use client';

import React, { useEffect } from 'react';
import { Box, Stack, Typography, TextField, Button, Link } from '@mui/material';
import { useForm } from "react-hook-form";
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface LoginData {
  mailUtilisateur: string;
  motDePasse: string;
}

const Page = () => {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (localStorage.getItem("user")) {
        router.push("/");
      }
    }
  }, []);

  const { handleSubmit, register, formState: { errors } } = useForm<LoginData>();

  const onSubmit = (data: LoginData) => {
    axios.get(`http://localhost:4000/user?mailUtilisateur=${data.mailUtilisateur}&motDePasse=${data.motDePasse}`)
      .then(res => {
        if (res.data.length > 0) {
          localStorage.setItem("utilisateur", JSON.stringify(res.data[0]));
          toast.success("Connexion réussie");
          localStorage.setItem("estConnecte", "true");
          localStorage.removeItem("compteurUtilisation");
          router.push("/");
        } else {
          toast.error("Les identifiants sont incorrects");
        }
      })
      .catch(() => {
        toast.error("Erreur lors de la connexion");
      });
  };

  return (
    <div className="bg-[url('/image_login.jpg')] bg-cover bg-center w-full h-screen flex justify-center items-center">
      <Box width={400} sx={{ backgroundColor: "#fff", padding: 3, borderRadius: 5 }}>
        <Typography variant='h5'>Connexion</Typography>

        <form onSubmit={handleSubmit(onSubmit)} style={{ marginTop: 16 }}>
          <Stack direction="column" gap={2}>
            <TextField
              label="Adresse mail"
              variant="filled"
              fullWidth
              size='small'
              type='email'
              error={!!errors.mailUtilisateur}
              helperText={errors.mailUtilisateur?.message}
              {...register("mailUtilisateur", { required: "Veuillez saisir votre adresse mail" })}
            />

            <TextField
              label="Mot de passe"
              variant="filled"
              fullWidth
              size='small'
              type='password'
              error={!!errors.motDePasse}
              helperText={errors.motDePasse?.message}
              {...register("motDePasse", {
                required: "Veuillez saisir un mot de passe",
                minLength: { value: 5, message: "Mot de passe trop court" }
              })}
            />
          </Stack>

          <Button variant="contained" sx={{ marginTop: 2 }} type='submit'>
            Connexion
          </Button>

          <Typography paddingTop={2}>
            Vous n'avez pas de compte ? <Link href="/inscription">Cliquez ici</Link>
          </Typography>
        </form>
      </Box>
    </div>
  );
};

export default Page;