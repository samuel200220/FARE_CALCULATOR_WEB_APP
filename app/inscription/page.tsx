"use client";

import React from 'react'
import { Box, Stack, Typography, TextField, Button } from '@mui/material';
import { useForm} from "react-hook-form";
import {toast} from 'react-hot-toast';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface FormData {
    nomUtilisateur: string;
    mailUtilisateur: string;
    motDePasse: string;
    motDePasseConfirmation: string;
  }
const Page = () => {
    const navigate=useRouter();
    const { handleSubmit, register, formState: { errors } } = useForm<FormData>();
    const onSubmit = (data: FormData) => {
        if (data.motDePasse !== data.motDePasseConfirmation) {
          toast.error("Les mots de passe ne correspondent pas");
        } else {
          axios.get(`http://localhost:4000/user?mailUtilisateur=${data.mailUtilisateur}`)
            .then((res) => {
              if (res.data.length > 0) {
                toast.error("Un compte existe déjà avec cette adresse mail");
              } else {
                axios.post("http://localhost:4000/user", data)
                  .then((res) => {
                    console.log(res);
                    toast.success("Inscription réussie");
                    localStorage.removeItem("compteurUtilisation");
                    navigate.push("/connexion");
                  })
                  .catch((err) => {
                    console.error(err);
                    toast.error("Une erreur est survenue");
                  });
              }
            });
        }
 };
    
  return (
    <div className="bg-[url('/image_login.jpg')] bg-cover bg-center w-full h-screen flex justify-center items-center">
    <Box 
      width={400} 
      sx={{
        backgroundColor:"#fff",
        padding:3,
        borderRadius:5,
    }}>
    <Typography variant='h5'>Inscription</Typography>
      <form 
        style={{
          marginTop:4,
        }}
        onSubmit={handleSubmit(onSubmit)}>
        <Stack direction={"column"}
        gap={2}>
          <TextField id="filled-basic" label="Veuillez saisir votre nom" variant="filled"
            fullWidth
            size='small'
            error={!!errors.nomUtilisateur}
            helperText={errors.nomUtilisateur?.message} 
            {...register("nomUtilisateur", {
                required: "Veuillez saisir un nom",
                minLength: { value: 5, message: "Nom trop court (min 5 caractères)" }
              })}
          />
          <TextField id="filled-basic" label="Veuillez saisir votre adresse mail" variant="filled"
            fullWidth
            size='small'
            type='email'
              error={!!errors.mailUtilisateur}
              helperText={errors.mailUtilisateur?.message}
              {...register("mailUtilisateur", {
                required: "Veuillez saisir votre adresse mail"
              })}
          />
          <TextField id="filled-basic" label="Veuillez saisir votre mot de passe" variant="filled"
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
          <TextField id="filled-basic" label="Veuillez confirmer votre mot de passe" variant="filled"
            fullWidth
            size='small'
            type='password'
              error={!!errors.motDePasseConfirmation}
              helperText={errors.motDePasseConfirmation?.message}
              {...register("motDePasseConfirmation", {
                required: "Veuillez confirmer le mot de passe",
                minLength: { value: 5, message: "Mot de passe trop court" }
              })}
          />
        </Stack>
        <Button variant="contained" sx={{
          marginTop:2,
        }}
        type='submit'>Inscription</Button>
        <Typography paddingTop={2}>Deja inscrit? <Link href={"/connexion"} className='text-blue-600'>Cliquez ici</Link></Typography>
      </form> 
    </Box>

    </div>
  )
}

export default Page