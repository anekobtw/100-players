import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import "tailwindcss";
import Home from "./pages/home";
import Admin from './pages/admin';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/admin" element={<Admin />} />
            </Routes>
        </Router>
    );
}

export default App;

