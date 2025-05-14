"use client";

import Image from "next/image"
import { Button } from "@/components/ui/button"
import logo from '../assets/images/logo.png';
import AI from '../assets/images/AI.png';
import Relume from '../assets/images/Relume.png';
import Mobile from '../assets/images/Mobile.png';
import ContactForm from "@/components/contact-form";
import FeatureCard from "@/components/feature-card";
import Footer from "@/components/footer";
import Map from '../assets/images/map.png';
import robot from '../assets/images/robot.png';
import featureAI from '../assets/images/featureAI.png';
import { usePathname } from "next/navigation";

export default function Home() {
  const pathname = usePathname();

  return (
    <main className="min-h-screen bg-white">
      {/* Navbar */}
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
        </div>
        <div className="flex items-center space-x-3">
          <a href="/signin" className=" text-black bg-white rounded-md px-4 py-2 text-sm font-medium hover:bg-gray-50 transition">Log In</a>
          <a href="/signup" className="bg-black text-white rounded-md px-4 py-2 text-sm font-medium ml-2">Join Now</a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative w-full h-[400px] md:h-[600px]">
        <div className="absolute inset-0 z-0">
          <Image src={AI} alt="Digital background" fill className="object-cover" priority />
        </div>
        <div className="absolute inset-0 bg-[#0a2540]/70 z-10"></div>
        <div className="relative z-20 flex flex-col items-center justify-center h-full text-center px-4">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white max-w-3xl leading-tight">
            Transform Your Beauty, Health & Wellness Business with AI
          </h1>
          <div className="mt-8">
            {/* <Button className="bg-white text-black hover:bg-gray-100 rounded-md px-6 py-2.5 text-sm font-medium">
              Get Started
            </Button> */}
             <h2 className="text-xl md:text-xl lg:text-xl text-white max-w-3xl leading-tight">
             Capture leads 24/7, modernize your client engagement, and boost bookings effortlessly — no technical skills needed.
          </h2>
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section className="py-16 px-4">
        <h2 className="text-2xl font-bold text-center mb-12">How it works</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="bg-gray-100 p-4 rounded-lg flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4 border border-gray-200">
                <div className="w-6 h-6 relative">
                  <Image src={Relume} alt={`Step ${step}`} fill className="object-contain" />
                </div>
              </div>
              <p className="text-xs text-gray-700 max-w-[180px]">
                {step === 1 && "AI-powered consultation to understand your unique needs and goals"}
                {step === 2 && "Personalized wellness plans created just for you"}
                {step === 3 && "Real-time tracking and adjustments to optimize results"}
                {step === 4 && "24/7 support and guidance throughout your wellness journey"}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose WellnexAI Section */}
      <section className="py-16 px-4 bg-white">
        <h2 className="text-3xl font-bold text-center mb-2">Why Choose WellnexAI?</h2>
        <p className="text-center text-xl text-gray-600 ">Smart. Simple. Tailored for You.</p>

        <div className="flex flex-col md:flex-row max-w-4xl mx-auto">
          <div className="relative w-[380px] h-[500px] flex-shrink-0 flex items-center justify-center mb-8 md:mb-0">
            <div className="absolute w-full h-full flex items-center justify-center">
              <Image src={Mobile} alt="Mobile App" width={360} height={480} className="object-contain" />
            </div>
          </div>
          <div className="md:ml-10 max-w-md flex-1 flex flex-col justify-center h-[500px]">
            <p className="text-md text-gray-700 mb-4">
              Wellnex AI revolutionizes the beauty and wellness industry by offering customizable AI-powered chatbots tailored for beauty clinics, spas, dermatologists, salons, and wellness businesses and products. Our platform enables you to modernize your client engagement effortlessly. With a simple setup, you can capture leads 24/7 and increase bookings without the need for additional marketing or staff.
            </p>
            {/* <p className="text-lg text-gray-700 mb-4">
              Our AI-powered virtual assistants handle appointment scheduling, personalized product recommendations, and
              routine client inquiries. With a 24/7 presence, your business never stops engaging with clients, even when
              you're not physically present.
            </p>
            <p className="text-lg text-gray-700">
              Join the hundreds of beauty and wellness professionals who are leveraging AI to grow their business today!
            </p> */}
          </div>
        </div>
      </section>

      {/* Connect Anytime Section */}

      <section className="py-16 px-4 bg-gray-50">
        <h2 className="text-xl font-bold text-center mb-2">Connect Anytime, Anywhere</h2>
        <h3 className="text-3xl font-medium text-center mb-12">24/7 Engagement — Without Extra Staff</h3>

        <div>
          <p className="text-sm text-gray-700 mb-1 text-center">
            Your AI chatbot will provide tailored responses that resonate with your audience. No more waiting for business hours;
          </p>
          <p className="text-sm text-gray-700 text-center">
            your clients can connect with you anytime, anywhere.
          </p>
        </div>
      </section>

      <section className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Our Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FeatureCard
              image={robot.src}
              title="24/7 Leads Generation"
              description="Our AI assistants work around the clock, capturing and nurturing leads even when you're not available."
              learnMoreLink="#"
            />
            <FeatureCard
              image={featureAI.src}
              title="Launch Your AI Assistant"
              description="Set up your personal AI assistant to handle routine tasks and improve your productivity."
              learnMoreLink="#"
            />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="w-full py-12 md:py-24 bg-white">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="relative w-full h-[500px]">
              <Image
                src={Map}
                alt="World map with London highlighted"
                fill
                className="object-cover rounded-lg"
              />
       
            </div>
            <ContactForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  )

}