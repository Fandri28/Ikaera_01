'use client'
import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Grid, Dialog, DialogContent, Avatar, Rating, TextField } from '@mui/material';
import Image from 'next/image';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import Skeleton from 'react-loading-skeleton'; // Import Skeleton
import 'react-loading-skeleton/dist/skeleton.css';


export interface Comment {
  idcomment: number;
  idproduit: number;
  iduser: number;
  commentaire: string;
  date: string;
  action: string;
}

export interface Etoile {
  id: number;
  idformation: number;
  rate: number;
  daterate: string;
  iduser: number;
}

export interface Formation {
  id: number;
  image: string;
  titre: string;
  description: string;
  lieu: string;
  frais: string;
}

export interface Utilisateur {
  id: number;
  nom: string;
  prenom: string;
  email: string;
}

const Accueil: React.FC = () => {
  const [formations, setFormations] = useState<Formation[]>([]);
  const [users, setUsers] = useState<Utilisateur[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [stars, setStars] = useState<Etoile[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>(''); // New state for search query
  const router1 = useRouter();
  const [loading, setLoading] = useState(true); // State to handle loading

  const urlapi = 'http://localhost:5000';

  useEffect(() => {
    // Fetch all data from APIs
    const fo = `${urlapi}/api/formations`;
    axios.get(fo)
      .then((res) => setFormations(res.data))
      .catch((err) => console.error('Error fetching formations:', err));

    axios.get(`${urlapi}/api/utilisateurs`)
      .then((res) => setUsers(res.data))
      .catch((err) => console.error('Error fetching users:', err));

    axios.get(`${urlapi}/api/comments`)
      .then((res) => setComments(res.data))
      .catch((err) => console.error('Error fetching comments:', err));

    axios.get(`${urlapi}/api/stars`)
      .then((res) => setStars(res.data))
      .catch((err) => console.error('Error fetching stars:', err));

    setLoading(false);
  }, []);

  const handleNavigationReset = (id: number) => {
    router1.push(`/services/inscription/${id}`);
  };

  const handleSelectProduct = (id: number) => {
    router1.push(`/services/details/${id}`);
  };

  // Filter formations based on title or location
  const filteredFormations = formations.filter((formation) =>
    formation.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    formation.lieu.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);  // Open the dialog on image click
  };

  const handleClose = () => {
    setOpen(false); // Close the dialog
  };
  const imag = (im: string) => {
    Swal.fire({
      title: "Sweet!",
      text: "Modal with a custom image.",
      imageUrl: im,
      imageWidth: 400,
      imageHeight: 400,
      imageAlt: "Custom image"
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <Typography variant="h3" className="text-center my-4">
          <Skeleton width={300} height={40} />
        </Typography>
  
        <div className="mb-6 flex justify-center">
          <Skeleton height={56} width="100%" className="max-w-md" />
        </div>
  
        {/* Formations Section */}
        <section>
          <Typography variant="h4" className="mb-4 text-center ">
            <Skeleton className='bg-grey-500' width={200} height={30} />
          </Typography>
          <Grid container spacing={3} justifyContent="center">
            {[1, ].map((_, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <Card className="shadow-lg">
                  <div className="p-2 w-full h-[500px] max-h-[500px] overflow-hidden border border-gray-300 rounded-lg shadow-lg">
                    <Skeleton  width="100%" height={300} />
                  </div>
  
                  <CardContent>
                    <Typography variant="h6">
                      <Skeleton width="80%" />
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      <Skeleton width="90%" />
                    </Typography>
                    <Typography variant="body2" color="textPrimary">
                      <Skeleton width="70%" />
                    </Typography>
                    <div className="flex items-center justify-between">
                      <Skeleton width="50%" />
                      <Skeleton  width={100} height={40} />
                      <Skeleton  width={100} height={40} />
                    </div>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </section>
      </div>
    );
  }
  

  return (
    <div className="container mx-auto p-6">
      <Typography variant="h3" className="text-center my-4">Bienvenue à notre plateforme de formations</Typography>

      {/* Search Input */}
      <div className="mb-6 ">
      </div>

      {/* Formations Section */}
      <section>
        <div className='flex justify-center p-2 mb-6  row-span-1'>
        <Typography variant="h4" className="text-center p-2">Nos Formations</Typography>
        <TextField
          label="Rechercher par titre ou lieu"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md ml-2 bg-slate-50 "
        />

        </div>
        <Grid container spacing={3} justifyContent="center">
          {filteredFormations.map((formation) => {
            const image = `${urlapi}/${formation.image}`;

            return (
              <Grid item xs={12} md={6} lg={4} key={formation.id}>
                <Card className="shadow-lg">
                  <div className="p-2 w-full h-[500px] max-h-[500px] overflow-hidden border border-gray-300 rounded-lg shadow-lg transition-transform hover:scale-105">
                    <img
                      src={image}
                      alt={formation.titre}
                      className="w-full h-full object-cover rounded-lg"
                      style={{ objectPosition: 'top center', width: '100%' }} // Assurez-vous que la largeur est forcée à 100%
                      onClick={() => imag(image)} // Ouvre le pop-up au clic
                    />
                  </div>


                  <CardContent>
                    <Typography variant="h6">{formation.titre}</Typography>
                    <Typography variant="body2" color="textSecondary">{formation.description}</Typography>
                    <Typography variant="body2" color="textPrimary">Lieu: {formation.lieu}</Typography>
                    <div className="flex items-center justify-between">
                      <Typography variant="body2" color="textPrimary">Frais: {formation.frais}</Typography>
                      <div className="flex space-x-2">
                        <button
                          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                          onClick={() => handleSelectProduct(formation.id)}
                        >
                          Voir
                        </button>
                        <button
                          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                          onClick={() => handleNavigationReset(formation.id)}
                        >
                          M'inscrire
                        </button>
                      </div>
                    </div>
                  </CardContent> 
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </section>
    </div>
  );
};

export default Accueil;
