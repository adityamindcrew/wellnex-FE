import Link from "next/link"
// import { Instagram, Linkedin } from "lucide-react"
import Image from "next/image"
import logo from '../app/assets/images/logo.png'
import Instagram from '../app/assets/images/Instagram.png';
import linkedIn from '../app/assets/images/linkedIn.png';

export default function Footer() {
  return (
    <footer className="bg-gray-50 py-12 px-4 md:px-8 lg:px-12">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Left Column - Logo and Contact */}
          <div className="space-y-6">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              {/* <div className="h-8 w-8 border border-gray-300 rounded flex items-center justify-center">
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div> */}
              {/* <span className="font-semibold text-lg">WellnexAI</span> */}
              <div className="mb-4">
              <Image src={logo} alt="WellnexAI Logo" width={100} height={200} />
            </div>
            </div>


            {/* Contact */}
            <div className="space-y-1">
              <h3 className="text-sm font-semibold">Contact:</h3>
              {/* <p className="text-sm text-gray-600">1800 123 456</p> */}
              <p className="text-sm text-gray-600">Text 24/7 (toll-free) via Whatsapp : +447466055304
              support@wellnexai.com</p>
            </div>

            {/* Social Icons */}
            <div className="flex space-x-4">
              <Link href="https://www.instagram.com/wellnexai/" className="text-gray-600 hover:text-gray-900">
           
                <Image src={Instagram} alt="Instagram" width={20} height={20} />
           
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="https://www.linkedin.com/company/wellnexai/" className="text-gray-600 hover:text-gray-900">
              <Image src={linkedIn} alt="Instagram" width={20} height={20} />

                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </div>

          {/* Right Column - Navigation */}
          <div className="flex justify-end">
            <nav className="space-y-2">
              {[
                { name: "Home", href: "/" },
                { name: "About", href: "/about" },
                { name: "Help", href: "/help" },
           
                { name: "How it works", href: "" },
                { name: "Careers", href: "" },
              ].map((item) => (
                <div key={item.name}>
                  <Link href={item.href} className="block text-gray-600 hover:text-gray-900">
                    {item.name}
                  </Link>
                </div>
              ))}
            </nav>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-6 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-gray-500 mb-4 md:mb-0">WellnexAI is a trading name for Sarawane AI Ltd.</p>
          <div className="flex space-x-4">
            <Link href="/policy-page" className="text-xs text-gray-500 hover:text-gray-700">
              Privacy Policy
            </Link>
            <Link href="" className="text-xs text-gray-500 hover:text-gray-700">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
