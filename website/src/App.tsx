import './App.css';
import "tailwindcss";
import Hero from "./pages/hero";
import Navbar from "./pages/navbar";

function App() {
    return (
        <>
            <Navbar authorized={false} />
            <Hero />
        </>
    )
}

export default App
