import '../App.css';
import "tailwindcss";
import dimaNelisIcon from '../assets/cube_102.png';
import limeIcon from '../assets/cube_107.png';
import { useState } from 'react';



function SingInModal() {
    const [username, setUsername] = useState("");
    const [code, setCode] = useState("");
    const [status, setStatus] = useState<"idle" | "waiting" | "approved" | "rejected">("idle");

    async function handleLogin() {
        const params = new URLSearchParams();
        params.append("username", username);
        params.append("code", code);

        if (status == "waiting") {
            const res = await fetch("http://127.0.0.1:8000/verify-login", {
                method: "POST",
                body: params
            });

            return 0;
        }

        const res = await fetch("http://127.0.0.1:8000/login", {
            method: "POST",
            body: params
        });

        if (!res.ok) {
            setStatus("rejected");
            return;
        }

        setStatus("waiting");
    }


    return (
        <dialog id="signinModal" className="modal">
            <div className="modal-box">

                <form method="dialog">
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>

                <h3 className="mb-3 font-bold text-lg">Войти</h3>
                <p className="pb-3 mb-5 text-gray-300 text-center">Пожалуйста, впишите свои данные от аккаунта в Geometry Dash, чтобы войти.</p>


                <fieldset className="fieldset px-20 mb-2 gap-3.5">
                    {status === "rejected" && <p className='text-red-200'>Такого аккаунта не существует.</p>}
                    {status === "waiting" && <p className='text-yellow-200'>Мы отправили вам код в личные сообщения в игре.</p>}

                    <label
                        className={`input transition-all 
                                    ${status === "rejected" ? "input-error" : ""} 
                                    ${status === "waiting" ? "input-success" : ""}
                                    ${status === "approved" ? "input-success" : ""}`}
                    >

                        <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </g>
                        </svg>

                        <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
                    </label>

                    {status == "waiting" ? <input className='input' maxLength={6} type='text' placeholder='Код' onChange={(e) => setCode(e.target.value)} /> : ""}

                </fieldset>

                <button type='button' className="btn btn-neutral rounded- mt-4 hover:scale-110 transition-all" onClick={() => handleLogin()}>Войти</button>
            </div>
        </dialog>
    )
}



export default function Hero() {
    return (
        <div className="hero min-h-screen">
            <img src={dimaNelisIcon} className='icon-left'></img>
            <img src={limeIcon} className='icon-right'></img>

            <div className="hero-content text-center">
                <div>
                    <h1 className="mb-15 text-5xl md:text-8xl font-extrabold drop-shadow-[0_0_40px_#83BCFF] hover:scale-105 transition-all">100 игроков</h1>
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
