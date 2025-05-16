"use client"; 


import Image from "next/image";
import Footer from "@/components/footer";
import logo from '../assets/images/logo.png';
import founder from '../assets/images/founder.png';
import interaction from '../assets/images/interaction.png'; 

import { usePathname } from "next/navigation";

export default function AboutPage() {
  const pathname = usePathname();
  return (
    <main className="min-h-screen bg-white flex flex-col">
     
     <nav className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-100">
        <div className="flex items-center">
          <div className="h-7 w-28 relative">
            <Image src={logo} alt="WellnexAI Logo" width={100} height={100} />
          </div>
        </div>
        <div className="hidden md:flex items-center space-x-6">
          <a href="/landing" className={`text-md font-medium text-[#000000] hover:text-[#000000] pb-2 ${pathname === '/landing' ? 'border-b-2 border-black' : ''}`}>Home</a>
          <a
            href="/about"
            className={`text-md font-medium text-[#000000] hover:text-[#000000] pb-2 ${pathname.startsWith('/about') ? 'border-b-2 border-black' : ''}`}
          >
            About
          </a>
          <a href="/help" className={`text-md font-medium text-[#000000] hover:text-[#000000] pb-2 ${pathname === '/help' ? 'border-b-2 border-black' : ''}`}>Help</a>
          <a href="/faqs" className={`text-md font-medium text-[#000000] hover:text-[#000000] pb-2 ${pathname === '/faqs' ? 'border-b-2 border-black' : ''}`}>FAQs</a>
        </div>
        <div className="flex items-center space-x-3">
          <a href="/signin" className=" text-black bg-white rounded-md px-4 py-2 text-sm font-medium hover:bg-gray-50 transition">Log In</a>
          <a href="/signup" className="bg-black text-white rounded-md px-4 py-2 text-sm font-medium ml-2">Join Now</a>
        </div>
      </nav>

     
      <section className="flex flex-col md:flex-row max-w-5xl mx-auto bg-white rounded-xl shadow-sm mt-12 p-8 gap-8">
    
        <div className="flex-1 flex flex-col justify-center">
          <h1 className="text-2xl md:text-3xl font-bold mb-4">About WellnexAI</h1>
          <p className="text-[#475569] text-base md:text-md mb-3">
            beauty, wellness, and health businesses deserve smarter, easier ways to grow, without the stress of constant marketing or tech complexity. We empower clinics, spas, salons, gyms, and wellness brands to deliver personalized consultation 24/7 using intelligent, no-code AI chatbots that speaks their client's language – literally.
          </p>
          <p className="text-[#475569] text-base md:text-md mb-3">
            Our intuitive SaaS solution lets you personalize your chatbot's color, branding, consultation questions, and service suggestions — all in just minutes, with zero technical experience required.
          </p>
          <p className="text-[#475569] text-base md:text-md mb-3">
            We believe technology should feel like a partner, not a problem. Let WellnexAI do the work, so you can focus on your craft.
          </p>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-xs h-72 bg-gray-100 rounded-lg flex items-center justify-center relative overflow-hidden">
            <Image src={interaction} alt="Robot" fill className="object-cover" />
          </div>
        </div>
      </section>


      <section className="flex flex-col md:flex-row max-w-5xl mx-auto bg-white rounded-xl shadow-sm mt-8 p-8 gap-8">
      
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-xs h-72 bg-gray-100 rounded-lg flex items-center justify-center relative overflow-hidden">
            <Image src={founder} alt="Founder" fill className="object-cover" />
          </div>
        </div>
        {/* Right: Founder Text */}
        <div className="flex-1 flex flex-col justify-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Founder's Vision</h2>
          <p className="text-[#475569] text-base md:text-md mb-3">
            As I practiced singing one night, I reflected on how voice isn't just about sound—it's about connection, emotion, and presence. That realization became the heart of WellnexAI.
          </p>
          <p className="text-[#475569] text-base md:text-md mb-3">
            By combining my love of art with the limitless possibilities of AI, I built a fully customizable, no-code chatbot that speaks your brand's language—in color, tone, and personality. It's my way of bringing artistry back into digital customer care, so every visitor feels seen, heard, and inspired.
          </p>
          <p className="text-[#475569] text-base md:text-md mb-3">
            We're on a mission to democratize intelligent chatbots so that small and mid-sized businesses can compete, connect, and thrive in a digital world. Together, we're redefining what's possible for every beauty, health, and wellness entrepreneur—and making innovation accessible to all.
          </p>
          <div className="mt-4 text-sm text-gray-500">Saba Sadiqzai, Founder of WellnexAI</div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
