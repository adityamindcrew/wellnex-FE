"use client"
import Image from "next/image";
import logo from "../assets/images/logo.png";
import mockup from "../assets/images/logo.png"; // Replace with your actual mockup image path
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen w-full bg-[#F5F5F5] flex justify-center items-center">
      <div className="flex flex-col md:flex-row w-full max-w-[900px] bg-white shadow-lg rounded-2xl mx-auto overflow-hidden">
        {/* Left: Content */}
        <div className="w-full md:w-1/2 flex flex-col justify-center px-8 py-12">
          <div className="mb-8">
            <Image src={logo} alt="WellnexAI Logo" width={100} height={100} />
          </div>
          <h1 className="text-3xl font-bold mb-4">Welcome to WellnexAI</h1>
          <p className="text-gray-600 mb-6">
            Your business, your AI. Start by telling us about your business.
          </p>
          <Link href="/signup">
            <button className="px-6 py-3 bg-[#987CF1] text-white rounded-lg font-semibold shadow hover:bg-[#7a63c7] transition-colors">
              Get Started
            </button>
          </Link>
        </div>
        {/* Right: Mockup/Image */}
        <div className="w-full md:w-1/2 flex items-center justify-center bg-[#F5F5F5]">
          <div className="relative w-full h-[400px]">
            <Image
              src={mockup}
              alt="Website Mockup"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
} 