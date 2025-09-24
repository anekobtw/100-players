import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import "tailwindcss";
import Home from "./pages/home";
import Admin from './pages/admin';


function Footer() {
    return (
        <footer className="footer sm:footer-horizontal footer-center text-base-content p-4">
            <aside>
                <p>Copyright © {new Date().getFullYear()} - All right reserved by <a className="link link-info" href="https://github.com/anekobtw">anekobtw</a></p>
            </aside>
        </footer>
    )
}


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/admin" element={<Admin />} />
            </Routes>

            <Footer />
        </Router>

    );
}

export default App;

