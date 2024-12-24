"use client"; // Ensure client-side rendering
import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Import axios
import Skeleton from 'react-loading-skeleton'; // Import Skeleton
import 'react-loading-skeleton/dist/skeleton.css'; // Optional: import CSS

const Utilisateurs: React.FC = () => {
    const [data, setData] = useState<any[]>([]); // Initialize with an empty array
    const [loading, setLoading] = useState(true); // State to handle loading
    const urlapi = "http://localhost:5000";

    // Fetch data from backend
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${urlapi}/api/utilisateurs`); // Point to the users API
                setData(response.data); // Set fetched data to state
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false); // Stop loading regardless of success or failure
            }
        };

        fetchData();
    }, []);

    // Function to delete a user
    const handleDelete = async (id: number) => { // Use correct identifier
        try {
            await axios.delete(`${urlapi}/api/utilisateurs/${id}`); // Point to the users API for deletion
            setData(data.filter(item => item.id !== id)); // Remove item from state based on ID
        } catch (error) {
            console.error('Error deleting data:', error);
        }
    };

    // Render skeletons when loading
    if (loading) {
        return (
            <div className="container mx-auto p-4 mt-8 text-black">
                <div className="w-2/3 mx-auto justify-center">
                    {/* Display skeletons for loading */}
                    {[1,].map((_, index) => (
                        <div key={index} className="bg-white p-4 rounded-md shadow-md mb-4">
                            <Skeleton height={30} width={800} />
                            <Skeleton height={20} width={800} />
                            <Skeleton height={20} width={800} />
                            <Skeleton height={30} width={800} />

                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 mt-8 text-black" style={{ zIndex: 0 }}>
            <div className="flex flex-row justify-center">
                <div className="relative w-2/3 h-[720px] max-h-[730px] overflow-y-auto bg-gray-100 pt-0 pb-0 p-4 space-y-4 rounded-md">
                    <div className="sticky top-0 bg-gray-100 z-10 p-4 flex justify-between items-center border-b border-gray-300 shadow-[0_10px_10px_-10px_white]">
                        <h2 className="text-2xl font-semibold">Liste des Utilisateurs</h2>
                        <button
                            className="bg-blue-500 text-white hover:bg-blue-700 p-2 rounded-md flex items-center"
                            onClick={() => window.location.href = '/back/utilisateurs/ajoute'}
                        >
                            <i className="bi bi-plus-circle-fill mr-2"></i> Ajouter
                        </button>
                    </div>

                    <div className="mt-4">
                        {data.map(item => (
                            <div key={item.id} className="bg-white p-4 rounded-md shadow-md mb-4 flex">
                                <div className="flex flex-col justify-between ml-4 flex-grow">
                                    <div>
                                        
                                        <h3 className="font-bold text-lg">{item.nom} {item.prenom}</h3>
                                        <p className="text-gray-600">{item.email}</p>
                                        <p className="font-bold text-gray-800">Role: {item.role}</p>
                                    </div>
                                    {item.role === 'admin' ? (
                                        <div className="flex justify-end mt-2"></div>
                                    ) : (
                                        <div className="flex justify-end mt-2">
                                            <button
                                                onClick={() => handleDelete(item.id)} // Use ID for deletion
                                                className="bg-red-500 text-white hover:bg-red-700 p-2 rounded-md flex items-center"
                                            >
                                                <i className="bi bi-trash-fill mr-2"></i> Supprimer
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="sticky bottom-0 bg-gray-100 z-10 p-4 flex justify-center border-t border-gray-300 shadow-[0_-10px_10px_-10px_white]">
                        <p className="text-gray-700">Les utilisateurs</p>
                    </div>
                </div>

               
            </div>
        </div>
    );
};

export default Utilisateurs;
