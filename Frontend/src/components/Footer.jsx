// Footer component for site-wide use
<footer className="bg-gray-100 text-gray-700 px-8 md:px-20 py-12 mt-16">
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
    {/* Brand Info */}
    <div>
      <h2 className="text-2xl font-bold text-green-700 mb-2">Learn Loop</h2>
      <p className="text-sm">
        Peer Learning Platform<br />
        Connecting learners and tutors worldwide to create a more equitable education system through free peer-to-peer learning.
      </p>
    </div>

    {/* Platform Links */}
    <div>
      <h3 className="text-lg font-semibold mb-2">Platform</h3>
      <ul className="space-y-1 text-sm">
        <li><Link to="/explore" className="hover:text-green-700">Browse Sessions</Link></li>
        <li><Link to="/become-tutor" className="hover:text-green-700">Become a Tutor</Link></li>
        <li><Link to="/start-learning" className="hover:text-green-700">Start Learning</Link></li>
      </ul>
    </div>

    {/* Community Support */}
    <div>
      <h3 className="text-lg font-semibold mb-2">Community</h3>
      <ul className="space-y-1 text-sm">
        <li><Link to="/help" className="hover:text-green-700">Help Center</Link></li>
        <li><Link to="/safety" className="hover:text-green-700">Safety Guidelines</Link></li>
        <li><Link to="/terms" className="hover:text-green-700">Terms of Service</Link></li>
        <li><Link to="/privacy" className="hover:text-green-700">Privacy Policy</Link></li>
      </ul>
    </div>

    {/* Social / Connect */}
    <div>
      <h3 className="text-lg font-semibold mb-2">Connect</h3>
      <p className="text-sm mb-4">
        Follow us for updates and join our growing community of learners and educators.
      </p>
      {/* Replace # with actual links */}
      <div className="flex space-x-4">
        <a href="#" aria-label="Twitter" className="hover:text-blue-500">🐦</a>
        <a href="#" aria-label="Instagram" className="hover:text-pink-500">📸</a>
        <a href="#" aria-label="LinkedIn" className="hover:text-blue-700">💼</a>
      </div>
    </div>
  </div>

  {/* Footer Bottom */}
  <div className="mt-10 border-t pt-6 text-sm text-center text-gray-500">
    © 2024 Learn Loop. Made with ❤️ for education equality.<br />
    <span className="block mt-2 text-xs">Free • Open • Community-Driven</span>
  </div>
</footer>
