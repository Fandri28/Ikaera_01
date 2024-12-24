'use client'
import 'bootstrap-icons/font/bootstrap-icons.css'; // Assurez-vous d'importer les icônes Bootstrap
import React, { useState, useEffect } from 'react';
import Link from 'next/link'; // Importer Link de Next.js
import { usePathname } from 'next/navigation'; // Importer usePathname
import { IconButton } from '@mui/material'; // Importer IconButton de MUI
import MenuIcon from '@mui/icons-material/Menu'; // Correct import for Menu icon
import zIndex from '@mui/material/styles/zIndex';
import { UserButton, } from '@clerk/nextjs';

// Interface pour un élément de navigation
interface NavItem {
  name: string;
  href: string;
  icon: string;
  key: string;
}

const BackLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname(); // Obtenir le chemin actuel

  // État pour stocker dynamiquement les éléments de navigation
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true); // État pour gérer l'ouverture/fermeture de la sidebar

  // Simulation de récupération des éléments de navigation
  useEffect(() => {
    const fetchNavItems = async () => {
      const fetchedItems: NavItem[] = [
        { name: 'Dashboard', href: '/admin', icon: 'bi-columns', key: 'home' },
        { name: 'Utilisateurs', href: '/admin/utilisateurs', icon: 'bi-person', key: 'users' },
        { name: 'Formations', href: '/admin/formations', icon: 'bi-book', key: 'trainings' },
        { name: 'Commentaires', href: '/admin/commentaires', icon: 'bi-chat', key: 'comments' },
        { name: 'Inscription', href: '/admin/inscriptions', icon: 'bi-pencil', key: 'inscriptions' }
      ];
      setNavItems(fetchedItems); // Mettre à jour les éléments de navigation
    };

    fetchNavItems();
  }, []);

  // Fonction pour vérifier si un lien est actif
  const isActive = (href: string): boolean => {
    return pathname === href; // Utiliser pathname pour vérifier l'URL active
  };

  // Fonction pour basculer la visibilité de la sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex" style={{ zIndex: 30 }} id="admin">
      {/* Barre de navigation à gauche */}
      <nav
        className={`fixed bg-white border-r h-screen mt-8 shadow-lg transition-all duration-300 ease-in-out 
    ${sidebarOpen ? 'w-[50px] p-4' : 'w-[180px] p-4'}`} // Largeur et padding dynamiques selon l'état
      >
        <ul className="flex flex-col items-start space-y-4">
          {navItems.map((item) => (
            <li key={item.key}>
              <Link href={item.href} legacyBehavior>
                <a
                  className={`flex items-center text-gray-700 hover:text-blue-500 transition-colors duration-200 
              ${isActive(item.href) ? 'text-blue-500 font-semibold' : ''}`}
                >
                  {/* Icône */}
                  <i className={`bi ${item.icon} transition-all duration-300 text-lg`}></i>
                  {/* Texte du lien, visible uniquement lorsque la sidebar est ouverte */}
                  <span
                    className={`ml-4 transition-opacity duration-300 
                ${!sidebarOpen ? 'opacity-100' : 'opacity-0 invisible'}`}
                  >
                    {item.name}
                  </span>
                </a>
              </Link>
            </li>
          ))}
          <li className='flex items-center'>
            <UserButton />

          </li>
        </ul>
        <div
          className={`flex items-center text-gray-700 hover:text-blue-500 transition-colors duration-200 `}
        >

        </div>
      </nav>

      {/* Contenu principal à droite */}
      <div
        className={`flex-1 pt-0 text-black transition-all duration-300 ease-in-out 
    ${sidebarOpen ? 'ml-[70px]' : 'ml-[200px]'}`} // Ajustement de la marge à gauche
      >
        {/* IconButton pour ouvrir/fermer la sidebar */}
        <IconButton
          onClick={toggleSidebar}
          style={{
            position: 'fixed',
            top: '70px',
            left: '9px',
            zIndex: 4,
            backgroundColor: '#fff',
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
            padding: '5px'
          }}
        >
          <MenuIcon />
        </IconButton>

        {/* Affichage du contenu principal */}
        {children}
      </div>
    </div>

  );
};

export default BackLayout;
