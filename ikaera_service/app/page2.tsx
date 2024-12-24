'use client';
import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import axios from 'axios';

interface CodeConfirmation {
  code: string[];
}

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState({
    non: '',
    prenom: '',
    email: '',
    role: 'utilisateur',
    password: '',
  });

  const [error, setError] = useState('');
  const [open, setOpen] = useState(true);
  const [open1, setOpen1] = useState(true);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [open4, setOpen4] = useState(false);
  const [conf, setConf] = useState<CodeConfirmation>({ code: ['', '', '', ''] }); // Initialisation de 4 entrées vides

  // Gestion des erreurs par champ
  const [formErrors, setFormErrors] = useState({
    non: '',
    prenom: '',
    email: '',
    password: '',
    code: '',
  });

  const handleClose = () => {
    window.location.href = '/';
  };
  const handleClose1 = () => {
    setOpen1(!open1);
    setOpen2(!open2);
  };
  const handleClose2 = () => {
    setOpen2(!open2);
    setOpen3(!open3);
  };
  const handleClose3 = () => {
    setOpen3(!open3);
    setOpen4(!open4);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCodeChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      const updatedCode = [...conf.code];
      updatedCode[index] = value;
      setConf({ code: updatedCode });
      console.log(conf);
    }
  };

  const handleCodeChange1 = (e: React.MouseEvent) => {
    console.log(conf);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation des champs
    let errors = {
      non: '',
      prenom: '',
      email: '',
      password: '',
      code: '',
    };

    // Validation du nom
    if (!formData.non) errors.non = 'Le nom est requis';

    // Validation du prénom
    if (!formData.prenom) errors.prenom = 'Le prénom est requis';

    // Validation de l'email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!formData.email) {
      errors.email = 'L\'email est requis';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'L\'email n\'est pas valide';
    }

    // Validation du mot de passe
    if (!formData.password) errors.password = 'Le mot de passe est requis';

    // Validation du code de confirmation
    if (conf.code.some(code => !code)) errors.code = 'Tous les champs du code doivent être remplis';

    setFormErrors(errors);

    // Si il n'y a pas d'erreurs, on peut soumettre le formulaire
    if (Object.values(errors).every((error) => error === '')) {
      try {
        // Appelle à l'API pour l'inscription
        await axios.post('/api/register', formData);
        alert('Inscription réussie !');
        handleClose(); // Fermer la modale après une inscription réussie
      } catch (err) {
        alert('Erreur lors de l\'inscription');
      }
    }
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Inscription</DialogTitle>
        <DialogContent>
          <Box sx={{ width: 300, padding: '10px' }}>
            <form>
              {open1 && (
                <>
                  <TextField
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                    error={!!formErrors.email}
                    helperText={formErrors.email}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        '& fieldset': { border: 'none' },
                        backgroundColor: '#f5f5f5',
                      },
                      '& .MuiInputLabel-root': {
                        color: '#555',
                      },
                      '& .MuiInputBase-input': {
                        padding: '10px',
                      }
                    }}
                  />
                  <Button 
                    onClick={(e) => {
                      e.preventDefault(); // Prevent form submission
                      if (formData.email !== '') {
                        handleClose1();
                      } else {
                        // You can also show an error message or alert here if needed
                        setError("L\'email n\'est pas valide");
                      }
                    }}
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ marginTop: 2 }}
                  >
                    Suivant
                    <i className="bi bi-arrow-right ml-2"></i>
                  </Button>
                </>
              )}

              {open2 && (
                <>
                  <Typography variant="h6" sx={{ marginBottom: 2 }}>
                    Veuillez entrer le code de confirmation envoyé à votre email.
                  </Typography>
                  <div className="flex justify-center space-x-2">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <TextField
                        key={index}
                        value={conf.code[index] || ''}
                        onChange={(e) => handleCodeChange(e, index)}
                        error={!!formErrors.code}
                        helperText={formErrors.code}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                            '& fieldset': { border: 'none' },
                            backgroundColor: '#f5f5f5',
                          },
                          '& .MuiInputLabel-root': {
                            color: '#555',
                          },
                          '& .MuiInputBase-input': {
                            padding: '10px',
                            textAlign: 'center',
                          },
                        }}
                        inputProps={{
                          style: { textAlign: 'center', fontSize: '20px', width: '50px' },
                          maxLength: 1,
                        }}
                      />
                    ))}
                  </div>

                  <div className="flex justify-between mt-3">
                    <Button
                      onClick={handleClose1}
                      variant="contained"
                      color="primary"
                      fullWidth
                      sx={{ marginTop: 2 }}
                      startIcon={<i className="bi bi-arrow-left" />}
                    >
                      Précédent
                    </Button>
                    <Button
                      onClick={handleClose2}
                      onClickCapture={handleCodeChange1}
                      variant="contained"
                      color="primary"
                      fullWidth
                      sx={{ marginTop: 2 }}
                      endIcon={<i className="bi bi-arrow-right" />}
                    >
                      Suivant
                    </Button>
                  </div>
                </>
              )}

              {/* Autres champs... */}
              {open3 && (
                <>
                  <TextField
                    label="Nom"
                    name="non"
                    value={formData.non}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                    error={!!formErrors.non}
                    helperText={formErrors.non}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        '& fieldset': { border: 'none' },
                        backgroundColor: '#f5f5f5',
                      },
                      '& .MuiInputLabel-root': {
                        color: '#555',
                      },
                      '& .MuiInputBase-input': {
                        padding: '10px',
                      }
                    }}
                  />
                  <TextField
                    label="Prénom"
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                    error={!!formErrors.prenom}
                    helperText={formErrors.prenom}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        '& fieldset': { border: 'none' },
                        backgroundColor: '#f5f5f5',
                      },
                      '& .MuiInputLabel-root': {
                        color: '#555',
                      },
                      '& .MuiInputBase-input': {
                        padding: '10px',
                      }
                    }}
                  />
                  <Button onClick={handleClose3} variant="contained" color="primary" fullWidth sx={{ marginTop: 2 }}>
                    Suivant
                    <i className="bi bi-arrow-right ml-2"></i>
                  </Button>
                </>
              )}
              {open4 && (
                <>
                  <TextField
                    label="Mot de passe"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        '& fieldset': { border: 'none' },
                        backgroundColor: '#f5f5f5',
                      },
                      '& .MuiInputLabel-root': {
                        color: '#555',
                      },
                      '& .MuiInputBase-input': {
                        padding: '10px',
                      }
                    }}

                  />
                  <TextField
                    label="Confirmation mot de passe"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        '& fieldset': { border: 'none' },
                        backgroundColor: '#f5f5f5',
                      },
                      '& .MuiInputLabel-root': {
                        color: '#555',
                      },
                      '& .MuiInputBase-input': {
                        padding: '10px',
                      }

                    }}
                  />
                  <div className=' flex row'>
                    <Button onClick={handleClose3} variant="contained" color="primary" fullWidth sx={{ marginTop: 2 }} className="mr-2">
                      <i className="bi bi-arrow-left mr-2"></i> {/* Bootstrap left arrow icon */}
                      Precedent
                    </Button>
                    <Button onClick={handleSubmit} variant="contained" color="primary" fullWidth sx={{ marginTop: 2 }}>
                      <i className="bi bi-pencil mr-2"></i> {/* Bootstrap left arrow icon */}
                      S'inscrire
                    </Button>
                  </div>

                  {error && <Typography color="error">{error}</Typography>}

                </>
                )}
            </form>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RegisterForm;
