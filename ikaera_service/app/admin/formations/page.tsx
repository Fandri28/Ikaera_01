"use client"; // Ensure client-side rendering

import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import axios from 'axios'; // Import axios
import { toast, ToastContainer } from 'react-toastify'; // Import the toaster and ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for Toastify
import Swal from 'sweetalert2';
import Skeleton from 'react-loading-skeleton'; // Import Skeleton
import 'react-loading-skeleton/dist/skeleton.css'; // Optional: import CSS


// Définition de l'interface pour la table etoile
export interface Etoile {
    id: number;
    idformation: number;
    iduser: number;
    rate: number;
    dateRate: string;
}

// Register necessary chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const Formations: React.FC = () => {
    const [data, setData] = useState<any[]>([]); // Initialize with an empty array
    const [loading, setLoading] = useState(true); // State to handle loading
    const urlapi = "http://localhost:5000";
    const [comments, setComments] = useState([]);
    const [stars, setStars] = useState<Etoile[]>([]); // Type de stars comme tableau d'objets Etoile
    const [userId, setUserId] = useState<string | null>(null); // State for userId

    // Fetch data from the API on localhost:5000
    useEffect(() => {
        // Check if we're in the browser before accessing localStorage
        if (typeof window !== "undefined") {
            const storedUserId = localStorage.getItem('userId');
            setUserId(storedUserId);
        }

        // Fetch comments
        fetch(`${urlapi}/api/comments`)
            .then((res) => res.json())
            .then(setComments)
            .catch((err) => console.error('Error fetching comments:', err));

        // Fetch stars (ratings)
        fetch(`${urlapi}/api/stars`)
            .then((res) => res.json())
            .then(setStars)
            .catch((err) => console.error('Error fetching stars:', err));
    }, []);

    // Fetch data from backend
    const fetchData = async () => {
        try {
            const response = await axios.get(`${urlapi}/api/formations`);
            setData(response.data); // Set fetched data to state
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false); // Stop loading regardless of success or failure
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Function to delete a row
    const handleDelete = async (id: number) => {
        try {
            // Vérifier si l'ID formation correspond à l'ID dans la table stars
            const starToDelete = stars.find(star => star.idformation === id && star.iduser === Number(userId));
            if (starToDelete) {
                const urlap1 = `${urlapi}/api/stars/${id}/${userId}`;
                await axios.delete(urlap1); // Supprimer d'abord les étoiles liées
            }

            // Supprimer la formation après avoir supprimé les étoiles liées
            const urlap = `${urlapi}/api/formations/${id}`;
            await axios.delete(urlap);

            // Recharger les données après suppression
            fetchData();
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Suppression avec succès",
                showConfirmButton: false,
                timer: 3000,
                customClass: {
                    popup: 'h-42 w-50', // Ajuste la largeur et la hauteur du modal (taille plus petite)
                    title: 'text-sm', // Ajuste la taille du texte du titre
                    icon: 'text-sm',  // Ajuste la taille de l'icône
                }
            });

        } catch (error) {
            console.log(id); // Afficher l'ID pour le débogage
            console.error('Error deleting data:', error); // Afficher l'erreur en console
        }
    };

    // Confirm delete with a toast
    const confirmDelete = (id: number) => {
        // Affiche un toast de confirmation avec des boutons Oui/Non
        Swal.fire({
            title: "Voulez-vous vraiment supprimer ?",
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
                handleDelete(id);
                Swal.fire("Supprimé!", "", "success");
            } else if (result.isDenied) {
            }
        });


        // toast(
        //     ({ closeToast }) => (
        //         <div>
        //             <p>Êtes-vous sûr de vouloir supprimer cet élément ?</p>
        //             <button
        //                 onClick={() => {
        //                     handleDelete(id); // Supprime l'élément si confirmé
        //                     closeToast(); // Ferme le toast
        //                 }}
        //                 className="bg-green-500 text-white p-2 rounded mr-2" // Set padding to 2px
        //             >
        //                 Oui
        //             </button>
        //             <button
        //                 onClick={closeToast}
        //                 className="bg-red-500 text-white p-2 rounded" // Set padding to 2px
        //             >
        //                 Non
        //             </button>
        //         </div>
        //     ),
        //     {
        //         position: "top-center",
        //         autoClose: false, // Ne pas fermer automatiquement
        //         closeOnClick: false, // Désactiver la fermeture automatique par clic
        //         style: {
        //             top: '50px', // Set the top position to 50px
        //         },
        //     }
        // );
    };

    // Data for the bar chart
    const barData = data.map(item => ({
        name: item.titre,
        frais: item.frais
    }));

    // Data for the pie chart

    // Prepare Bar Chart Data
    const barChartData = {
        labels: barData.map(item => item.name),
        datasets: [
            {
                label: 'Frais',
                data: barData.map(item => item.frais),
                backgroundColor: '#FFA500', // Light orange color
                barThickness: 20, // Adjust the thickness (smaller number for slimmer bars)
                borderRadius: 5, // Optional: round the bars
            }
        ],
    };

    // Prepare Pie Chart Data
    const pieData = data.map((item) => ({
        name: item.titre,
        value: item.frais,
    }));
    const pieChartData = {
        labels: pieData.map(item => item.name),
        datasets: [
            {
                data: pieData.map(item => item.value),
                backgroundColor: ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'],
                borderWidth: 0,
            }
        ],
    };

    // Loader while fetching data


    return (
        <div className="container mx-auto mt-8 p-4 text-black">
            <div className="flex flex-row justify-between">
                <div className="relative w-2/3 h-[700px] max-h-[700px] overflow-y-auto bg-gray-100 pt-0 pb-0 p-4 space-y-4 rounded-md">
                    <div className="sticky top-0 bg-gray-100 z-10 p-4 flex justify-between items-center border-b border-gray-300 shadow-[0_10px_10px_-10px_white]">
                        <h2 className="text-2xl font-semibold">Liste des Formations</h2>
                        <button
                            className="bg-blue-500 text-white hover:bg-blue-700 p-2 rounded-md flex items-center"
                            onClick={() => window.location.href = '/admin/formations/ajoute'}
                        >
                            <i className="bi bi-plus-circle-fill mr-2"></i> Ajouter
                        </button>
                    </div>

                        {loading ? (
                            <div className='pl-4] '>
                                <Skeleton height={100} width={100} />
                                <Skeleton height={20} width={150} />
                                <Skeleton height={20} width={120} />
                                <Skeleton height={20} width={100} />
                            </div>
                        ) : (
                    <div className="mt-4">

                            {data.map(item => {
                                    const image = `${urlapi}/${item.image}`;
                                    return (
                                        <div key={item.id} className="bg-white p-4 rounded-md shadow-md mb-4 flex">
                                            <img
                                                src={image}
                                                alt={item.titre}
                                                className="w-32 h-32 object-cover mb-2 rounded-md"
                                            />
                                            <div className="flex flex-col justify-between ml-4 flex-grow">
                                                <div>
                                                    <h3 className="font-bold text-lg">{item.titre}</h3>
                                                    <p className="text-gray-600">{item.description}</p>
                                                    <p className="text-blue-800 font-semibold">
                                                        <span className="font-bold">Frais:</span> {item.frais} Ar
                                                    </p>
                                                    <p className="font-bold text-gray-800">Lieu: {item.lieu}</p>
                                                    <p className="text-gray-600">
                                                        <span className="font-bold">Date d'ajout:</span> {new Date(item.date_ajout).toLocaleDateString('fr-FR')}
                                                    </p>
                                                </div>
                                                <div className="flex justify-end mt-2">
                                                    <button
                                                        className="bg-yellow-500 text-white hover:bg-yellow-700 p-2 rounded-md flex items-center mr-2"
                                                        onClick={() => window.location.href = `/admin/formations/modifier/${item.id}`}
                                                    >
                                                        <i className="bi bi-pencil-fill mr-2"></i> Modifier
                                                    </button>

                                                    <button
                                                        onClick={() => confirmDelete(item.id)} // Confirmation via toast
                                                        className="bg-red-500 text-white hover:bg-red-700 p-2 rounded-md flex items-center"
                                                    >
                                                        <i className="bi bi-trash-fill mr-2"></i> Supprimer
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            }
                    </div>
                        )}

                    <div className="sticky bottom-0 bg-gray-100 z-10 p-4 flex justify-center border-t border-gray-300 shadow-[0_-10px_10px_-10px_white]">
                        <p className="text-gray-700">Les formations</p>
                    </div>
                </div>

                <div className="w-1/3 flex flex-col justify-between ml-4">
                    <div className="h-[370px] bg-white pb-2 rounded-md shadow-md">
                        <h4 className="text-center text-lg font-semibold mt-1">Répartition par Catégorie</h4>
                        <Pie className="p-9 w-[]" data={pieChartData} options={{ maintainAspectRatio: false }} />
                    </div>
                    <div className="h-[300px] bg-white p-9 rounded-md shadow-md mt-5">
                        <h4 className="text-center text-lg font-semibold m-1">Évolution des Données</h4>
                        <Bar data={barChartData} options={{ maintainAspectRatio: false }} />
                    </div>
                </div>
            </div>

            {/* Toast Container for showing the toasts */}
            <ToastContainer />
        </div>
    );
};

export default Formations;
