"use client";

import Image from "next/image"
import { Button } from "@/components/ui/button"
import logo from '../assets/images/logo.png';
import AI from '../assets/images/AI.png';
import Relume from '../assets/images/Relume.png';
import Mobile from '../assets/images/mobile.png';
import ContactForm from "@/components/contact-form";
import FeatureCard from "@/components/feature-card";
import Footer from "@/components/footer";
import Map from '../assets/images/map.png';
import robot from '../assets/images/robot.png';
import featureAI from '../assets/images/featureAI.png';
import { usePathname } from "next/navigation";
import { useState } from "react"
import { Menu, X } from "lucide-react"
import Header from "@/components/ui/header";
import Step1Img from "../../app/assets/images/add.png";
import Step2Img from "../../app/assets/images/payment.png";
import Step3Img from "../../app/assets/images/code.png";
import Step4Img from "../../app/assets/images/customer.png";

const stepImages = [Step1Img, Step2Img, Step3Img, Step4Img];

export default function Home() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <main className="min-h-screen bg-white overflow-x-hidden">
      {/* Navbar */}
      <Header />

      {/* Hero Section */}
      <section className="relative w-full h-[320px] md:h-[600px]">
        <div className="absolute inset-0 z-0">
          <Image src={AI} alt="Digital background" fill priority quality={100} />
        </div>
        {/* <div className="absolute inset-0 bg-[#0a2540]/70 z-10"></div> */}
        <div className="relative z-20 flex flex-col items-center justify-center h-full text-center px-3">
          <h1 className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white max-w-3xl leading-tight mb-12">
            Transform Your Beauty, Health & <br/>
             Wellness Business with AI
          </h1>
          <div className="mt-6 md:mt-8">
            <h3 className="text-base sm:text-xl lg:text-xl text-white max-w-3xl leading-tight">
              Capture leads 24/7, modernize your client engagement, and boost bookings effortlessly — no technical skills needed.
            </h3>
          </div>
        </div>
      </section>


     <section className="py-8 md:py-16 px-4">
        <h2 className="text-xl md:text-2xl font-bold text-center mb-8 md:mb-12">How it works</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {[1, 2, 3, 4].map((step, idx) => (
            <div key={step} className="bg-gray-100 p-4 rounded-lg flex flex-col items-center text-center">
              <div className="w-12 h-12  flex items-center justify-center ">
                <div className="w-6 h-6 relative">
                  <Image src={stepImages[idx]} alt={`Step ${step}`} fill className="object-contain" />
                </div>
              </div>
              <p className="text-xs text-[#000000] max-w-[178px]">
                {step === 1 && <><strong>Sign up & personalize your chatbot</strong> (Choose your branding, questions, and services)</>}
                {step === 2 && <><strong>"Pay securely via stripe</strong> (199/month - charged in your local currency)</>}
                {step === 3 && <><strong>"Get your unique embed code </strong>(Ready to copy & paste into your website)</>}
                {step === 4 &&<><strong> "Start collecting new clients leads 24/7 </strong>(Let AI handle engagement while you focus on results)</>}
              </p>
            </div>
          ))}
        </div>
      </section> 


      <section className="py-4 md:py-8 px-4 bg-white">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-1 md:mb-4">Why Choose WellnexAI?</h2>
        <p className="text-center text-base md:text-xl text-[#000000] mb-4">Smart. Simple. Tailored for You.</p>
        <div className="flex flex-col md:flex-row max-w-5xl mx-auto w-full items-center">
          <div className="relative w-full max-w-lg md:w-[420px] h-96 md:h-[520px] flex-shrink-0 flex items-center justify-center mb-4 md:mb-0 mx-auto">
            <Image src={Mobile} alt="Mobile App" className="object-contain" />
          </div>
          <div className="hidden md:block h-[320px] w-[0.8px] bg-blue-600 mx-8" />
          <div className="md:ml-8 max-w-xl flex-1 flex flex-col justify-center h-auto md:h-[400px]">
            <p className="text-sm md:text-md text-[#000000] mb-2 text-justify">
              Wellnex AI revolutionizes the beauty and wellness industry by offering customizable AI-powered chatbots tailored for beauty clinics, spas, dermatologists, salons, and wellness businesses and products. Our platform enables you to modernize your client engagement effortlessly. With a simple setup, you can capture leads 24/7 and increase bookings without the need for additional marketing or staff.
            </p>
          </div>
        </div>
      </section>

      {/* Connect Anytime Section */}
      <section className="py-8 md:py-16 px-4 bg-gray-50">
        <h2 className="text-lg md:text-xl font-bold text-center mb-2">Connect Anytime, Anywhere</h2>
        <h3 className="text-xl md:text-3xl font-medium text-center mb-8 md:mb-12">24/7 Engagement — Without Extra Staff</h3>

        <div>
          <p className="text-xs md:text-sm text-[#000000] mb-1 text-center">
            Your AI chatbot will provide tailored responses that resonate with your audience. No more waiting for business hours;
          </p>
          <p className="text-xs md:text-sm text-[#000000] text-center">
            your clients can connect with you anytime, anywhere.
          </p>
        </div>
      </section>

      <section className="w-full py-8 md:py-24">
        <div className="container px-4 md:px-6 mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">Our Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-full flex flex-col p-6">
              <FeatureCard
                image={robot.src}
                title="Launch Your AI Concierge in Just Minutes"
                description="Your AI chatbot works like a 24/7 receptionist, capturing client details even after hours when your team is busy."
                learnMoreLink="/"
              />
            </div>
            <div className="h-full flex flex-col p-6">
              <FeatureCard
                image={featureAI.src}
                title="24/7 Leads Generation"
                description="Even when your business is closed, the chatbot is live and helping clients share their concerns, request services, and leave contact info for follow-up."
                learnMoreLink="/"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="w-full py-8 md:py-24 bg-white">
        <div className="container px-1 md:px-1 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="relative w-full h-64 md:h-[520px]">
              <Image
                src={Map}
                alt="World map with London highlighted"
                fill
                // className="rounded-lg"
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