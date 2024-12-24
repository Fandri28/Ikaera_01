"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import Skeleton from 'react-loading-skeleton'; // Import Skeleton
import 'react-loading-skeleton/dist/skeleton.css'; // Optional: import CSS


const EditFormation: React.FC<{ params: { id: string } }> = ({ params }) => {
    const router = useRouter();
    const { id } = params;
    const [titre, setTitre] = useState('');
    const [description, setDescription] = useState('');
    const [frais, setFrais] = useState('');
    const [lieu, setLieu] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const api = 'http://localhost:5000';
    const [loading, setLoading] = useState(true); // State to handle loading


    useEffect(() => {
        if (id) {
            const ap = `${api}/api/formations/${id}`;
            // Récupération des détails de la formation
            axios.get(ap)
                .then(response => {
                    const formation = response.data;
                    setTitre(formation.titre);
                    setDescription(formation.description);
                    setFrais(formation.frais);
                    setLieu(formation.lieu);
                    setImagePreview(`${api}/${formation.image}`);
                })
                .catch(error => {
                    console.error('Erreur lors de la récupération de la formation :', error);
                    setError('Erreur lors de la récupération de la formation.');
                });
                setLoading(false)
        }
    }, [id]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setImage(file);

        // Aperçu de la nouvelle image
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setImagePreview(null);
        }
    };

    const handleSubmit1 = async (e: React.FormEvent) => {
        e.preventDefault();
        Swal.fire({
            title: "Voulez-vous vraiment Modifier ?",
            icon: "warning",
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: "Oui",
            denyButtonText: "Non",
            timer: 3000,
            customClass: {
                confirmButton: 'bg-blue-500 hover:bg-blue-700 text-white',  // Bleu pour le bouton de confirmation
                denyButton: 'bg-red-500 hover:bg-gray-700 text-white'      // Couleur pour le bouton de refus (facultatif)
            }
        }).then((result) => {
            if (result.isConfirmed) {
                handleSubmit(e);
            } else if (result.isDenied) {
                Swal.fire({
                    title: "Les changements ne sont pas enregistrés",
                    icon: "info",
                    confirmButtonText: "OK",
                    customClass: {
                        confirmButton: 'bg-blue-500 hover:bg-blue-700 text-white' // Bouton bleu avec classes Tailwind
                    }
                });
            }
        });

    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Création de l'objet FormData pour les données du formulaire
        const formData = new FormData();
        formData.append('titre', titre);
        formData.append('description', description);
        formData.append('frais', frais);
        formData.append('lieu', lieu);

        // Si une nouvelle image a été sélectionnée, on l'ajoute au formData
        if (image) {
            formData.append('image', image);
        }

        try {
            const ap = `${api}/api/formations/${id}`;
            Swal.fire("Modifié!", "", "success");

            await axios.put(ap, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Envoi multipart
                },
            });

            // Redirection vers la liste des formations après la mise à jour
            router.push('/admin/formations');
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la formation :', error);
            setError('Erreur lors de la mise à jour de la formation.');
        }
    };
    const handleOutsideClick = (e: React.MouseEvent) => {
        const target = e.target as HTMLElement;
        if (target.classList.contains('modal-overlay')) {
            router.push('/admin/formations');
        }
    };

    return (
        <div className="modal-overlay fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" onClick={handleOutsideClick} style={{ zIndex: 100 }} >
            <div className="bg-white rounded shadow-lg p-8 w-1/3" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-bold mb-4">Modifier la Formation</h2>
                {error && <div className="mb-4 text-red-600">{error}</div>}
                {loading ? (
                    <div>
                        <Skeleton height={20} width={200} />
                        <Skeleton height={30} width={200} />
                    </div>
                ) : (
                    <form onSubmit={handleSubmit1}>
                        <div className="mb-4">
                            <label className="block text-sm font-bold mb-2" htmlFor="titre">Titre</label>
                            <input
                                type="text"
                                id="titre"
                                defaultValue={titre}
                                onChange={(e) => setTitre(e.target.value)}
                                className="border rounded p-2 w-full"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-bold mb-2" htmlFor="description">Description</label>
                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="border rounded p-2 w-full"
                                required
                            ></textarea>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-bold mb-2" htmlFor="frais">Frais</label>
                            <input
                                type="number"
                                id="frais"
                                value={frais}
                                onChange={(e) => setFrais(e.target.value)}
                                className="border rounded p-2 w-full"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-bold mb-2" htmlFor="lieu">Lieu</label>
                            <input
                                type="text"
                                id="lieu"
                                value={lieu}
                                onChange={(e) => setLieu(e.target.value)}
                                className="border rounded p-2 w-full"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-bold mb-2" htmlFor="image">Image</label>
                            <input
                                type="file"
                                id="image"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="border rounded p-2 w-full"
                            />
                            {imagePreview && (
                                <div className="mt-4">
                                    <img src={imagePreview} alt="Prévisualisation" className="w-32 h-32 object-cover mb-2 rounded-md" />
                                </div>
                            )}
                        </div>
                        <button type="submit" className="bg-green-500 text-white hover:bg-green-700 p-2 rounded">
                            Sauvegarder
                        </button>
                        <button
                            type="button"
                            className="bg-red-500 text-white hover:bg-red-700 p-2 rounded ml-2"
                            onClick={() => router.push('/admin/formations')}
                        >
                            Retour
                        </button>
                    </form>

                )}

            </div>
        </div>
    );
};

export default EditFormation;
