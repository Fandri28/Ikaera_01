"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';



// Import interfaces from Interface.tsx
import { Comment, Etoile, Formation, Utilisateur } from './Interface';
import AjouterComment from './ajoutcomment';


const Details: React.FC<{ params: { id: string } }> = ({ params }) => {
  const [product, setProduct] = useState<Formation | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [etoile, setEtoile] = useState<Etoile[]>([]);
  const [utilisateur, setUtilisateur] = useState<Utilisateur[]>([]);
  const [newComment, setNewComment] = useState('');
  const [newComment1, setNewComment1] = useState('');
  const [newRating, setNewRating] = useState(0);
  const [editedComment1, setEditedComment1] = useState(0); // State for edited comment
  const [defaultRating, setDefaultRating] = useState(0); // Default rating from API
  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState('')
  const [succes, setSucces] = useState('')
  const router = useRouter();
  const { id } = params;
  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
  const userEmail = typeof window !== 'undefined' ? localStorage.getItem('userEmail') : null;
  const urlapi = "http://localhost:5000";



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

  const handleToggle = () => {
    setIsVisible(!isVisible); // Toggle between true and false
  };


  const handleNavigationReset = () => {
    // Logique de réinitialisation si nécessaire, puis navigation
    router.push(`/services/inscription/${product?.id}`);
  };

  // Fetch formation details
  useEffect(() => {
    if (id) {
      const formationUrl = `${urlapi}/api/formations/${id}`;
      console.log(formationUrl);

      fetch(formationUrl)
        .then((response) => response.json())
        .then((data) => {
          setProduct(data);
          console.log('Formation details:', data);
        })
        .catch((error) => console.error('Error fetching formation:', error));
    }
  }, [id]);

  // Fetch comments
  const fetchComments = () => {
    if (id) {
      const commentsUrl = `${urlapi}/api/comments`;
      fetch(commentsUrl)
        .then((response) => response.json())
        .then((data) => {
          setComments(data);
          console.log('Comments data:', data);
        })
        .catch((error) => console.error('Error fetching comments:', error));
    }
  };
  useEffect(() => {
    fetchComments();
  }, [id]);

  // Fetch user's stars (or rating information)
  const fetchEtoiles = () => {
    if (id) {
      const etoileUrl = `${urlapi}/api/stars`;
      fetch(etoileUrl)
        .then((response) => response.json())
        .then((data) => {
          setEtoile(data);
          const userRating = data.find((rating: Etoile) => rating.iduser === parseInt(userId!) && rating.idformation === parseInt(id));
          if (userRating) {
            setDefaultRating(userRating.rate);
          }
          console.log('Star rating data:', data);
        })
        .catch((error) => console.error('Error fetching star ratings:', error));
    }
  }
  useEffect(() => {
    fetchEtoiles();
  }, [id]);

  // Fetch utilisateurs
  useEffect(() => {
    const UtilisateurUrl = `${urlapi}/api/utilisateurs`;
    fetch(UtilisateurUrl)
      .then((response) => response.json())
      .then((data) => {
        setUtilisateur(data);
        console.log('Utilisateur data:', data);
      })
      .catch((error) => console.error('Error fetching utilisateurs:', error));
  }, []);



  const handleCommentChange1 = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewComment1(e.target.value);

    const currentDate = new Date().toISOString();

    // Afficher formData dans la console
    console.log('Form Data:', {

      Commentaire: e.target.value,

    });
  };




  // gerer les etoiles
  const handleStar = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      setError('User not found. Please log in.');
      return;
    }

    const currentDate = new Date().toISOString();

    const etoileData = {
      idformation: id,
      iduser: userId,
      rate: newRating,
      daterate: currentDate,
      Action: 'visible',
    };
    console.log(etoileData)

    const nbretoile = defaultRating;

    if (nbretoile === 0) {

      try {
        const response = await axios.post(`${urlapi}/api/stars`, etoileData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 201) {
          setDefaultRating(0)
          console.log('etoile added:', response.data.etoile);
          fetchComments();
          fetchEtoiles();
          setNewRating(0);
          setSucces('Nous vous remercions');


        } else {
          throw new Error('Failed to add the comment');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Failed to add the comment. Please try again.');
      }
    }
    else if (defaultRating > 0) {
      try {
        const response = await axios.patch(
          `${urlapi}/api/stars/${userId}/${id}`,  // This will replace :idu with userId and :idf with id
          { rate: etoileData.rate },  // Only send the rate
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.status === 200) {  // Assuming 200 status code for success
          console.log('Rating updated:', response.data);
          fetchComments();  // Re-fetch comments after updating
          fetchEtoiles();
          setDefaultRating(0)
          setNewRating(0);
          setSucces('Nous vous remercions');



        } else {
          throw new Error('Failed to update the rating');
        }
      } catch (error) {
        console.error('Error:', error);
        setError('Failed to update the rating. Please try again.');
      }
    }
  }

  const handlhdeleteEtoile = async () => {
    try {
      await axios.delete(`${urlapi}/api/stars/${id}/${userId}`); // Adjusted API endpoint
      console.log('Suppression réussie'); // Affiche une alerte en cas de succès
      fetchEtoiles();
      setNewRating(0);
      setDefaultRating(0)
      setSucces('Suppression reussie');

    } catch (error) {
      console.error('Error deleting data:', error);
      setError('Erreur lors dela suppression')
    }
  };

  const handleDeleteComment = async (idcomment: number) => {
    setConfirm(true); // Trigger the confirmation dialog
    setOk(false); // Reset confirmation state to false before the user confirms

    if (ok) {

      try {
        await axios.delete(`${urlapi}/api/comments/${id}/${userId}/${idcomment}`); // Adjusted API endpoint
        setSucces('Suppression reussie');
        fetchComments();  // Re-fetch comments after updating


      } catch (error) {
        setError('Erreur lors dela suppression')
        console.error('Error deleting data:', error);
      }
    }
  };


  // modifiction commentaire 
  const handleModifier = async (idcommente: number) => {
    const formData2 = {
      commentaire: newComment1,
    };

    try {
      const ap = `${urlapi}/api/comments/${id}/${userId}/${idcommente}`;
      await axios.patch(ap, formData2, {
        headers: {
          'Content-Type': 'application/json', // Envoi des données JSON

        },
      });
      console.log('Commentaire mis à jour avec succès');
      fetchComments();
      handleToggle();
      setSucces('Modification reussie')

    } catch (error) {
      console.error('Erreur lors de la mise à jour du commentaire :', error);
      setError('Erreur lors dela modification')

    }
  };



  const [confirm, setConfirm] = useState(false); // Initially set to false to hide confirmation
  const [ok, setOk] = useState(false); // Track confirmation state

  // Function for confirmation
  const handleConfirm = () => {
    setOk(true);  // Set ok to true when user confirms
    setConfirm(false);  // Close the confirmation dialog
  };

  // Function for cancellation
  const handleCancel = () => {
    setConfirm(false);  // Close the confirmation dialog without action
  };

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      router.push(`/services`)
      // Close by going back to the previous page
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }




  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleOutsideClick}
    >
      {error && (
        <div
          className="fixed left-13 bottom-13 bg-red-500 text-white px-4 py-2 rounded shadow-lg animate__animated animate__fadeIn animate__fadeOut"
          style={{
            animationDuration: '4s',
            animationTimingFunction: 'ease-out',
            zIndex: '3'
          }}
        >
          {error}
        </div>
      )}

      {succes && (
        <div
          className="fixed left-2 bottom-2 bg-green-500 text-white px-4 py-2 rounded shadow-lg animate__animated animate__fadeIn animate__fadeOut"
          style={{
            animationDuration: '4s',
            animationTimingFunction: 'ease-out',
            zIndex: '3'
          }}
        >
          {succes}
        </div>
      )}
      {confirm && (
        <div
          className="fixed border-black bg-green-200 text-white px-4 py-2 rounded shadow-lg animate__animated animate__fadeIn animate__fadeOut"
          style={{
            animationDuration: '4s',
            animationTimingFunction: 'ease-out',
            zIndex: '3'
          }}
        >
          <p className="px-2 text-black">Confirmer la suppression ?</p>
          <div className="mt-2">
            <button
              onClick={() => handleConfirm()}  // Fonction à définir pour gérer la confirmation
              className="mr-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Confirmer
            </button>
            <button
              onClick={() => handleCancel()}  // Fonction à définir pour gérer l'annulation
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg p-8 max-w-3xl w-full relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-black text-3xl"
          onClick={() => router.back()}
        >
          &times;
        </button>

        <h2 className="text-blue-500 font-bold mb-4 text-xl">Détails de la formation:  {product.titre}</h2>

        <div className="flex space-x-4">
          <div className="w-1/3 h-40 rounded-lg flex items-center justify-center">
            <img
              src={`${urlapi}/${product.image}`}
              width={120}
              height={150}
              className="rounded-md object-cover"
              alt={`Image de la formation ${product.id}`}
            />
          </div>

          <div className="w-2/3 space-y-3">
            <p className="text-lg text-black"><strong>Description :</strong> {product.description}</p>
            <p className="text-lg text-black"><strong>Lieu :</strong> {product.lieu}</p>
            <p className="text-lg text-black"><strong>Frais :</strong> {product.frais}</p>
            <button
              className="bg-blue-500 text-white rounded-lg px-4 py-2 mt-2 hover:bg-blue-600"
              onClick={handleNavigationReset}
            >
              < i className="bi bi-pencil mr-3"></i>
              M'inscrire
            </button>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="font-semibold mb-2 text-black">Attribuer une note :</h3>
          <div className="flex items-center mb-3">
            <div className="'text-red'">
              <button
                className="text-white bg-red-500 rounded-lg px-2  py-1 mx-1 hover:bg-blue-600"
                onClick={handlhdeleteEtoile}
              >
                0
              </button>
            </div>
            {[...Array(5)].map((_, index) => (
              <i
                key={`default-${index}`}
                className={`bi bi-star ${index < (newRating || defaultRating) ? 'text-orange-500' : 'text-gray-400'} cursor-pointer`}
                onClick={() => setNewRating(index + 1)} // Update the rating when clicking a star
              ></i>
            ))}
            {newRating > 0 ? (
              <span className="ml-2 text-black">
                {newRating} étoile{newRating > 1 ? 's' : ''}
                <button
                  onClick={handleStar}
                  className="text-white bg-blue-500 rounded-lg px-4 py-1 mx-1 hover:bg-blue-600"
                >
                  Soumettre
                </button>
              </span>
            ) : (
              <span className="ml-2 text-black">
                {defaultRating} étoile{defaultRating > 1 ? 's' : ''}
              </span>
            )}
          </div>

        </div>





        <h3 className="font-semibold mt-6 mb-2 text-black">Les commentaires  :</h3>
        <ul className={`mb-4 space-y-2 ${comments.length > 2 ? 'overflow-y-scroll h-60 w-full' : ''}`}>
          {comments.length !== 0 ? (
            comments
              .filter((comment) => comment.idproduit === parseInt(id)) // Filtrer les commentaires par idproduit
              .map((comment, index) => {
                // Trouver l'étoile correspondante à cet utilisateur
                const userEtoile = etoile.find((e) => e.iduser === comment.iduser && e.idformation === Number(id));
                // Trouver les infos de l'utilisateur
                const userInfo = utilisateur.find((u) => u.id === comment.iduser);

                return (
                  <li key={index} className="bg-gray-100 p-3 rounded mb-2 relative">
                    <div className="flex justify-between items-center">
                      <span className="text-black text-sm font-bold">
                        {userInfo ? userInfo.email : comment.iduser}
                      </span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <i
                            key={i}
                            className={`bi bi-star ${userEtoile && i < userEtoile.rate ? 'text-yellow-600' : 'text-gray-300'}`}
                          ></i>
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">{new Date(comment.date).toLocaleDateString('fr-FR')}</p>

                    <p
                      className={`text-black font-bold ${isVisible && comment.idcomment === editedComment1 ? 'hidden' : 'block'}`}
                      style={{ zIndex: 1 }}
                    >
                      {comment.commentaire}
                    </p>

                    {/* Boutons pour modifier et supprimer */}
                    {!isVisible && comment.iduser === Number(userId) && comment.idproduit === parseInt(id) && (
                      <div className="flex justify-end space-x-2">
                        <button
                          className="text-green-500 rounded-lg px-2 py-1 hover:bg-green-400 hover:text-white"
                          onClick={() => {
                            setEditedComment1(comment.idcomment);
                            handleToggle();
                          }}
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDeleteComment(comment.idcomment)}
                          className="text-red-500 rounded-lg px-2 py-1 hover:bg-red-400 hover:text-white"
                        >
                          Supprimer
                        </button>
                      </div>
                    )}

                    {/* Textarea pour modifier le commentaire */}
                    {isVisible && comment.idcomment === editedComment1 && comment.iduser === Number(userId) && comment.idproduit === parseInt(id) && (
                      <div className="inset-0 bg-gray-100 z-10 p-3 flex justify-end space-x-2">
                        <textarea
                          className="w-full  bg-gray-100 border-none rounded-lg focus:outline-none focus:border-blue-500 text-black"
                          defaultValue={comment.commentaire}
                          onChange={handleCommentChange1}
                          style={{ zIndex: 2, fontFamily: 'Times New Roman', fontSize: '14pt' }} // Ajout du style
                          required // Champ obligatoire
                        />

                        <button
                          onClick={() => handleModifier(comment.idcomment)}
                          className="text-green-500 rounded-lg px-1 py-0.5 hover:text-green-300 text-sm"
                        >
                          <i className="bi bi-pencil text-xl"></i> {/* Icône de modification Bootstrap */}
                        </button>

                        <button
                          onClick={() => handleToggle()}
                          className="text-red-500 p-1 hover:text-red-300 rounded-lg"
                          
                        >
                          <i className="bi bi-x text-3xl"></i> {/* Icône de croix Bootstrap agrandie */}
                        </button>

                      </div>

                    )}
                  </li>

                );
              })
          ) : (
            <p>Aucun commentaire pour le moment.</p>
          )}
        </ul>

        <h3 className="font-semibold mb-2 text-black">
          Ajouter un commentaire :</h3>
        <div className="flex items-center border rounded-lg p-2 mb-3">

          {/* Render the AjouterComment component */}
          {userId && <AjouterComment id={id} userId={userId} fetchComments={fetchComments} />}
        </div>

      </div>
    </div>
  );
};

export default Details;
