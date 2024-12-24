'use client';

import { Button, TextField, Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Import Bootstrap icons
import { useRouter } from 'next/navigation';
import { jsPDF } from 'jspdf';
import axios from 'axios';


interface Formation {
  id: number;
  image: string;
  titre: string;
  description: string;
  lieu: string;
  frais: number; // Change frais to a number for easier calculations
}

const SignupForm: React.FC<{ params: { id: string } }> = ({ params }) => {
  const [formation, setFormation] = useState<Formation | null>(null);
  const [ftitre, setFtitre] = useState('');
  const router = useRouter();
  const printRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState('');
  const [succes, setSucces] = useState('');
  const [ins, setIns] = useState(true);


  const FsetIns = () => {
    setIns(!ins);
  }


  const { id } = params;

  const userEmail = typeof window !== 'undefined' ? localStorage.getItem('userEmail') : ''; // Get user email from localStorage
  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;

  const urlapi = "http://localhost:5000";

  const [lineWidth, setLineWidth] = useState("w-0"); // Initial width of the line (hidden)

  useEffect(() => {
    // Trigger the line animation when the component loads
    setTimeout(() => {
      setLineWidth("w-full"); // Line expands from right to left
    }, 100); // Delay to start the animation slightly after load
  }, []);

  useEffect(() => {
    if (id) {
      const formationUrl = `${urlapi}/api/formations/${id}`;
      console.log(formationUrl);
      fetch(formationUrl)
        .then((response) => response.json())
        .then((data) => {
          setFormation(data);
          setFtitre(data.titre); // Set the title of the formation
          console.log('Formation details:', data);
        })
        .catch((error) => console.error('Error fetching formation:', error));
    }
  }, [id]);

  // State to manage form data
  const currentDate = new Date().toISOString();

  const [formData, setFormData] = useState({
    nom_complet: '',
    idformation: id,
    iduser: userId,
    email: userEmail,
    total: 0,
    date_inscription: currentDate,
    montantpayer: 0,
    orangeNumber: '',
    paymentMethod: '',
    status: 'oui'
  });

  const [open, setOpen] = useState(true);
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);

  // Calculate montantpayer whenever total or formation changes
  useEffect(() => {
    if (formation) {
      const montantp = formData.total * formation.frais; // Calculate montantpayer
      setFormData((prevData) => ({
        ...prevData,
        montantpayer: montantp, // Update montantpayer in formData
      }));
    }
  }, [formData.total, formation]); // Recalculate when either `total` or `formation` changes

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name as string]: value,
    });
  };

  const handletotalChange = (change: number) => {
    // Ensure that total doesn't go below 1
    setFormData((prevData) => ({
      ...prevData,
      total: Math.max(1, prevData.total + change), // Prevent total from going below 1
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData); // Logique pour envoyer les données

    try {
      const response = await axios.post(`${urlapi}/api/inscription`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 201) {
        setSucces(`Bravo, vous êtes inscrit`);
      } else {
        throw new Error('Failed to add the comment');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to add the comment. Please try again.');
    }
  };


  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleClose1 = () => {
    setOpen(!open);
    setOpen1(!open1);
  };
  const handleClose2 = () => {
    setOpen1(!open1);
    setOpen2(!open2)
  };



  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);

    // Extract content from the printRef (the div you want to export)
    const content = printRef.current;
    if (content) {
      // Calculate the width considering the right margin of 10
      const pageWidth = doc.internal.pageSize.getWidth();
      const marginRight = 20;
      const width = pageWidth - marginRight - 20; // 20 is for left margin

      doc.html(content, {
        callback: (doc) => {
          // After rendering the main content, add the additional text at the bottom
          doc.setFontSize(12); // Set a slightly smaller font size for this note
          doc.text(
            "NB: Apporte ce document (numérique ou non) lors du paiement",
            20, // Left margin
            doc.internal.pageSize.getHeight() - 200 // Position near the bottom of the page
          );

          // Save the PDF
          doc.save(formation?.titre + '_reçu');
        },
        x: 20, // Left margin
        y: 10, // Top margin
        width: width, // Adjusted width with right margin
        windowWidth: 500,
      });
    }
  };

  useEffect(() => {
    if (error !== '' || succes !== '') {
      const timer = setTimeout(() => {
        setError('');
        setSucces('');
      }, 4000); // 4000 ms = 4 secondes

      // Nettoyer le timer si le composant est démonté avant la fin du délai
      return () => clearTimeout(timer);
    }
  }, [error, succes]);

  const setPaymentMethod = (orange: string, prix: number) => {
    alert('paiment reussi ' + orange + ' prix ' + prix + ' Ar')
  }
  return (
    <div>
      {error && (
        <div
          className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow-lg animate__animated animate__fadeIn animate__fadeOut"
          style={{
            animationDuration: '4s',
            animationTimingFunction: 'ease-out',
            zIndex: '3'
          }}
        >
          {error}
        </div>
      )}

      <>
        <Dialog open={open} fullWidth maxWidth="sm">
          <DialogTitle className="text-center">Inscription à : {formation?.titre}</DialogTitle>

          {error && (
            <div
              className="fixed top-13  bg-red-500 text-white px-4 py-2 rounded shadow-lg animate__animated animate__fadeIn animate__fadeOut"
              style={{
                animationDuration: '4s',
                animationTimingFunction: 'ease-out',
                zIndex: '3'
              }}
            >
              {error}
            </div>
          )}
          <div className="flex px-6 pl-4 items-center ml-4 space-x-4">
            {/* Étoiles */}
            <div className="relative flex items-center justify-between w-full">

              {/* Première étoile avec information */}
              <div className="relative flex flex-col items-center justify-center">
                <i className="bi bi-star-fill text-yellow-400 text-3xl sparkle"></i> {/* Première étoile en jaune */}
                <span className="text-sm text-gray-600 mt-1">Information</span> {/* Label "Information" sous la première étoile */}
              </div>

              {/* Ligne horizontale with animation */}
              <div className="mx-2 flex-grow">
                <div className="border-t-2 border-black w-full"></div> {/* Ligne horizontale */}
              </div>

              {/* Deuxième étoile avec information */}
              <div className="relative flex flex-col items-center justify-center">
                <i className="bi bi-star-fill text-gray-600 text-3xl sparkle"></i> {/* Deuxième étoile en jaune */}
                <span className="text-sm text-gray-600 mt-1">Montant</span> {/* Label "Montant" sous la deuxième étoile */}
              </div>

              <div className="mx-2 flex-grow">
                <div className="border-t-2 border-black w-full"></div> {/* Ligne horizontale */}
              </div>

              {/* Troisième étoile */}
              <div className="relative flex flex-col items-center justify-center">
                <i className="bi bi-star-fill text-gray-600 text-3xl sparkle"></i>
                <span className="text-sm text-gray-600 mt-1">Reçu</span> {/* Label "Reçu" sous la troisième étoile */}
              </div>
            </div>
          </div>

          <DialogContent>
            <form
              onSubmit={handleSubmit}
              className="bg-white p-8 space-y-6 text-black"
            >
              <h2 className="text-2xl font-semibold text-center mb-6">Inscription à la Formation</h2>

              {/* Champ Nom Complet */}
              <TextField
                label="Votre Nom Complet"
                variant="outlined"
                fullWidth
                name="nom_complet"
                value={formData.nom_complet}
                onChange={handleChange}
                className="my-2"
                required
              />

              {/* Champ Email avec bouton Modifier */}
              <div className="flex items-center my-2">
                <TextField
                  label="Email"
                  variant="outlined"
                  fullWidth
                  type="email"
                  name="email"
                  value={formData.email}  // Bind email to formData
                  onChange={handleChange}
                  className="my-2"
                  InputProps={{
                    readOnly: true, // Makes the field read-only instead of disabled
                  }}
                />
              </div>

              {/* Sélection de la formation */}
              <div className="flex items-center my-2">
                <TextField
                  label="Course"
                  name="course"
                  variant="outlined"
                  fullWidth
                  value={ftitre} // Bind course title to formData
                  onChange={handleChange}
                  className="my-2"
                  InputProps={{
                    readOnly: true, // Makes the field read-only instead of disabled
                  }}
                />
              </div>



              {/* Submit Button */}
              <Button
                type="submit"
                onClick={(e) => {
                  e.preventDefault(); // Prevent form submission
                  if (formData.nom_complet.trim().length >= 4) {
                    handleClose1(); // Call the function only if the validation passes
                  } else {
                    // You can also show an error message or alert here if needed
                    setError("Le nom complet doit etre completé.");
                  }
                }}
                variant="contained"
                color="primary"
                fullWidth
              >
                Suivant
                <i className="bi bi-arrow-right ml-2"></i> {/* Bootstrap left arrow icon */}
              </Button>

              <Button
                type="button"
                className="bg-white-300 text-red-600 hover:bg-red-700 hover:text-white p-2 rounded ml-2"
                onClick={() => router.push(`/services/details/${id}`)}
              >
                Annuler
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </>
      <>

        <Dialog open={open1} onClose={handleClose1} fullWidth maxWidth="sm">
          {error && (
            <div
              className="fixed top-13   bg-red-500 text-white px-4 py-2 rounded shadow-lg animate__animated animate__fadeIn animate__fadeOut"
              style={{
                animationDuration: '4s',
                animationTimingFunction: 'ease-out',
                zIndex: '3'
              }}
            >
              {error}

            </div>
          )}

          <DialogTitle className="text-center">Inscription à : {formation?.titre}</DialogTitle>

          <div className="flex px-6 pl-4 items-center ml-4 space-x-4">
            {/* Étoiles */}
            <div className="relative flex items-center justify-between w-full">

              {/* Première étoile avec information */}
              <div className="relative flex flex-col items-center justify-center">
                <i className="bi bi-star-fill text-yellow-400 text-3xl sparkle"></i> {/* Première étoile en jaune */}
                <span className="text-sm text-gray-600 mt-1">Information</span> {/* Label "Information" sous la première étoile */}
              </div>

              {/* Ligne horizontale with animation */}
              <div className="mx-2 flex-grow flex-col items-center justify-center">
                <div className={`border-t-2 border-yellow-400 transition-all duration-2000 ${lineWidth}`}></div> {/* Animated horizontal line */}
              </div>

              {/* Deuxième étoile avec information */}
              <div className="relative flex flex-col items-center justify-center">
                <i className="bi bi-star-fill text-yellow-400 text-3xl sparkle"></i> {/* Deuxième étoile en jaune */}
                <span className="text-sm text-gray-600 mt-1">Montant</span> {/* Label "Montant" sous la deuxième étoile */}
              </div>

              <div className="mx-2 flex-grow">
                <div className="border-t-2 border-black w-full"></div> {/* Ligne horizontale */}
              </div>

              {/* Troisième étoile */}
              <div className="relative flex flex-col items-center justify-center">
                <i className="bi bi-star-fill text-gray-400 text-3xl sparkle"></i>
                <span className="text-sm text-gray-600 mt-1">Reçu</span> {/* Label "Reçu" sous la troisième étoile */}
              </div>
            </div>

          </div>





          <DialogContent>
            <form onSubmit={handleSubmit} className="bg-white p-8 space-y-6 text-black">
              <h2 className="text-2xl font-semibold text-center mb-6">Inscription à la Formation</h2>



              {/* Input for positive integer with increment/decrement */}
              <div className="flex items-center my-2">
                <TextField
                  label="Total de participant"
                  name="total"
                  variant="outlined"
                  fullWidth
                  value={formData.total} // Bind value to formData.total (initially empty)
                  onChange={handleChange}
                  type="number"
                  inputProps={{ min: 1, style: { MozAppearance: 'textfield' } }} // Hide spinner in Firefox
                  className="my-2"
                  sx={{
                    '& input[type=number]': {
                      MozAppearance: 'textfield', // Hide spinner in Firefox
                    },
                    '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
                      WebkitAppearance: 'none', // Hide spinner in Chrome, Safari, Edge, Opera
                      margin: 0,
                    },
                  }}
                />
                <div className="flex space-x-2 ml-2">
                  <IconButton onClick={() => handletotalChange(1)} className="bg-gray-200">
                    <i className="bi bi-plus"></i>
                  </IconButton>
                  <IconButton onClick={() => handletotalChange(-1)} className="bg-gray-200">
                    <i className="bi bi-dash"></i>
                  </IconButton>
                </div>
              </div>

              {/* Display the calculated montantpayer */}
              <div className="my-2">
                <TextField
                  label="Montant à Payer en Ariary"
                  variant="outlined"
                  fullWidth
                  value={formData.montantpayer}
                  InputProps={{
                    readOnly: true, // Make it read-only as it's calculated
                  }}
                  className="my-2"
                />
              </div>

              {/* New Input for Orange Payment Number */}
              <div className="my-2">
                <TextField
                  label="Numéro Orange pour Paiement"
                  name="orangeNumber"
                  variant="outlined"
                  fullWidth
                  value={formData.orangeNumber} // Bind to orangeNumber in formData
                  onChange={handleChange}
                  type="tel"
                  inputProps={{
                    maxLength: 10, // Assuming 10-digit phone number for Orange
                  }}
                  className="my-2"
                />
              </div>

              {/* Payment Method Button for Orange */}
              <div className="my-4">
                <Button
                  onClick={(e) => {
                    e.preventDefault(); // Prevent default behavior if you want to handle separately
                    setPaymentMethod("Orange", formData.montantpayer);
                  }}
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Paiement avec Orange
                </Button>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-1 row-span-1">
                <Button onClick={handleClose1} variant="contained" color="primary" fullWidth>
                  <i className="bi bi-arrow-left mr-2"></i> {/* Bootstrap left arrow icon */}
                  Précédant
                </Button>

                <Button
                  onClick={(e) => {
                    e.preventDefault(); // Prevent form submission
                    if (formData.total !== 0) {
                      handleClose2();
                    } else {
                      // You can also show an error message or alert here if needed
                      setError("Le participant doit au moins être 1.");
                    }
                  }}
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Suivant
                  <i className="bi bi-arrow-right ml-2"></i> {/* Bootstrap left arrow icon */}
                </Button>
              </div>

              <Button
                type="button"
                className="bg-red-500 text-white hover:bg-red-700 p-2 rounded ml-2"
                onClick={() => router.push(`/services/details/${id}`)}
              >
                Annuler
              </Button>
            </form>
          </DialogContent>

        </Dialog>
      </>

      <>
        <Dialog open={open2} fullWidth maxWidth="sm">
          {succes && (
            <div
              className="fixed top-13 bg-green-600 text-white px-4 py-3 m-2 rounded shadow-lg animate__animated animate__fadeIn animate__fadeOut"
              style={{
                opacity: 0.9, // Transparence à 90%
                animationDuration: '4s',
                animationTimingFunction: 'ease-out',
                zIndex: '3'
              }}
            >

              {succes}
            </div>
          )}
          <DialogTitle className="text-center">Inscription à : {formation?.titre}</DialogTitle>

          <div className="flex px-6 pl-4 items-center ml-4 space-x-4">
            {/* Étoiles */}
            <div className="relative flex items-center justify-between w-full">
              {/* Première étoile avec information */}
              <div className="relative flex flex-col items-center justify-center">
                <i className="bi bi-star-fill text-yellow-400 text-3xl sparkle"></i>
                <span className="text-sm text-gray-600 mt-1">Information</span>
              </div>

              {/* Ligne horizontale with animation */}
              <div className="mx-2 flex-grow flex-col items-center justify-center">
                <div className={`border-t-2 border-yellow-400 transition-all duration-2000 ${lineWidth}`}></div>
              </div>

              {/* Deuxième étoile avec information */}
              <div className="relative flex flex-col items-center justify-center">
                <i className="bi bi-star-fill text-yellow-400 text-3xl sparkle"></i>
                <span className="text-sm text-gray-600 mt-1">Montant</span>
              </div>

              <div className="mx-2 flex-grow">
                <div className="border-t-2 border-yellow-400 w-full"></div>
              </div>

              {/* Troisième étoile */}
              <div className="relative flex flex-col items-center justify-center">
                <i className="bi bi-star-fill text-yellow-400 text-3xl sparkle"></i>
                <span className="text-sm text-gray-600 mt-1">Fin</span>
              </div>
            </div>
          </div>

          <DialogContent>
            {ins && (
              <form onSubmit={handleSubmit} className="bg-white p-8 space-y-6 text-black">
                <h2 className="text-2xl font-semibold text-center mb-6">
                  Verifier bien cette information avant l'inscription à: {formation?.titre}
                </h2>

                {/* Receipt information */}
                <div className="border p-4 rounded-md bg-gray-50" ref={printRef}>
                  <h3 className="text-xl font-medium mb-2">Détails de l'inscription</h3>
                  <p><strong>Nom complet:</strong> {formData.nom_complet}</p>
                  <p><strong>Email:</strong> {formData.email}</p>
                  <p><strong>Lieu:</strong> {formation?.lieu}</p>
                  <p><strong>Total:</strong> {formData.total}</p>
                  <p><strong>Montant à payer:</strong> {formData.montantpayer} Ar</p>
                  <p><strong>Date d'inscription:</strong> {new Date(formData.date_inscription).toLocaleDateString('fr-FR')}</p>

                </div>
                <div className=" flex row-span-1 gap-1">

                  <Button onClick={handleClose2} variant="contained" color="primary" fullWidth>
                    <i className="bi bi-arrow-left mr-2"></i> {/* Bootstrap left arrow icon */}
                    Precedant
                  </Button>
                  <Button
                    onClick={(e) => {
                      e.preventDefault(); // Prevent form submission
                      if (formData.total !== 0) {
                        handleSubmit(e);
                        generatePDF();
                        FsetIns();
                        setSucces(`bravo vous ete inscrit la cette formation verifier votre telechargement`)
                      }
                    }}
                    variant="contained"
                    color="primary"
                    fullWidth
                  >
                    <i className="bi bi-pencil  mr-2"></i> {/* Bootstrap left arrow icon */}
                    S'inscrire
                  </Button>

                </div>
              </form>
            )}
            <Button
              type="button"
              className="bg-red-500 text-white hover:bg-red-700 p-2 rounded ml-2"
              onClick={() => router.push(`/services/details/${id}`)}
            >
              Retour
            </Button>
          </DialogContent>
        </Dialog>
      </>



    </div>
  );
};

export default SignupForm;
