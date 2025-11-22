export const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">MyDoc</h3>
            <p className="text-gray-400">
              Personal documentation and blog platform for developers.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="/" className="hover:text-white transition">
                  Home
                </a>
              </li>
              <li>
                <a href="/search" className="hover:text-white transition">
                  Search
                </a>
              </li>
              <li>
                <a href="/dashboard" className="hover:text-white transition">
                  Dashboard
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition">
                  GitHub
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} MyDoc - Ramuirta ❤️. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
