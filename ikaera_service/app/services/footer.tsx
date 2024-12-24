const Footer: React.FC = () => {
    return (
        <div id="contact">
            {/* Footer */}
            <footer className="bg-gray-800 text-white p-6 mt-8 rounded">
                <div className="text-center mb-4">
                    <h2 className="text-lg font-semibold">IKAERA Consulting</h2>
                    <p className="text-sm">Société de formation et de prestation de services</p>
                </div>
                
                <div className="flex justify-center space-x-4">
                    <a href="https://www.google.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
                        <i className="bi bi-google" style={{ fontSize: '24px' }}></i>
                    </a>
                    <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
                        <i className="bi bi-facebook" style={{ fontSize: '24px' }}></i>
                    </a>
                    <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
                        <i className="bi bi-github" style={{ fontSize: '24px' }}></i>
                    </a>
                    <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
                        <i className="bi bi-instagram" style={{ fontSize: '24px' }}></i>
                    </a>
                </div>

                <div className="text-center mt-4 text-sm">
                    © 2024 Tous droits réservés.
                </div>
            </footer>
        </div>
    );
};

export default Footer;
