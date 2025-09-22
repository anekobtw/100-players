import '../App.css';
import "tailwindcss";
import dimaNelisIcon from '../assets/cube_102.png';
import limeIcon from '../assets/cube_107.png';
import { useState, useEffect, useMemo } from 'react';


function CloseButton() {
    return (
        <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
    )
}


function SignInModal() {
    const [username, setUsername] = useState("");
    const [status, setStatus] = useState<"" | "loading" | "approved" | "rejected">("");
    const [error, setError] = useState("");

    async function handleLogin() {
        if (!username) {
            setStatus("rejected");
            setError("Пожалуйста, впишите свой никнейм из игры.")
            return
        }

        setStatus("loading");

        const data = new FormData();
        data.append("username", username);

        const res = await fetch("http://127.0.0.1:8000/login", {
            method: "POST",
            body: data
        });

        if (!res.ok) {
            setStatus("rejected");
            setError(data.detail || "Ошибка авторизации");
        } else {
            setStatus("approved");
        }

    }


    return (
        <dialog id="signin_modal" className="modal">
            <div className="modal-box">
                <CloseButton />


                <h3 className="mb-3 font-bold text-lg">Зарегестрироваться</h3>
                <p className="pb-3 mb-5 text-gray-300 text-center">Пожалуйста, впишите свои данные от аккаунта в Geometry Dash, чтобы зарегестрироваться.</p>


                <fieldset className="fieldset px-20 mb-2 gap-3.5">
                    {status === "rejected" && <p className='text-error'>{error}</p>}
                    {status === "approved" && <p className='text-success'>Вы успешно зарегестрировались на ивент!</p>}

                    <label className={`input transition-all ${status === "rejected" ? "input-error" : status === "approved" ? "input-success" : ""}`}>
                        <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </g>
                        </svg>

                        <input type="text" placeholder="Никнейм" onChange={(e) => setUsername(e.target.value)} />
                    </label>
                </fieldset>

                {status === "loading" ? (
                    <button type="button" disabled={true} className='btn rounded mt-4'>Регистрируем...</button>
                ) : <button type='button' className="btn btn-neutral rounded mt-4 hover:scale-110 transition-all" onClick={() => handleLogin()}>Зарегестрироваться</button>}
            </div>
        </dialog>
    )
}



function Event({ name, timestamp }: { name: string; timestamp: number }) {
    const targetDate = useMemo(() => new Date(timestamp), [timestamp]);
    const [counter, setCounter] = useState(Math.max(0, timestamp - Date.now()));
    const isTimerExpired = counter <= 0;

    useEffect(() => {
        const tick = () => {
            const diff = timestamp - Date.now();
            setCounter(Math.max(0, diff));
        };

        const timer = setInterval(tick, 1000);
        tick();

        return () => clearInterval(timer);
    }, [timestamp]);

    const { month, day, h, m, s } = useMemo(() => {
        const totalSeconds = Math.floor(counter / 1000);
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;

        return {
            month: targetDate.toLocaleString('ru-RU', { month: 'short' }),
            day: targetDate.getDate(),
            h: String(h).padStart(2, "0"),
            m: String(m).padStart(2, "0"),
            s: String(s).padStart(2, "0"),
        };
    }, [counter, targetDate]);


    return (
        <button disabled={!isTimerExpired} className='hover:scale-105 transition-all' onClick={() => document.getElementById("signin_modal").showModal()}>
            <div className="flex p-5">
                <div className='justify-items-center p-0.5 border-r border-white mr-3'>
                    <div className='uppercase font-thin text-xl mr-3'>{month}</div>
                    <div className='uppercase font-thin text-4xl mr-3'>{day}</div>
                </div>

                <div className='flex-grow flex flex-col items-center'>
                    <div className='text-4xl font-medium mb-2.5'>{name}</div>
                    {isTimerExpired ? (
                        <span className="text-gray-400">Регистрация открыта!</span>
                    ) : (
                        <>
                            <span className="text-gray-400">Регистрация откроется через:</span>
                            <span className="countdown font-mono text-2xl text-gray-400">
                                <span style={{ "--value": h } as React.CSSProperties}>{h}</span>:
                                <span style={{ "--value": m } as React.CSSProperties}>{m}</span>:
                                <span style={{ "--value": s } as React.CSSProperties}>{s}</span>
                            </span>
                        </>
                    )}
                </div>
            </div>
        </button>
    );
}



function EventsModal() {
    return (
        <span>
            <button className="btn btn-soft hover:scale-120 transition-all" onClick={() => document.getElementById("events_modal").showModal()}>Ивенты</button>
            <dialog id="events_modal" className="modal">
                <div className="modal-box">
                    <CloseButton />

                    <h3 className="font-bold text-lg">Ивенты</h3>

                    <ul className="list bg-base-100 rounded-box shadow-md">
                        <Event name='Прятки' timestamp={1758513896 * 1000} />
                    </ul>
                </div>
            </dialog>
        </span>
    )
}



export default function Home() {
    return (
        <div className="hero min-h-screen">
            <img src={dimaNelisIcon} className='icon-left'></img>
            <img src={limeIcon} className='icon-right'></img>

            <div className="hero-content text-center">
                <div>
                    <h1 className="mb-15 text-5xl md:text-8xl font-extrabold drop-shadow-[0_0_40px_#83BCFF] hover:scale-105 transition-all">100 игроков</h1>

                    <a href='https://t.me/+E5fATL5wRxY1Mjky'>
                        <button className="btn btn-outline mr-30 hover:scale-105 transition-all">
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="text-current size-5 opacity-90"><path d="M2.53419 10.491 20.4342 3.72755c.5979-.22564 1.2652.07521 1.4908.67307.0791.21021.0964.43779.0482.65668l-3.0857 14.0805c-.1562.7136-.8611 1.1658-1.5747 1.0086-.1774-.0385-.3442-.1138-.4918-.2198l-6.1453-4.4415c-.3694-.2671-.4533-.784-.1852-1.1543.0289-.0395.0617-.0771.0964-.1118l6.319-6.07213c.1311-.12632.135-.33557.0087-.46768-.109-.11282-.2826-.13404-.4156-.04918L7.88597 13.0975c-.5101.324-1.13978.3973-1.7116.1996l-3.618-1.2516c-.43103-.1485-.65957-.6201-.51107-1.0511.081-.2314.25939-.4166.48889-.5034Z"></path></svg>
                            Telegram канал
                        </button>
                    </a>

                    <EventsModal />
                    <SignInModal />
                </div>
            </div>
        </div>
    )
}
