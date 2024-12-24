"use client"; // Ensure client-side rendering
import React, {useState } from 'react';
import axios from 'axios'; // Import Axios
import { toast, ToastContainer } from 'react-toastify'; // Import Toastify
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS
import Swal from 'sweetalert2';

const AjoutFormation: React.FC = () => {
    const [titre, setTitre] = useState('');
    const [description, setDescription] = useState('');
    const [frais, setFrais] = useState('');
    const [lieu, setLieu] = useState('');
    const [dateAjout, setDateAjout] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const ApiUrl = 'http://localhost:5000';
    const [formations, setFormations] = useState([]);
     
    

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedImage = e.target.files[0];
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
            const maxSize = 5 * 1024 * 1024; // 5MB limit

            if (!allowedTypes.includes(selectedImage.type)) {
                toast.error('Veuillez télécharger une image valide (JPEG, PNG, GIF).');
                return;
            }

            if (selectedImage.size > maxSize) {
                toast.error("L'image ne doit pas dépasser 5 Mo.");
                return;
            }

            setImage(selectedImage);
            setImagePreview(URL.createObjectURL(selectedImage));
        }
    };

    const escapeQuotes = (str: string) => {
        return str.replace(/'/g, "''").replace(/"/g, '""');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('titre', escapeQuotes(titre));
        formData.append('description', escapeQuotes(description));
        formData.append('frais', frais);
        formData.append('lieu', lieu);
        formData.append('date_ajout', dateAjout);
        if (image) {
            formData.append('image', image);
        }

        try {
            const response = await axios.post(`${ApiUrl}/api/add`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status !== 201) {
                throw new Error("Échec de l'ajout de la formation");
            }
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Your work has been saved",
                showConfirmButton: false,
                timer: 3000,
                customClass: {
                    popup: 'h-40', // Ajuste la largeur et la hauteur du modal (taille plus petite)
                    title: 'text-sm', // Ajuste la taille du texte du titre
                    icon: 'text-sm',  // Ajuste la taille de l'icône
                }
            });
            
            // toast.success('Formation ajoutée avec succès !', {
            //     style: { backgroundColor: 'white', color: 'green', top: '45px' },
            //     position: "top-center"
            // });
            // Reset form fields
            setTitre('');
            setDescription('');
            setFrais('');
            setLieu('');
            setDateAjout('');
            setImage(null);
            setImagePreview(null);
        } catch (error) {
            toast.error("Échec de l'ajout de la formation. Veuillez réessayer.");
        }
    };

    const handleReturn = () => {
        window.history.back(); // Go back to the previous page
    };

    return (
        <div className="modal-overlay fixed inset-0 flex items-center justify-center flex-col bg-black bg-opacity-50" style={{ zIndex: 100 }}>
            <ToastContainer /> {/* Toast container for showing messages */}
            <h2 className="text-2xl font-bold mb-4">Ajouter une nouvelle formation</h2>

            <form onSubmit={handleSubmit} className="bg-white rounded shadow-lg p-8 w-1/3">
                {/* Image Upload */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Image de la formation</label>
                    <input
                        type="file"
                        className="mt-1 block w-full"
                        onChange={handleImageChange}
                        accept="image/*"
                    />
                </div>

                {/* Image Preview */}
                {imagePreview && (
                    <div className="mt-4 mb-4">
                        <img
                            src={imagePreview}
                            alt="Image Preview"
                            className="w-32 h-32 object-cover border rounded-md"
                        />
                    </div>
                )}

                {/* Title Input */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Titre de la formation</label>
                    <input
                        type="text"
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        value={titre}
                        onChange={(e) => setTitre(e.target.value)}
                        required
                    />
                </div>

                {/* Description Input */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md h-24"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    ></textarea>
                </div>

                {/* Fee Input */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Frais</label>
                    <input
                        type="number"
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        value={frais}
                        onChange={(e) => setFrais(e.target.value)}
                        required
                    />
                </div>

                {/* Location Input */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Lieu</label>
                    <input
                        type="text"
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        value={lieu}
                        onChange={(e) => setLieu(e.target.value)}
                        required
                    />
                </div>

                {/* Date of Addition Input */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Date d'ajout</label>
                    <input
                        type="date"
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        value={dateAjout}
                        onChange={(e) => setDateAjout(e.target.value)}
                        required
                    />
                </div>

                {/* Submit Button */}
                <div className="flex justify-between">
                    <button
                        type="button"
                        onClick={handleReturn}
                        className="bg-gray-500 text-white hover:bg-gray-700 p-2 rounded-md transition duration-300 ease-in-out transform hover:scale-105"
                    >
                        Retour
                    </button>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white hover:bg-blue-700 p-2 rounded-md transition duration-300 ease-in-out transform hover:scale-105"
                    >
                        Ajouter la formation
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AjoutFormation;
