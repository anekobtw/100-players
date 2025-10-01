import '../App.css';
import "tailwindcss";
import EventsModal from './events';
import dimaNelisIcon from '../assets/cube_102.png';
import limeIcon from '../assets/cube_107.png';
import { useEffect, useRef } from 'react';



export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const sections = Array.from(container.querySelectorAll(":scope > section"));
    let current = 0;
    let scrolling = false;

    function scrollToSection(index: number) {
      scrolling = true;
      sections[index].scrollIntoView({ behavior: "smooth" });
      setTimeout(() => (scrolling = false), 400);
    }

    function onWheel(e: WheelEvent) {
      e.preventDefault();
      if (scrolling) return;
      if (e.deltaY > 0 && current < sections.length - 1) current++;
      if (e.deltaY < 0 && current > 0) current--;
      scrollToSection(current);
    }

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, []);



  return (
    <div ref={containerRef} className="h-screen overflow-hidden">

      {/* Landing Section */}
      <section className="hero relative h-screen w-screen bg-linear-to-b from-blue-600/15 via-transparent flex flex-col">
        {/* Icons */}
        <img src={dimaNelisIcon} className="icon-left" />
        <img src={limeIcon} className="icon-right" />

        <h1 className="mt-75 mb-25 text-5xl md:text-8xl font-extrabold drop-shadow-[0_0_40px_#83BCFF] hover:scale-105 transition-all">
          100 игроков
        </h1>

        <div className="flex gap-20 mb-8">
          <a href="https://www.youtube.com/@Нелис" target="_blank" rel="noopener noreferrer">
            <button className="youtube-button btn btn-error btn-outline hover:scale-105 transition-all">
              <svg fill="currentColor" width={19} height={19} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.932 20.459v-8.917l7.839 4.459zM30.368 8.735c-0.354-1.301-1.354-2.307-2.625-2.663l-0.027-0.006c-3.193-0.406-6.886-0.638-10.634-0.638-0.381 0-0.761 0.002-1.14 0.007l0.058-0.001c-0.322-0.004-0.701-0.007-1.082-0.007-3.748 0-7.443 0.232-11.070 0.681l0.434-0.044c-1.297 0.363-2.297 1.368-2.644 2.643l-0.006 0.026c-0.4 2.109-0.628 4.536-0.628 7.016 0 0.088 0 0.176 0.001 0.263l0-0.014c0 0.074-0.001 0.162-0.001 0.25 0 2.48 0.229 4.906 0.666 7.259l-0.038-0.244c0.354 1.301 1.354 2.307 2.625 2.663l0.027 0.006c3.193 0.406 6.886 0.638 10.634 0.638 0.38 0 0.76-0.002 1.14-0.007l-0.058 0.001c0.322 0.004 0.702 0.007 1.082 0.007 3.749 0 7.443-0.232 11.070-0.681l-0.434 0.044c1.298-0.362 2.298-1.368 2.646-2.643l0.006-0.026c0.399-2.109 0.627-4.536 0.627-7.015 0-0.088-0-0.176-0.001-0.263l0 0.013c0-0.074 0.001-0.162 0.001-0.25 0-2.48-0.229-4.906-0.666-7.259l0.038 0.244z"></path>
              </svg>
              Ютуб Канал Нелиса
            </button>
          </a>

          <a href="https://t.me/+E5fATL5wRxY1Mjky" target="_blank" rel="noopener noreferrer">
            <button className="telegram-button btn btn-info btn-outline hover:scale-105 transition-all">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="text-current size-5 opacity-90">
                <path d="M2.53419 10.491 20.4342 3.72755c.5979-.22564 1.2652.07521 1.4908.67307.0791.21021.0964.43779.0482.65668l-3.0857 14.0805c-.1562.7136-.8611 1.1658-1.5747 1.0086-.1774-.0385-.3442-.1138-.4918-.2198l-6.1453-4.4415c-.3694-.2671-.4533-.784-.1852-1.1543.0289-.0395.0617-.0771.0964-.1118l6.319-6.07213c.1311-.12632.135-.33557.0087-.46768-.109-.11282-.2826-.13404-.4156-.04918L7.88597 13.0975c-.5101.324-1.13978.3973-1.7116.1996l-3.618-1.2516c-.43103-.1485-.65957-.6201-.51107-1.0511.081-.2314.25939-.4166.48889-.5034Z"></path>
              </svg>
              Телеграм канал
            </button>
          </a>

          <a href="https://www.youtube.com/@ЛаймЛаймЛайм" target="_blank" rel="noopener noreferrer">
            <button className="youtube-button btn btn-error btn-outline hover:scale-105 transition-all">
              <svg fill="currentColor" width={19} height={19} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.932 20.459v-8.917l7.839 4.459zM30.368 8.735c-0.354-1.301-1.354-2.307-2.625-2.663l-0.027-0.006c-3.193-0.406-6.886-0.638-10.634-0.638-0.381 0-0.761 0.002-1.14 0.007l0.058-0.001c-0.322-0.004-0.701-0.007-1.082-0.007-3.748 0-7.443 0.232-11.070 0.681l0.434-0.044c-1.297 0.363-2.297 1.368-2.644 2.643l-0.006 0.026c-0.4 2.109-0.628 4.536-0.628 7.016 0 0.088 0 0.176 0.001 0.263l0-0.014c0 0.074-0.001 0.162-0.001 0.25 0 2.48 0.229 4.906 0.666 7.259l-0.038-0.244c0.354 1.301 1.354 2.307 2.625 2.663l0.027 0.006c3.193 0.406 6.886 0.638 10.634 0.638 0.38 0 0.76-0.002 1.14-0.007l-0.058 0.001c0.322 0.004 0.702 0.007 1.082 0.007 3.749 0 7.443-0.232 11.070-0.681l-0.434 0.044c1.298-0.362 2.298-1.368 2.646-2.643l0.006-0.026c0.399-2.109 0.627-4.536 0.627-7.015 0-0.088-0-0.176-0.001-0.263l0 0.013c0-0.074 0.001-0.162 0.001-0.25 0-2.48-0.229-4.906-0.666-7.259l0.038 0.244z"></path>
              </svg>
              Ютуб Канал Лайма
            </button>
          </a>
        </div>

        <div className='flex gap-15'>
          <button className='btn events-button hover:scale-105 transition-all' onClick={() => document.getElementById('events_modal').showModal()}>
            Ивенты
          </button>

          <button className='btn events-button hover:scale-105 transition-all' onClick={() => document.getElementById('request_event_modal').showModal()}>
            Захостить ивент
          </button>
        </div>

      </section>


      {/* Videos Section */}
      <section className="h-screen grid text-center items-center justify-center">
        <h1 className='text-5xl'>Последние видео</h1>
      </section>

      <EventsModal />
    </div>
  );
}
