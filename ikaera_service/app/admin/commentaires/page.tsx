"use client"; // Ensure client-side rendering
import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Import axios

const Formations: React.FC = () => {
    const [data, setData] = useState<any[]>([]); // Initialize with an empty array
    const [loading, setLoading] = useState(true); // State to handle loading
    const [searchTerm, setSearchTerm] = useState(''); // State to handle search input
    const [userId, setUserId] = useState<string | null>(null); // State for user ID
    const urlapi = "http://localhost:5000";

    // Fetch userId from localStorage only on the client
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setUserId(localStorage.getItem('userId'));
        }
    }, []);

    // Fetch data from backend
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${urlapi}/api/comments`);
                setData(response.data); // Set fetched data to state
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false); // Stop loading regardless of success or failure
            }
        };

        fetchData();
    }, []);

    // Function to delete a comment
    const handleDelete = async (idproduit: number, idcomment: number) => {
        try {
            const del = `${urlapi}/api/comments/${idcomment}/${userId}`;
            await axios.delete(del); // Adjusted API endpoint
            setData(data.filter(item => item.idcomment !== idcomment)); // Remove item from state based on ID
        } catch (error) {
            console.error('Error deleting data:', error);
        }
    };

    // Function to update action status
    const handleActionUpdate = async (idcomment: number, action: string) => {
        try {
            await axios.patch(`${urlapi}/api/comments/${idcomment}/action`, { Action: action }); // Use patch API for action update
            setData(data.map(item => item.idcomment === idcomment ? { ...item, action } : item)); // Update state
        } catch (error) {
            console.error('Error updating action status:', error);
        }
    };

    // Filter data based on search term
    const filteredData = data.filter(item =>
        item.commentaire.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.idcomment.toString().includes(searchTerm) ||
        new Date(item.date).toLocaleDateString('fr-FR').includes(searchTerm)
    );

    // Loader while fetching data
    if (loading) {
        return <div className="text-center">Loading...</div>; // Simple loading message
    }

    return (
        <div className="container mx-auto p-4 mt-8 text-black">
            <div className="flex flex-row justify-center">
                <div className="shadow-[2px_2px_10px_rgba(0,0,0,0.5)] h-[630px] max-h-[630px] overflow-y-auto bg-gray-100 pt-0 pb-0 p-4 space-y-4 rounded-md ">
                    <div className="sticky top-0 bg-gray-100 z-10 p-4 flex justify-between items-center border-b border-gray-300 ">
                        <h2 className="text-2xl font-semibold">Liste des Commentaires</h2>

                        {/* Input Search Field */}
                        <div className="text-blue-500 flex items-center space-x-2">
                            <input
                                type="text"
                                placeholder="Rechercher par id, commentaire, ou date"
                                className="border p-2 rounded-md w-96" // Increased width with w-96
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)} // Set search term
                            />
                            <i className="bi bi-search text-gray-500"></i> {/* Moved outside the input */}
                        </div>

                    </div>

                    <div className="mt-4">
                        {filteredData.length > 0 ? (
                            filteredData.map(item => (
                                <div key={item.idcomment} className="bg-white p-4 rounded-md shadow-md mb-4 flex">
                                    <div className="flex flex-col justify-between flex-grow">
                                        <div>
                                            <h3 className="font-bold text-lg">{item.commentaire}</h3>
                                            <p className="text-gray-600">
                                                <span className="font-bold">Note:</span> {item.rate}
                                            </p>
                                            <p className="font-bold text-gray-800">Utilisateur ID: {item.iduser}</p>
                                            <p className="text-gray-600">
                                                <span className="font-bold">Date:</span> {new Date(item.date).toLocaleDateString('fr-FR')}
                                            </p>
                                            <div className="mt-2">
                                                <label className="font-bold">Action:</label>
                                                <select
                                                    value={item.action}
                                                    onChange={async (e) => {
                                                        const action = e.target.value;
                                                        await handleActionUpdate(item.idcomment, action); // Call function to update action in the database
                                                    }}
                                                    className="ml-2 p-1 border border-gray-300 rounded-md"
                                                >
                                                    <option value="visible">Visible</option>
                                                    <option value="hidden">Caché</option>
                                                </select>
                                                <p className="mt-2 text-gray-600">
                                                    Action choisie: <span className="font-bold">{item.action}</span>
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex justify-end mt-2">
                                            <button
                                                className="bg-yellow-500 text-white hover:bg-yellow-700 p-2 rounded-md flex items-center mr-2"
                                                onClick={() => window.location.href = `/back/comments/modifier/${item.idcomment}`}
                                            >
                                                <i className="bi bi-pencil-fill mr-2"></i> Modifier
                                            </button>

                                            <button
                                                onClick={() => handleDelete(item.idproduit, item.idcomment)} // Use correct IDs for deletion
                                                className="bg-red-500 text-white hover:bg-red-700 p-2 rounded-md flex items-center"
                                            >
                                                <i className="bi bi-trash-fill mr-2"></i> Supprimer
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500">Aucun commentaire trouvé.</p>
                        )}
                    </div>

                    <div className="sticky bottom-0 bg-gray-100 z-10 p-4 flex justify-center border-t border-gray-300 shadow-[0_-10px_10px_-10px_white]">
                        <p className="text-gray-700">Les commentaires </p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Formations;
