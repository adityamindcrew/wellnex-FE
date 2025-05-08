export default function SuccessPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <div className="mb-6 flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-green-500"
            >
              <path
                d="M20 6L9 17L4 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        <h1 className="mb-4 text-center text-2xl font-semibold">🎉 Your Personalized Chatbot is Ready!</h1>

        <p className="mb-4 text-gray-700">Congratulations! You've successfully completed your profile and payment.</p>

        <p className="mb-6 text-gray-700">
          Your unique chatbot embed code has been sent to your registered email address.
        </p>

        <ul className="space-y-4 pl-6">
          <li className="flex items-start">
            <span className="mr-2 text-lg">•</span>
            <div>
              <span className="font-medium">Check Your Email:</span> Locate the email from WellnexAI containing your
              embed code.
            </div>
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-lg">•</span>
            <div>
              <span className="font-medium">Need help:</span> Installing your chatbot? Visit our{" "}
              <a href="#" className="text-blue-600 underline">
                FAQ page (link)
              </a>{" "}
              for a step-by-step installation guide, or feel free to contact our support team.
            </div>
          </li>
        </ul>
      </div>
    </div>
  )
}
