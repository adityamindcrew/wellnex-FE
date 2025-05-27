'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import featured from '../../assets/images/featuredIcon.png';

export default function SuccessPage() {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      router.push('/dashboard');
    }, 5000);
  }, []);
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <div className="mb-6 flex">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <Image src={featured} alt="success" width={24} height={24} />
          </div>
        </div>

        <h1 className="mb-4 text-center text-xl font-semibold">🎉 Your Personalized Chatbot is Ready!</h1>

        <p className="mb-4 text-[#535862]">Congratulations! You've successfully completed your profile and payment.</p>

        <p className="mb-6 text-[#535862]">
          Your unique chatbot embed code has been sent to your registered email address.
        </p>

        <ul className="space-y-4">
          <li className="flex items-start">
            <span className="mr-2 text-lg">•</span>
            <div>
              <span className="font-medium text-[#535862]">Check Your Email: <br/>
                </span> <span className="text-[#535862]">Locate the email from WellnexAI containing your
              embed code.</span>
            </div>
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-lg">•</span>
            <div>
              <span className="font-medium text-[#535862] underline" >Need help Installing your chatbot?<br/> </span> Visit our{" "}
              <a href="/faqs" className="text-blue-600 underline">
                FAQ page
              </a>{" "}
              for a step-by-step installation guide, or feel free to contact our support team.
            </div>
          </li>
        </ul>
      </div>
    </div>
  )
}
