export default function PlatformSubscription() {
  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold">Platform Subscription</h2>
      <div className="flex gap-6">
        <div className="w-[400px] rounded-lg border border-gray-200 bg-white p-6">
          <div className="space-y-4">
            <div className="flex justify-between">
              <div className="text-sm font-medium text-gray-500">Subscription Status</div>
              <div className="text-sm font-medium">Active</div>
            </div>
            <div className="flex justify-between">
              <div className="text-sm font-medium text-gray-500">Start Date</div>
              <div className="text-sm">2025-05-15</div>
            </div>
            <div className="flex justify-between">
              <div className="text-sm font-medium text-gray-500">Next Renewal Date</div>
              <div className="text-sm">2025-06-15</div>
            </div>
            <div className="flex justify-between">
              <div className="text-sm font-medium text-gray-500">Email</div>
              <div className="text-sm">info@businessgmail.com</div>
            </div>
            <div className="flex gap-2 pt-2">
              <button className="rounded-md bg-black px-4 py-2 text-sm text-white">Renew Now</button>
              <button className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm">
                Cancel Subscription
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19Z"
                  fill="#666666"
                />
                <path d="M14 17H10V15H14V17ZM16 13H8V11H16V13ZM16 9H8V7H16V9Z" fill="#666666" />
              </svg>
            </div>
            <div>
              <div className="text-sm font-medium">Change Logo (.png )</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-1">
              <div className="h-12 w-12 rounded-full bg-purple-300"></div>
              <div className="h-12 w-12 rounded-full bg-purple-800"></div>
            </div>
            <div>
              <div className="text-sm font-medium">Change Color Theme</div>
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <button className="rounded-md bg-black px-4 py-2 text-sm text-white">Reset Theme</button>
            <button className="rounded-md bg-black px-4 py-2 text-sm text-white">Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  )
}
