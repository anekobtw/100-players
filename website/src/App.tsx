import { useState } from 'react';
import './App.css'
import "tailwindcss";


function Hero() {
    const [isLoading, setLoading] = useState<boolean>(false)

    return (
        <div className="hero bg-base-200 min-h-screen">
            <div className="hero-content flex-col lg:flex-row-reverse gap-10">
                <div className="text-center lg:text-center">
                    <h1 className="text-5xl font-bold drop-shadow-[0_0_10px_#00BFFF]">100 игроков</h1>
                    <p className="py-6">
                        Просто введи свой никнейм в игре в поле слева и нажми кнопку, чтобы участвовать.
                    </p>
                </div>
                <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
                    <div className="card-body">
                        <fieldset className="fieldset">
                            <label className="label">Никнейм</label>
                            <input type="text" className="input" placeholder="Введите свой никнейм в игре" />

                            <button
                                className={`btn btn-soft btn-info mt-4 transition-all duration-300`}
                                onClick={() => setLoading(true)}
                                disabled={isLoading}
                            >
                                {isLoading ? "Загрузка" : "Учавствовать!"}
                            </button>
                        </fieldset>
                    </div>
                </div>
            </div>
        </div >
    )
}


function Footer() {
    return (
        <footer className="footer sm:footer-horizontal bg-base-200 text-base-content p-10">
            <aside>
                <p>© 2025 <span className='font-bold'>anekobtw</span>. All rights reserved.</p>
            </aside>
            <nav>
                <h6 className="footer-title">Нелис</h6>
                <a className="link link-hover">YouTube</a>
            </nav>
            <nav>
                <h6 className="footer-title">Лайм</h6>
                <a className="link link-hover">YouTube</a>
            </nav>
        </footer>
    )
}

function App() {
    return (
        <>
            <Hero />
            <Footer />
        </>
    )
}

export default App
