'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Import Bootstrap icons

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [linkik, setLink] = useState('');
  const [imageError, setImageError] = useState(false); // State for handling image loading errors

  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const urlapi = 'http://localhost:5000';

  useEffect(() => {
    setLink(`${urlapi}/api/image/ikaera`);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Reset error before attempting login

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Veuillez entrer une adresse email valide');
      return;
    }

    try {
      const response = await axios.get(`${urlapi}/api/utilisateurs/${email}`);
      const user = response.data;

      if (user.password === password) {
        localStorage.setItem('userRole', user.role);
        localStorage.setItem('userEmail', user.email);
        localStorage.setItem('userId', user.id);

        if (user.role === 'admin') {
          window.location.href = '/admin';
        } else {
          window.location.href = '/services';
        }
      } else {
        setError('Mot de passe incorrect');
      }
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        setError('Utilisateur non trouvé');
      } else {
        setError('Erreur serveur, veuillez réessayer plus tard');
      }
    }
  };

  return (
    <div className="relative px-5 md:px-10 max-w-7xl mx-auto pt-20" id="login">
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <div
          className="h-0 w-full border-b-[40px] border-blue-500 rotate-[10deg] absolute top-0"
          style={{ borderTopRightRadius: '50%' }}
        ></div>
        <div
          className="h-0 w-full border-b-[40px] border-blue-900 rotate-[10deg] absolute top-16"
          style={{ borderTopRightRadius: '50%' }}
        ></div>
      </div>

      <div className="flex justify-center items-center relative z-10 mt-10">
        <div className="w-full md:w-2/3 flex justify-between items-center p-5 bg-white rounded-lg shadow-lg">
          <div className="w-1/2 p-5">
            {linkik && !imageError ? (
              <div className="flex ml-6 mb-4">
                <img
                  src={linkik}
                  alt="IKAERA Logo"
                  width={150}
                  height={100}
                  onError={() => setImageError(true)} // Set error state on image load failure
                />
              </div>
            ) : (
              <div className="flex ml-6 mb-4 text-gray-500" style={{ width: '150px', height: '100px', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid #ccc' }}>
                Logo
              </div>
            )}
            <h3 className="text-blue-600 text-2xl font-bold mb-4">Bienvenue sur notre site</h3>
            <p className="text-black mb-6">Veuillez vous connecter pour accéder à votre compte.</p>
            <div className="flex space-x-4">
              <i className="bi bi-facebook text-blue-600" style={{ fontSize: '30px' }}></i>
              <i className="bi bi-twitter text-blue-600" style={{ fontSize: '30px' }}></i>
              <i className="bi bi-linkedin text-blue-600" style={{ fontSize: '30px' }}></i>
            </div>
          </div>

          <form onSubmit={handleLogin} className="w-1/2 p-9 m-2 border-b-2 flex justify-center flex-col border-gray-300 bg-white rounded-lg shadow-lg mb-6">
            <h3 className="text-blue-300 text-2xl font-semibold mb-4">Connexion</h3>

            <input
              type="email"
              placeholder="Email"
              className="mb-2 w-full p-2 pl-6 border-b-2 border-gray-300 rounded-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="relative mb-2">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Mot de passe"
                className="w-full p-2 pl-6 border-b-2 border-gray-300 rounded-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <i
                className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'} absolute right-3 top-3 cursor-pointer`}
                onClick={() => setShowPassword(!showPassword)}
              ></i>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button type="submit" className="w-full p-2 text-white bg-blue-500 border-b-2 border-gray-300 hover:bg-green-600 rounded-full">
              Connexion
            </button>
            <p className="text-blue-400 flex justify-end mt-2">Mot de passe oublié</p>
            <p
              className="text-blue-400 flex justify-end mt-2 cursor-pointer"
              onClick={() => window.location.href = '/signup'}
            >
              M'inscrire
            </p>
          </form>
        </div>
      </div>

      <h2 className="absolute top-4 right-10 text-4xl font-bold z-10">
        <span className="text-yellow-400">IKAERA</span> <span className="text-blue-600">Consulting</span>
      </h2>
    </div>
  );
};

export default Login;
