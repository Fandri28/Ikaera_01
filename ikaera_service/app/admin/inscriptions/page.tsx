'use client'
import React, { useEffect, useState } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Card, CardContent, Typography, Grid, TextField, Button, Box, List, ListItem, ListItemText, Divider, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Initialize ChartJS
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Interfaces for the data
interface Formation {
  id: number;
  titre: string;
  description: string;
  frais: number;
  lieu: string;
  date_ajout: string;
  image: string;
}

interface Inscription {
  nom_complet: string;
  idinscription: number;
  idformation: number;
  total: number;
  email: string;
  date_inscription: string;
  montantpayer: number;
  status: string;
}

interface User {
  id: number;
  nom: string;
  prenom: string;
}

const Dashboard = () => {
  // States for storing data
  const [formations, setFormations] = useState<Formation[]>([]);
  const [inscriptions, setInscriptions] = useState<Inscription[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchFilter, setSearchFilter] = useState<string>('name'); // Added search filter state

  useEffect(() => {
    // Fetch data from API
    fetch('http://localhost:5000/api/formations')
      .then((res) => res.json())
      .then(setFormations)
      .catch((err) => console.error('Error fetching formations:', err));

    fetch('http://localhost:5000/api/utilisateurs')
      .then((res) => res.json())
      .then(setUsers)
      .catch((err) => console.error('Error fetching users:', err));

    fetch('http://localhost:5000/api/inscription')
      .then((res) => res.json())
      .then(setInscriptions)
      .catch((err) => console.error('Error fetching inscriptions:', err));
  }, []);

  // Filter inscriptions based on the selected date range
  const filteredInscriptions = inscriptions.filter((inscription) => {
    const inscriptionDate = new Date(inscription.date_inscription);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    return (
      (!start || inscriptionDate >= start) && (!end || inscriptionDate <= end)
    );
  });

  // Function to generate the chart data
  const generateChartData = (idformation: number) => {
    const formationInscriptions = filteredInscriptions.filter(
      (inscription) => inscription.idformation === idformation
    );

    const data = formationInscriptions.reduce(
      (acc: { labels: string[]; data: number[] }, inscription) => {
        const lastName = inscription.nom_complet.split(' ').slice(-1).join(' '); // Get only the last name
        acc.labels.push(lastName); // Add last name to labels
        acc.data.push(inscription.montantpayer);
        return acc;
      },
      { labels: [], data: [] } // Initialize with an empty array for labels and data
    );

    return {
      labels: data.labels,
      datasets: [
        {
          label: 'Montant Payé',
          data: data.data,
          backgroundColor: '#42A5F5',
        },
      ],
    };
  };

  // Function to handle search term changes based on selected filter
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    if (searchFilter === 'name') {
      setSearchTerm(value);
    } else if (searchFilter === 'email') {
      setSearchTerm(value);
    }
  };

  return (
    <Box className="flex justify-center items-center min-h-screen">
  <Grid container spacing={3} className="max-w-7xl p-4">
    {/* Date Range Filters */}
    <Grid item xs={12} sm={12} md={12}>
      <div className="bg-white justify-center items-center mt-4 rounded-lg shadow-md">
        <div className="flex flex-wrap justify-center items-center p-5 space-x-6">
          {/* Start Date */}
          <div className="flex-1 min-w-[200px]">
            <TextField
              label="Start Date"
              type="date"
              fullWidth
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              className="border rounded-md p-2"
            />
          </div>

          {/* End Date */}
          <div className="flex-1 min-w-[200px]">
            <TextField
              label="End Date"
              type="date"
              fullWidth
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              className="border rounded-md p-2"
            />
          </div>

          {/* Apply Filters Button */}
          <div className="flex-1 mt-3 min-w-[200px]">
            <Button variant="contained" color="primary" fullWidth className="p-2 rounded-md">
              Apply Filters
            </Button>
          </div>

          {/* Search and Filter options */}
          <div className="flex-1 min-w-[200px]">
            <FormControl fullWidth className="border rounded-md p-2">
              <InputLabel>Search By</InputLabel>
              <Select
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                label="Search By"
                className="border rounded-md p-2"
              >
                <MenuItem value="name">Name</MenuItem>
                <MenuItem value="email">Email</MenuItem>
              </Select>
            </FormControl>
          </div>

          {/* Search Input */}
          <div className="flex-1 min-w-[200px]">
            <TextField
              label="Search"
              variant="outlined"
              fullWidth
              value={searchTerm}
              onChange={handleSearch}
              className="border rounded-md p-2"
            />
          </div>
        </div>
      </div>
    </Grid>

    {/* Display each formation with chart and inscriptions */}
    {formations.map((formation) => (
      <Grid item xs={12} sm={6} md={12} key={formation.id}>
        <Card className="flex flex-row">
          {/* Left Side: List of Inscriptions */}
          <Box className="w-1/3 p-4" style={{ maxHeight: '400px', overflowY: 'auto' }}>
            <Typography variant="h6" gutterBottom>
              Inscriptions for {formation.titre}
            </Typography>
            <List>
              {filteredInscriptions
                .filter((inscription) => inscription.idformation === formation.id)
                .filter((inscription) =>
                  searchFilter === 'name'
                    ? inscription.nom_complet.toLowerCase().includes(searchTerm)
                    : searchFilter === 'email'
                      ? inscription.email.toLowerCase().includes(searchTerm)
                      : false
                )
                .map((inscription) => (
                  <ListItem key={inscription.idinscription}>
                    <ListItemText
                      primary={inscription.nom_complet}
                      secondary={`Nom complet: ${inscription.nom_complet} | Email: ${inscription.email} | Total: ${inscription.total} Ar | Date: ${new Date(inscription.date_inscription).toLocaleDateString('fr-FR')} | Paid: ${inscription.montantpayer}`}
                    />
                    <Divider />
                  </ListItem>
                ))}
            </List>
          </Box>

          {/* Right Side: Chart */}
          <Box className="w-2/3 p-4">
            <Typography variant="h6" gutterBottom>
              Chart for {formation.titre}
            </Typography>

            <Bar data={generateChartData(formation.id)} options={{ responsive: true }} />
          </Box>
        </Card>
      </Grid>
    ))}
  </Grid>
</Box>

  );
};

export default Dashboard;
