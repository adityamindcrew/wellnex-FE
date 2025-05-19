"use client"

import { useState } from "react"
import { ChevronDown, Eye, Pencil, Trash2, Plus } from "lucide-react"

type Question = {
  id: number
  text: string
  lastEdited: string
  active: boolean
  checked: boolean
}

export default function BusinessQuestions() {
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 1,
      text: "How do I book a session?",
      lastEdited: "22 Jan 2025",
      active: true,
      checked: true,
    },
    {
      id: 2,
      text: "What specific skin concerns does our business address?",
      lastEdited: "20 Jan 2025",
      active: true,
      checked: true,
    },
    {
      id: 3,
      text: "Which products or services are the most profitable?",
      lastEdited: "24 Jan 2025",
      active: true,
      checked: true,
    },
    {
      id: 4,
      text: "Is our monthly cash flow positive?",
      lastEdited: "26 Jan 2025",
      active: true,
      checked: false,
    },
    {
      id: 5,
      text: "What is our pricing strategy, and how does it compare to competitors?",
      lastEdited: "18 Jan 2025",
      active: true,
      checked: false,
    },
  ])

  const toggleCheck = (id: number) => {
    setQuestions(
      questions.map((question) => {
        if (question.id === id) {
          return { ...question, checked: !question.checked }
        }
        return question
      }),
    )
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-200 px-4 sm:px-6 py-4 gap-4">
        <h2 className="text-xl font-semibold">Business Questions</h2>
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-black px-3 py-1 text-xs text-white">5 Questions</div>
          <button className="flex items-center gap-1 rounded-lg bg-black px-3 py-1.5 text-sm text-white">
            <Plus size={16} />
            <span>Edit Questions</span>
          </button>
        </div>
      </div>
      <div className="px-4 sm:px-6 py-2">
        <div className="hidden sm:flex items-center justify-between border-b border-gray-100 py-3 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-6"></div>
            <div className="flex items-center gap-1 font-medium">
              Questions
              <ChevronDown size={16} />
            </div>
          </div>
          <div className="flex items-center gap-20">
            <div className="w-32 font-medium">Last Edited</div>
            <div className="w-20 font-medium">Status</div>
            <div className="w-24"></div>
          </div>
        </div>
        {questions.map((question) => (
          <div key={question.id} className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 py-3 text-sm gap-2 sm:gap-0">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center">
                <input
                  type="checkbox"
                  checked={question.checked}
                  onChange={() => toggleCheck(question.id)}
                  className="h-4 w-4 rounded border-gray-300 text-[#7F56D9] focus:ring-[#7F56D9]"
                />
              </div>
              <div className="flex-1">{question.text}</div>
            </div>
            <div className="flex items-center justify-between sm:gap-20">
              <div className="w-32 text-gray-500">{question.lastEdited}</div>
              <div className="w-20">
                {question.active && (
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
