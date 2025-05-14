"use client";
import Image from "next/image";
import Footer from "@/components/footer";
import logo from '../assets/images/logo.png';
import founder from '../assets/images/founder.png';
import interaction from '../assets/images/interaction.png'; 
import { usePathname } from "next/navigation";

export default function PolicyPage() {
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
        </div>
        <div className="flex items-center space-x-3">
          <a href="/signin" className=" text-black bg-white rounded-md px-4 py-2 text-sm font-medium hover:bg-gray-50 transition">Log In</a>
          <a href="/signup" className="bg-black text-white rounded-md px-4 py-2 text-sm font-medium ml-2">Join Now</a>
        </div>
      </nav>
      {/* Policy Section */}
      <section className="flex flex-col max-w-4xl mx-auto bg-white rounded-xl shadow-sm mt-12 p-10">
        <h1 className="text-3xl font-bold text-center mb-6">CANCELLATION POLICY</h1>
        <p className="text-[#475569] text-base md:text-md mb-4">
          We aim to make your experience with WellnexAI seamless and stress-free. If you choose to cancel your subscription, please review the following policy to ensure a smooth transition:
        </p>
        <p className="text-[#475569] text-base md:text-md mb-2">
          <strong>Cancellation Notice</strong><br/>
          To cancel your subscription, we require a minimum of 30 days' notice. Your subscription will remain active for 30 days after your cancellation request is received. During this period, you will continue to have full access to your dashboard and chatbot features.<br/>
          You may submit your cancellation request via your [Dashboard] or by emailing us at <a href="mailto:support@wellnexai.com" className="underline">support@wellnexai.com</a>.
        </p>
        <p className="text-[#475569] text-base md:text-md mb-2">
          <strong>No Immediate Termination</strong><br/>
          Please note that we do not offer immediate cancellations or partial refunds. Your plan will continue until the end of your 30-day notice period.
        </p>
        <p className="text-[#475569] text-base md:text-md mb-2">
          <strong>Need Support During Slow Periods?</strong><br/>
          We understand that every business goes through ups and downs. If you're experiencing a slow period and struggling to keep up with payments, get in touch with us. We're committed to helping you stay connected with your clients and continue capturing leads. Flexible options such as temporary plan discounts or account pauses may be available on a case-by-case basis.<br/>
          Thank you for being a part of the WellnexAI community. We're here to support you every step of the way.
        </p>
      </section>

      {/* Privacy Policy Summary Section */}
      <section className="flex flex-col max-w-4xl mx-auto bg-white rounded-xl shadow-sm mt-8 p-10">
        <h2 className="text-2xl font-bold mb-4 text-left">PRIVACY POLICY SUMMARY</h2>
        <p className="text-[#475569] text-base md:text-md mb-4 text-left">
          At WellnexAI, we are committed to protecting both our business clients and their customers. Here's how we handle client data across our platform:
        </p>
        <ul className="list-disc pl-6 text-[#475569] text-base md:text-md mb-4">
          <li>Business Client Data: When businesses sign up with WellnexAI, we collect only the necessary information (e.g. name, email, phone number, business location) to set up and manage their account. This data is kept strictly within WellnexAI and is not sold or shared with third parties.</li>
          <li>End-Customer Data: When customers interact with WellnexAI-powered chatbots, we only retain the data they provide (such as name, contact details, and inquiries) as shared only with the specific business they are engaging with. We allow the business the tools to update or delete this data at any time.</li>
          <li>No Third-Party Sharing: We do not share any user or business data with third parties outside of the intended business-client relationship.</li>
          <li>Data Deletion: Businesses and their customers may request to have their data removed at any time by contacting support@wellnexai.com.</li>
          <li>GDPR Compliance: We are fully compliant with the General Data Protection Regulation (GDPR) and ensure transparency and protection at every data capture point.</li>
        </ul>
      </section>

      <Footer />
    </main>
  );
}
