import { FaInstagram } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";

export default function Footer() {
    return (
        <div className="bg-gray-100 px-8 sm:px-24 py-10">
            <div className="flex flex-col sm:flex-row justify-between gap-3">
                <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
                    </svg>
                    <p>Developed by Shanthakumar</p>
                </div>
                <div className="flex gap-3 text-gray-700">
                    <a href="https://www.instagram.com/sk_shanthakumar_/" target="_blank"><FaInstagram size={25} /></a>
                    <a href="https://github.com/SKShanthakumar" target="_blank"><FaGithub size={25} /></a>
                    <a href="https://www.linkedin.com/in/shanthakumar-chennai/" target="_blank"><FaLinkedin size={25} /></a>
                </div>
            </div>
        </div>
    )
}