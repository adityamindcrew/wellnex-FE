"use client"

import { useState } from "react"
import { ChevronDown, Eye, Pencil, Trash2, Plus } from "lucide-react"

type Keyword = {
  id: number
  text: string
  lastEdited: string
  active: boolean
  checked: boolean
}

export default function BusinessKeywords() {
  const [keywords, setKeywords] = useState<Keyword[]>([
    {
      id: 1,
      text: "Skincare Routine",
      lastEdited: "22 Jan 2025",
      active: true,
      checked: true,
    },
    {
      id: 2,
      text: "Face Moisturizer",
      lastEdited: "20 Jan 2025",
      active: true,
      checked: true,
    },
    {
      id: 3,
      text: "Korean Skincare",
      lastEdited: "24 Jan 2025",
      active: true,
      checked: true,
    },
    {
      id: 4,
      text: "Anti-Aging Cream",
      lastEdited: "26 Jan 2025",
      active: true,
      checked: false,
    },
    {
      id: 5,
      text: "Natural Skincare Products",
      lastEdited: "30 Apr 2025",
      active: true,
      checked: false,
    },
    {
      id: 6,
      text: "Sensitive Skin Care",
      lastEdited: "12 Apr 2025",
      active: true,
      checked: false,
    },
    {
      id: 7,
      text: "Acne Treatment Products",
      lastEdited: "4 Mar 2025",
      active: true,
      checked: false,
    },
    {
      id: 8,
      text: "Dark Spot Correction",
      lastEdited: "15 Apr 2025",
      active: true,
      checked: false,
    },
    {
      id: 9,
      text: "Hyaluronic Acid Serum",
      lastEdited: "4 May 2025",
      active: true,
      checked: false,
    },
  ])

  const toggleCheck = (id: number) => {
    setKeywords(
      keywords.map((keyword) => {
        if (keyword.id === id) {
          return { ...keyword, checked: !keyword.checked }
        }
        return keyword
      }),
    )
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white">
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
        <h2 className="text-xl font-semibold">Business Keywords</h2>
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-black px-3 py-1 text-xs text-white">9 Keywords</div>
          <button className="flex items-center gap-1 rounded-lg bg-black px-3 py-1.5 text-sm text-white">
            <Plus size={16} />
            <span>Edit Keywords</span>
          </button>
        </div>
      </div>
      <div className="px-6 py-2">
        <div className="flex items-center justify-between border-b border-gray-100 py-3 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-6"></div>
            <div className="flex items-center gap-1 font-medium">
              Keywords
              <ChevronDown size={16} />
            </div>
          </div>
          <div className="flex items-center gap-20">
            <div className="w-32 font-medium">Last Edited</div>
            <div className="w-20 font-medium">Status</div>
            <div className="w-24"></div>
          </div>
        </div>
        {keywords.map((keyword) => (
          <div key={keyword.id} className="flex items-center justify-between border-b border-gray-100 py-3 text-sm">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center">
                <input
                  type="checkbox"
                  checked={keyword.checked}
                  onChange={() => toggleCheck(keyword.id)}
                  className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
              </div>
              <div>{keyword.text}</div>
            </div>
            <div className="flex items-center gap-20">
              <div className="w-32 text-gray-500">{keyword.lastEdited}</div>
              <div className="w-20">
                {keyword.active && (
                  <div className="flex items-center gap-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                    <span className="text-green-600">Active</span>
                  </div>
                )}
              </div>
              <div className="flex w-24 items-center justify-end gap-2">
                <button className="rounded-full p-1 hover:bg-gray-100">
                  <Eye size={18} className="text-gray-500" />
                </button>
                <button className="rounded-full p-1 hover:bg-gray-100">
                  <Pencil size={18} className="text-gray-500" />
                </button>
                <button className="rounded-full p-1 hover:bg-gray-100">
                  <Trash2 size={18} className="text-gray-500" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
