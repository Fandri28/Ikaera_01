import React from 'react';
import Footer from '../services/footer';

const Login: React.FC = () => {
  return (
    <div className="px-5 md:px-10 max-w-7xl mx-auto" id="login">
      <h2 className="text-2xl font-bold mb-4 text-center">Remplir les formulaires</h2>

      <div className="flex justify-center">
        {/* Login Form */}
         
        <form className="w-1/3 p-9 m-2 bg-green-100 rounded shadow">
          <h3 className="text-blue-300 text-2xl font-semibold mb-4">Login</h3>

          <input
            placeholder="Nom"
            className="mb-2 w-full p-2 border border-gray-300 rounded"
          />

          <input
            placeholder="Email"
            className="mb-2 w-full p-2 border border-gray-300 rounded"
          />

          <input
            type="password"
            placeholder="Password"
            className="mb-2 w-full p-2 border border-gray-300 rounded"
          />

          <button
            type="submit"
            className="w-full p-2 text-white bg-blue-500 rounded hover:bg-green-600"
          >
            Login
          </button>

          {/* Forgot Password Link */}
          <div className="mt-4 text-center">
            <a href="#" className="text-sm text-blue-500 hover:underline">
              Mot de passe oublié ?
            </a>
          </div>

          {/* Log in with Google Button */}
          <button
            type="button"
            className="mt-4 w-full p-2 flex items-center justify-center text-gray-700 border border-gray-300 rounded hover:bg-gray-200"
          >
            Log in with Google
            <i className="bi bi-google ml-2"></i>
          </button>
        </form>

      </div>

      <div className="flex justify-center">
        {/* Sign Up Form */}
        <form className="w-1/3 p-9 m-2 bg-green-100 rounded shadow">
          <h3 className="text-blue-300 text-2xl  font-semibold mb-4">Sign up</h3>

          <input
            placeholder="Nom"
            className="mb-2 w-full p-2 border border-gray-300 rounded"
          />
          <input
            placeholder="Prénom"
            className="mb-2 w-full p-2 border border-gray-300 rounded"
          />
          <input
            placeholder="Email"
            className="mb-2 w-full p-2 border border-gray-300 rounded"
          />
          
          <input
            type="password"
            placeholder="Password"
            className="mb-2 w-full p-2 border border-gray-300 rounded"
          />
          <button
            type="submit"
            className="w-full p-2 text-white bg-blue-500 rounded hover:bg-green-600"
          >
            Sign up
          </button>

          {/* Sign up with Google Button */}
          <button
            type="button"
            className="mt-4 w-full p-2 flex items-center justify-center text-gray-700 border border-gray-300 rounded hover:bg-gray-200"
          >
            Sign up with Google
            <i className="bi bi-google ml-2 text-red-500"></i>
          </button>
        </form>
      </div>

      <div className="flex justify-center">
        {/* Update User Form */}
        <form className="w-1/3 p-9 m-2 bg-green-100 rounded shadow">
          <h3 className="text-blue-300 text-2xl  font-semibold mb-4">Update User</h3>

          <input
            placeholder="Nom"
            className="mb-2 w-full p-2 border border-gray-300 rounded"
          />
          <input
            placeholder="Prénom"
            className="mb-2 w-full p-2 border border-gray-300 rounded"
          />
          <input
            placeholder="Email"
            className="mb-2 w-full p-2 border border-gray-300 rounded"
          />
          <input
            placeholder="Session"
            className="mb-2 w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="password"
            placeholder="Password"
            className="mb-2 w-full p-2 border border-gray-300 rounded"
          />
          <button
            type="submit"
            className="w-full p-2 text-white bg-green-500 rounded hover:bg-green-600"
          >
            Update
          </button>
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default Login;
