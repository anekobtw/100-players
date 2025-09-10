import { useState } from 'react';
import './App.css';
import "tailwindcss";
import dimaNelisIcon from './assets/cube_102.png';
import limeIcon from './assets/cube_107.png';




function SingInModal() {
    return (
        <dialog id="signinModal" className="modal">
            <div className="modal-box">

                <form method="dialog">
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>

                <h3 className="mb-7 font-bold text-lg">Войти</h3>

                <div className="">
                    <div className="tabs tabs-border">
                        <input type="radio" name="singin_tabs" className="tab grid gap-2.5 justify-items-center" aria-label="Вход по паролю" defaultChecked />
                        <div className='tab-content border-base-300 bg-base-100 p-3 m-4'>
                            <p className="pb-3 text-center">Пожалуйста, впишите свои данны от аккаунта в Geometry Dash, чтобы войти.</p>

                            <fieldset className="fieldset px-20">
                                <label className="label">Никнейм</label>
                                <input type="text" className="input" placeholder="Введите свой никнейм" />
                            </fieldset>
                            <fieldset className="fieldset px-20">
                                <label className="label">Пароль</label>
                                <input type="password" className="input" placeholder="Введите свой пароль" />
                                <p className="label">Мы не сохраняем ваши данные!</p>
                            </fieldset>

                            <button className="btn btn-neutral mt-4">Войти</button>
                        </div>

                        <input type="radio" name="singin_tabs" className="tab" aria-label="Вход по верификации" />
                        <div className="tab-content border-base-300 bg-base-100 p-10">Tab content 2</div>
                    </div>
                </div>
            </div>
        </dialog>
    )
}



function Hero() {
    return (
        <div className="hero min-h-screen">
            <img src={dimaNelisIcon} className='icon-left'></img>
            <img src={limeIcon} className='icon-right'></img>

            <div className="hero-content text-center">
                <div>
                    <h1 className="mb-15 text-5xl md:text-8xl font-extrabold drop-shadow-[0_0_25px_#00BFFF] hover:scale-105 transition-all">100 игроков</h1>
                    <button className="btn btn-outline mr-30 hover:scale-105 transition-all">
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="text-current size-5 opacity-90 size-5 opacity-90"><path d="M2.53419 10.491 20.4342 3.72755c.5979-.22564 1.2652.07521 1.4908.67307.0791.21021.0964.43779.0482.65668l-3.0857 14.0805c-.1562.7136-.8611 1.1658-1.5747 1.0086-.1774-.0385-.3442-.1138-.4918-.2198l-6.1453-4.4415c-.3694-.2671-.4533-.784-.1852-1.1543.0289-.0395.0617-.0771.0964-.1118l6.319-6.07213c.1311-.12632.135-.33557.0087-.46768-.109-.11282-.2826-.13404-.4156-.04918L7.88597 13.0975c-.5101.324-1.13978.3973-1.7116.1996l-3.618-1.2516c-.43103-.1485-.65957-.6201-.51107-1.0511.081-.2314.25939-.4166.48889-.5034Z"></path></svg>
                        Telegram канал
                    </button>

                    <button className="btn btn-soft hover:scale-120 transition-all" onClick={() => document.getElementById("signinModal").showModal()}>Начать</button>
                    <SingInModal />
                </div>
            </div>
        </div>
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
        </>
    )
}

export default App
