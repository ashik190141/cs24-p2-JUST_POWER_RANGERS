import { FaFacebook, FaGithub, FaLinkedin } from 'react-icons/fa';
import img from '../../public/logo.png'

const Footer = () => {

    return (
        <div>
            <footer className="footer p-10 bg-[#071b0e] text-white">
                <nav>
                    <h6 className="footer-title">Services</h6>
                    <a className="link link-hover">Branding</a>
                    <a className="link link-hover">Design</a>
                    <a className="link link-hover">Marketing</a>
                    <a className="link link-hover">Advertisement</a>
                </nav>
                <nav>
                    <h6 className="footer-title">Company</h6>
                    <a className="link link-hover">About us</a>
                    <a className="link link-hover">Contact</a>
                    <a className="link link-hover">Jobs</a>
                    <a className="link link-hover">Press kit</a>
                </nav>
                <nav>
                    <h6 className="footer-title">Legal</h6>
                    <a className="link link-hover">Terms of use</a>
                    <a className="link link-hover">Privacy policy</a>
                    <a className="link link-hover">Cookie policy</a>
                </nav>
            </footer>
            <footer className="footer px-10 py-4 border-t bg-[#092111] text-white">
                <aside className="items-center grid-flow-col">
                    <img className='w-16 h-16' src={img} alt="" />
                    <p>EcoSync Ltd. <br />Providing reliable Service since 2024</p>
                </aside>
                <nav className="md:place-self-center md:justify-self-end">
                    <div className="grid grid-flow-col gap-4">
                        <FaFacebook className='text-2xl cursor-pointer' />
                        <FaGithub className='text-2xl cursor-pointer' />
                        <FaLinkedin className='text-2xl cursor-pointer' />
                    </div>
                </nav>
            </footer>
        </div>
    );
};

export default Footer;