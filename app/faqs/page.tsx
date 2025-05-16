"use client";
import Image from "next/image";
import Footer from "@/components/footer";
import logo from '../assets/images/logo.png';
import founder from '../assets/images/founder.png';
import interaction from '../assets/images/interaction.png'; 
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { usePathname } from "next/navigation";
import Header from "@/components/ui/header";


export default function FaqsPage() {
  const pathname = usePathname();
  const faqs = [
    {
      question: "What is WellnexAI?",
      answer:
        "WellnexAI is a customizable, no-code AI chatbot platform designed for beauty, wellness, and healthcare businesses. It helps you capture leads, engage website visitors, and provide intelligent, multilingual responses — 24/7.",
    },
    {
      question: "How do I install the WellnexAI chatbot on my website?",
      answer:
        "Once you sign up and customize your chatbot, we'll provide a unique embed code. Simply paste this code into your website's HTML before the closing </body> tag. We offer full step-by-step instructions for all major platforms.",
    },
    {
      question: "I'm not tech-savvy — can I still use WellnexAI?",
      answer:
        "Yes! WellnexAI is designed to be user-friendly and requires no coding knowledge. If you need help, we're happy to walk you through the setup process.",
    },
    {
      question: "What website platforms does WellnexAI support?",
      answer:
        "We support all major platforms including WordPress, Squarespace, Wix, Shopify, Webflow, Bubble, Framer, Kajabi, ClickFunnels, and more.",
    },
    {
      question: "What happens to my data?",
      answer:
        "Your business data stays secure. All conversations and data collected through your chatbot are encrypted and stored securely. We are fully GDPR-compliant and never share your data with third parties.",
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer:
        "Yes. We require a 30-day notice for cancellations. Your account remains active for 30 days after the cancellation request, and your data is saved in case you choose to return.",
    },
    {
      question: "What if I'm struggling to afford the subscription during slow months?",
      answer:
        "We understand that business can fluctuate. If you're having a tough month, reach out to us — we may be able to offer a discounted month or a temporary pause to support your recovery.",
    },
    {
      question: "Can I customize the chatbot's look and language?",
      answer:
        "Yes! You can adjust colors, tone, default language, and chatbot flow to match your brand. You can also add allergy filters, location-based suggestions, and product types.",
    },
    {
      question: "How do I get a receipt for my subscription?",
      answer:
        "You'll automatically receive a receipt by email each time a payment is processed. You can also download receipts anytime from your dashboard.",
    },
    {
      question: "My chatbot isn't showing up on my website. What should I do?",
      answer:
        `<div class="space-y-3">
          <div><span>🟩 <strong>1. Check that the embed code is placed correctly</strong></span>
            <ul class="list-disc pl-6">
              <li>Make sure the code was pasted just before the closing <code>&lt;/body&gt;</code> tag of your website's HTML.</li>
              <li>If you're using a site builder (like Wix, Shopify, Webflow, etc.), double-check that you followed the correct steps for your platform.</li>
              <li>On WordPress, if you're using a theme editor, ensure you saved changes in <code>footer.php</code>.</li>
            </ul>
          </div>
          <div><span>🟨 <strong>2. Clear your cache and refresh</strong></span>
            <ul class="list-disc pl-6">
              <li>Sometimes, browser or site caching can delay updates.</li>
              <li>Try clearing your browser cache or open your site in an incognito/private window.</li>
              <li>If you're using a site builder with a "Publish" button, make sure you clicked it after adding the code.</li>
            </ul>
          </div>
          <div><span>🟦 <strong>3. Verify your chatbot ID</strong></span>
            <ul class="list-disc pl-6">
              <li>Ensure that your embed code contains your unique business ID (e.g. <code>?bot=yourcompany123</code>). If the ID is missing or incorrect, the chatbot won't load.</li>
            </ul>
          </div>
          <div><span>🟧 <strong>4. Check if the chatbot is restricted by your site's privacy settings</strong></span>
            <ul class="list-disc pl-6">
              <li>Some platforms (like Shopify or Webflow) may have custom script settings, cookie consent banners, or security rules that block scripts.</li>
              <li>Make sure third-party scripts are allowed, or whitelist the WellnexAI script in any firewall or cookie consent manager.</li>
            </ul>
          </div>
          <div><span>🟥 <strong>Still not working?</strong></span><br/>
            If you've double-checked all the above and your chatbot is still not showing, please contact us:<br/>
            <code>support@wellnexai.com</code><br/>
            Include:
            <ul class="list-disc pl-6">
              <li>Your website URL</li>
              <li>A screenshot of where the code is placed</li>
              <li>The platform you're using (e.g. Squarespace, Shopify, etc.)</li>
            </ul>
            We're here to help and usually respond within 24 hours.
          </div>
        </div>`,
    },
  ];
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <main className="min-h-screen bg-white flex flex-col">
     
    <Header/>
      {/* FAQ Accordion Section */}
      <section className="max-w-2xl mx-auto w-full mt-12 mb-16">
        <h1 className="text-3xl font-bold mb-8 text-center">FAQs</h1>
        <div className="divide-y divide-gray-200 border border-gray-200 rounded-xl bg-white shadow-sm">
          {faqs.map((faq, idx) => (
            <div key={idx}>
              <button
                className="w-full flex items-center justify-between px-6 py-5 text-left focus:outline-none hover:text-[#000000] transition"
                onClick={() => handleToggle(idx)}
                aria-expanded={openIndex === idx}
                aria-controls={`faq-answer-${idx}`}
              >
                <span className="font-semibold text-lg text-[#000000] flex items-center">
                  <span className="mr-2">{faq.question}</span>
                </span>
                <span className="ml-4 text-[#000000]">
                  {openIndex === idx ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                </span>
              </button>
              {openIndex === idx && (
                typeof faq.answer === 'string' && faq.answer.trim().startsWith('<div') ? (
                  <div
                    id={`faq-answer-${idx}`}
                    className="px-6 pb-6 text-[#000000] text-base animate-fade-in"
                    dangerouslySetInnerHTML={{ __html: faq.answer }}
                  />
                ) : (
                  <div
                    id={`faq-answer-${idx}`}
                    className="px-6 pb-6 text-[#000000] text-base animate-fade-in"
                  >
                    {faq.answer}
                  </div>
                )
              )}
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
