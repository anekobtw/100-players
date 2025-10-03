import { useEffect, useState, useSyncExternalStore } from 'react';
import '../App.css';
import "tailwindcss";



// This will probably be deleted
function LimitModal() {
    return (
        <dialog id="limit_modal" className="modal">
            <div className="modal-box grid justify-items-center gap-5">
                <form method="dialog">
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>

                <h3 className="font-bold text-lg text-center">Установить новый лимит</h3>
                <fieldset className="fieldset px-20 mb-2 gap-3.5">
                    <label className='input transition-all'>
                        <svg className='h-[2em] opacity-50' viewBox="-2.4 -2.4 28.80 28.80" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#686868" stroke-width="0.00024000000000000003" transform="matrix(1, 0, 0, 1, 0, 0)rotate(0)"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.096"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M16 6C14.3432 6 13 7.34315 13 9C13 10.6569 14.3432 12 16 12C17.6569 12 19 10.6569 19 9C19 7.34315 17.6569 6 16 6ZM11 9C11 6.23858 13.2386 4 16 4C18.7614 4 21 6.23858 21 9C21 10.3193 20.489 11.5193 19.6542 12.4128C21.4951 13.0124 22.9176 14.1993 23.8264 15.5329C24.1374 15.9893 24.0195 16.6114 23.5631 16.9224C23.1068 17.2334 22.4846 17.1155 22.1736 16.6591C21.1979 15.2273 19.4178 14 17 14C13.166 14 11 17.0742 11 19C11 19.5523 10.5523 20 10 20C9.44773 20 9.00001 19.5523 9.00001 19C9.00001 18.308 9.15848 17.57 9.46082 16.8425C9.38379 16.7931 9.3123 16.7323 9.24889 16.6602C8.42804 15.7262 7.15417 15 5.50001 15C3.84585 15 2.57199 15.7262 1.75114 16.6602C1.38655 17.075 0.754692 17.1157 0.339855 16.7511C-0.0749807 16.3865 -0.115709 15.7547 0.248886 15.3398C0.809035 14.7025 1.51784 14.1364 2.35725 13.7207C1.51989 12.9035 1.00001 11.7625 1.00001 10.5C1.00001 8.01472 3.01473 6 5.50001 6C7.98529 6 10 8.01472 10 10.5C10 11.7625 9.48013 12.9035 8.64278 13.7207C9.36518 14.0785 9.99085 14.5476 10.5083 15.0777C11.152 14.2659 11.9886 13.5382 12.9922 12.9945C11.7822 12.0819 11 10.6323 11 9ZM3.00001 10.5C3.00001 9.11929 4.1193 8 5.50001 8C6.88072 8 8.00001 9.11929 8.00001 10.5C8.00001 11.8807 6.88072 13 5.50001 13C4.1193 13 3.00001 11.8807 3.00001 10.5Z" fill="#a0a0a0"></path> </g></svg>

                        <input type="text" placeholder="Новый лимит" />
                    </label>
                </fieldset>
                <button type="button" className='btn rounded'>Установить</button>
            </div>
        </dialog>

    )
}



export default function Admin() {
    const [currentUsers, setCurrentUsers] = useState(0);
    const [isApiWorking, setIsApiWorking] = useState(true);
    const [isGlobedWorking, setIsGlobedWorking] = useState(false);
    const [globedURL, setGlobedURL] = useState("");
    const [apiURL, setApiURL] = useState("");
    const [isCopied, setIsCopied] = useState(false);
    const [database, setDatabase] = useState(null);


    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const res = await fetch("http://127.0.0.1:8000/info");
                const data = await res.json();
                setIsApiWorking(true)
                setCurrentUsers(data["currentUsers"])
                setIsGlobedWorking(data["isGlobedWorking"]);
                setGlobedURL(data["globedURL"]);
                setApiURL(data["apiURL"]);
            } catch (err) {
                setIsGlobedWorking(false);
                setIsApiWorking(false);
            }

            try {
                const res = await fetch("http://127.0.0.1:8000/database");
                const data = await res.json();
                setDatabase(data.length ? data : null);
            } catch (err) {
                setDatabase(null);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, []);


    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error("Ошибка копирования: ", err);
        }
    };


    function copyableText(text: string) {
        return (
            <span className='hover:bg-neutral-900 px-2 py-0.5 cursor-pointer rounded-3xl transition-all' onClick={() => copyToClipboard(text)}>{text}</span>
        )
    }


    return (
        <div className='flex items-start'>

            {/* Copy toast */}
            {isCopied && (
                <div className="toast">
                    <div className="alert alert-info">
                        <span>Скопировано!</span>
                    </div>
                </div>
            )}


            {/* Info */}
            <div className='text-xl m-5 bg-base-100 rounded-3xl p-4'>
                <div className='inline-grid align-middle *:[grid-area:1/1]'>
                    <div className={`status status-${isGlobedWorking ? "success" : "error"} animate-ping`}></div>
                    <div className={`status status-${isGlobedWorking ? "success" : "error"}`}></div>
                </div> GLOBED URL: {copyableText(globedURL)}

                <br />

                <div className='inline-grid align-middle *:[grid-area:1/1]'>
                    <div className={`status status-${isApiWorking ? "success" : "error"} animate-ping`}></div>
                    <div className={`status status-${isApiWorking ? "success" : "error"}`}></div>
                </div> API URL: {copyableText(apiURL)}
            </div>


            {/* Database */}
            <div className="overflow-auto rounded-box border border-base-content/5 bg-base-100 p-1 m-5">
                {database ? (
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Аккаунт айди</th>
                                <th>Никнейм</th>
                                <th>Вайтлист</th>
                                <th>Забанен</th>
                            </tr>
                        </thead>
                        <tbody>
                            {database.map((item) => (
                                <tr key={item.account_id}>
                                    <th>{item.account_id}</th>
                                    <td>{item.username}</td>
                                    <td>{item.is_whitelisted ? "Да" : "Нет"}</td>
                                    <td>{item.active_room_ban ? "Да" : "Нет"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="p-4 text-center text-gray-500">Данных нет :(</div>
                )}
            </div>
        </div>
    )
}
