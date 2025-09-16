import '../App.css';
import "tailwindcss";


export default function Footer() {
    return (
        <footer className="footer sm:footer-horizontal text-base-content p-10">
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


