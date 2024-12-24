'use client';
import React, { useEffect, useState } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Import Bootstrap icons
import Link from 'next/link';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement, // Required for Pie and Doughnut charts
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2'; // Import Bar and Doughnut charts from react-chartjs-2
import { Card, CardContent, Typography } from '@mui/material';
import Skeleton from 'react-loading-skeleton'; // Import Skeleton
import 'react-loading-skeleton/dist/skeleton.css'; // Optional: import CSS


// Register the necessary components for both Bar and Doughnut charts
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const Dashboard: React.FC = () => {
  const [formations, setFormations] = useState([]);
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [inscriptions, setInscriptions] = useState([]);
  const [stars, setStars] = useState([]);
  const [loading, setLoading] = useState(true); // State to handle loading
  const api = 'http://localhost:5000';

  // Fetch data from the API on localhost:5000
  useEffect(() => {
    // Fetch formations
    fetch(`${api}/api/formations`)
      .then((res) => res.json())
      .then(setFormations)
      .catch((err) => console.error('Error fetching formations:', err));

    // Fetch users
    fetch(`${api}/api/utilisateurs`)
      .then((res) => res.json())
      .then(setUsers)
      .catch((err) => console.error('Error fetching users:', err));

    // Fetch comments
    fetch(`${api}/api/comments`)
      .then((res) => res.json())
      .then(setComments)
      .catch((err) => console.error('Error fetching comments:', err));

    // Fetch inscriptions
    fetch(`${api}/api/inscription`)
      .then((res) => res.json())
      .then(setInscriptions)
      .catch((err) => console.error('Error fetching inscriptions:', err));

    // Fetch stars (ratings)
    fetch(`${api}/api/stars`)
      .then((res) => res.json())
      .then(setStars)
      .catch((err) => console.error('Error fetching stars:', err));

    setLoading(false)
  }, []);

  // Bar Chart and Doughnut Chart data
  const barChartData = {
    labels: ['Formations', 'Utilisateurs', 'Inscriptions', 'Commentaires', 'Étoiles'],
    datasets: [
      {
        label: 'Données',
        backgroundColor: '#2B6CB0',
        borderColor: '#2B6CB0',
        barThickness: 30,
        borderRadius: 5,
        hoverBackgroundColor: '##FFA500',
        data: [formations.length, users.length, inscriptions.length, comments.length, stars.length],
      },
    ],
  };

  const doughnutChartData = {
    labels: ['Formations', 'Utilisateurs', 'Inscriptions', 'Etoiles'],
    datasets: [
      {
        label: 'Répartition',
        backgroundColor: ['#4C51BF', '#68D391', '#F6AD55', '#fef08a'],
        data: [formations.length, users.length, inscriptions.length, stars.length],
        borderWidth: 0,
        cutout: '60%'
      },
    ],
  };



  return (
    <div className=" pt-10 p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Tableau de bord</h1>


      <div className="flex justify-center gap-4 flex-nowrap ">

        <Card className="bg-blue-300 w-1/4 p-4 shadow-[2px_2px_10px_rgba(0,0,0,0.5)]">
          {loading ? (
            <div className='pl-4 '>
              <Skeleton height={20} width={100} />
              <Skeleton height={20} width={100} />
              <Skeleton height={30} width={50} />
            </div>
          ) : (
            <Link href={'admin/utilisateurs'}>
              <Typography variant="h5" component="h2">
                Utilisateurs
              </Typography>
              <Typography variant="body2">
                {users.length} {users.length === 1 ? 'Utilisateur enregistré' : 'Utilisateurs enregistrés'}
              </Typography>
              <i className="bi bi-people-fill text-4xl text-blue-500"></i>
            </Link>
          )}
        </Card>
        <Card className="bg-green-200 w-1/4 shadow-[2px_2px_10px_rgba(0,0,0,0.5)] p-4">
          {loading ? (
            <div className='pl-4'>
              <Skeleton height={20} width={100} />
              <Skeleton height={20} width={100} />
              <Skeleton height={30} width={50} />
            </div>
          ) : (
            <Link href={'admin/formations'}>
              <Typography variant="h5" component="h2">
                Formations
              </Typography>
              <Typography variant="body2">
                {formations.length} {formations.length <= 1 ? 'Formation disponible' : 'Formations disponibles'}
              </Typography>
              <i className="bi bi-book text-4xl text-green-500"></i>
            </Link>
          )}
        </Card>

        <Card className="bg-orange-200 w-1/4 shadow-[2px_2px_10px_rgba(0,0,0,0.5)] p-4">
          {loading ? (
            <div className='pl-4 '>
              <Skeleton height={20} width={100} />
              <Skeleton height={20} width={100} />
              <Skeleton height={30} width={50} />
            </div>
          ) : (

            <Link href={'admin/inscriptions'}>
              <Typography variant="h5" component="h2">
                Inscriptions
              </Typography>
              <Typography variant="body2">
                {inscriptions.length} {inscriptions.length <= 1 ? 'Inscription effectuée' : 'Inscriptions effectuées'}
              </Typography>
              <i className="bi bi-journal-bookmark text-4xl text-orange-500"></i>
            </Link>
          )}
        </Card>



        <Card className="bg-yellow-200 w-1/4 shadow-[2px_2px_10px_rgba(0,0,0,0.5)] p-4" > {/* Ajout de shadow-lg */}
          {loading ? (
            <div className='pl-4 '>
              <Skeleton height={20} width={100} />
              <Skeleton height={20} width={100} />
              <Skeleton height={30} width={50} />
            </div>
          ) : (
            <Link href={'admin/commentaires'}>
              <Typography variant="h5" component="h2">
                Évaluations
              </Typography>
              <Typography variant="body2">
                {stars.length} {stars.length <= 1 ? 'Etoile reçue' : 'Etoiles reçues'}  {' '}
                {comments.length} {comments.length <= 1 ? 'Commentaire reçue' : 'Commentaires reçues'}
              </Typography>

              <i className="bi bi-star-fill text-4xl text-yellow-500"> , </i>
              <i className="bi bi-chat-fill text-4xl text-yellow-600"></i>
            </Link>
          )}
        </Card>

      </div>

      {/* Charts Section */}
      <div className="mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white pb-20 p-6  shadow-[2px_2px_10px_rgba(0,0,0,0.5)] rounded-lg h-[400px]">
            <h3 className="text-xl font-semibold mb-4">Statistiques des données</h3>
            {loading && (
              <div className='pl-8 '>
                <Skeleton height={20} width={300} />
                <Skeleton height={30} width={400} />
              </div>
            )}
            <Bar data={barChartData} options={{ maintainAspectRatio: false }} />
          </div>

          <div className="bg-white pb-20 p-6  shadow-[2px_2px_10px_rgba(0,0,0,0.5)] rounded-lg h-[400px]">
            <h3 className="text-xl font-semibold mb-4">Répartition des données</h3>
            {loading && (
              <div className='pl-8 '>
                <Skeleton height={20} width={300} />
                <Skeleton height={30} width={400} />
              </div>
            )}
            <Doughnut data={doughnutChartData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
