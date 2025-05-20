"use client"; 


import Image from "next/image";
import Footer from "@/components/footer";
import logo from '../assets/images/logo.png';
import founder from '../assets/images/founder.png';
import interaction from '../assets/images/interaction.png'; 

import { usePathname } from "next/navigation";
import Header from "@/components/ui/header";

export default function AboutPage() {
  const pathname = usePathname();
  return (
    <main className="min-h-screen bg-white flex flex-col">
     
  <Header/>
      <section className="flex flex-col md:flex-row max-w-5xl mx-auto bg-white rounded-xl shadow-sm mt-12 p-8 gap-8">
        <div className="flex-1 flex flex-col justify-center">
          <h1 className="text-2xl md:text-3xl font-bold mb-4">About WellnexAI</h1>
          <h4 className="text-sm md:text-sm mt-3 font-semibold mb-4">WellnexAI was born out of a simple belief: </h4>
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
          <div className="w-full max-w-xs h-96  rounded-lg flex items-center justify-center relative overflow-hidden">
            <Image src={interaction} alt="Robot" fill className="object-contain" />
          </div>
        </div>
      </section>


      <section className="flex flex-col md:flex-row max-w-5xl mx-auto bg-white rounded-xl shadow-sm mt-8 p-8 gap-8">
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-xs h-96 rounded-lg flex items-center justify-center relative overflow-hidden">
            <Image src={founder} alt="Founder" fill className="object-contain" />
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
          <div className="mt-4 text-sm text-gray-500">Sara Soltanzadeh, Founder of WellnexAI</div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
