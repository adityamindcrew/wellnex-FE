"use client"

import { useState, useEffect } from "react"
import { ChevronDown, Eye, Pencil, Trash2, Plus, Check, X } from "lucide-react"
import { log } from "console"

type Question = {
  id: string
  text: string
  createdAt: string
  active: boolean
  checked: boolean
}

export default function BusinessQuestions() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true)
      setError(null)
      try {
        const businessId = localStorage.getItem('businessId');
        const token = localStorage.getItem('token');
        if (!businessId || !token) {
          setError('Missing businessId or token');
          setLoading(false);
          return;
        }
        const response = await fetch('https://wellnexai.com/api/business/get-questions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ businessId }),
        });
        if (response) {
          const data = await response.json();
          // Map API data to your Question type
          const mappedQuestions = (data.data || []).map((q: any) => ({
            id: q._id,
            text: q.name,
            createdAt: new Date(q.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            }),
            active: true,
            checked: false,
          }));
          setQuestions(mappedQuestions);
        } else {
          throw new Error('Failed to fetch questions');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch questions');
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const toggleCheck = (id: string) => {
    setQuestions(
      questions.map((question) => {
        if (question.id === id) {
          return { ...question, checked: !question.checked }
        }
        return question
      }),
    )
  }

  const handleDeleteClick = (id: string) => {
    setSelectedQuestionId(id);
    setShowDeleteModal(true);
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setSelectedQuestionId(null);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedQuestionId) return;
    setDeleteLoading(true);
    try {
      const businessId = localStorage.getItem('businessId');
      const token = localStorage.getItem('token');
      if (!businessId || !token) {
        setError('Missing businessId or token');
        setDeleteLoading(false);
        return;
      }
      const response = await fetch('https://wellnexai.com/api/business/delete-question', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
            'Authorization': `Bearer ${token.trim()}`
        },
        body: JSON.stringify({ businessId, questionId: selectedQuestionId }),
      });
      if (!response.ok) {
        throw new Error('Failed to delete question');
      }
      // Remove from UI
      setQuestions(questions.filter(q => q.id !== selectedQuestionId));
      setShowDeleteModal(false);
      setSelectedQuestionId(null);
    } catch (err: any) {
      setError(err.message || 'Failed to delete question');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleEditClick = (question: Question) => {
    setEditingQuestion(question.id);
    setEditValue(question.text);
  };

  const handleUpdateQuestion = async () => {
    if (!editingQuestion || !editValue.trim()) return;
    try {
      setIsUpdating(true);
      const token = localStorage.getItem('token');
      const businessId = localStorage.getItem('businessId');
      if (!token || !businessId) throw new Error('Missing businessId or token');
      console.log('Updating question:', { questionId: editingQuestion, name: editValue.trim(), businessId });
      const response = await fetch('https://wellnexai.com/api/business/update-one-question', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          businessId: businessId,
          questions: {
            _id: editingQuestion,
            name: editValue.trim()
          }
        })
      });
      if (!response.ok) throw new Error('Failed to update question');
      // Update UI
      setQuestions(questions.map(q => q.id === editingQuestion ? { ...q, text: editValue.trim() } : q));
      setEditingQuestion(null);
      setEditValue("");
    } catch (err: any) {
      setError(err.message || 'Failed to update question');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingQuestion(null);
    setEditValue("");
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-200 px-4 sm:px-6 py-4 gap-4">
        <h2 className="text-xl font-semibold">Business Questions</h2>
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-black px-3 py-1 text-xs text-white">{questions.length} Questions</div>
          {/* <button className="flex items-center gap-1 rounded-lg bg-black px-3 py-1.5 text-sm text-white">
            <Plus size={16} />
            <span>Edit Questions</span>
          </button> */}
        </div>
      </div>
      <div className="px-4 sm:px-6 py-2">
        {loading && <div className="text-center py-4 text-gray-500">Loading questions...</div>}
        {error && <div className="text-center py-4 text-red-500">{error}</div>}
        <div className="hidden sm:flex items-center justify-between border-b border-gray-100 py-3 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-6"></div>
            <div className="flex items-center gap-1 font-medium">
              Questions
              <ChevronDown size={16} />
            </div>
          </div>
          <div className="flex items-center gap-20">
            <div className="w-32 font-medium">Created At</div>
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
                  className="h-4 w-4 rounded border-gray-300 accent-[#987CF1] focus:ring-[#987CF1]"
                />
              </div>
              {editingQuestion === question.id ? (
                <div className="flex-1 flex items-center gap-2">
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#987CF1]"
                    disabled={isUpdating}
                  />
                  <button
                    onClick={handleUpdateQuestion}
                    disabled={isUpdating}
                    className="p-1 text-green-600 hover:bg-green-50 rounded-full"
                  >
                    <Check size={18} />
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    disabled={isUpdating}
                    className="p-1 text-red-600 hover:bg-red-50 rounded-full"
                  >
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <div className="flex-1">{question.text}</div>
              )}
            </div>
            <div className="flex items-center justify-between sm:gap-20">
              <div className="w-32 text-gray-500">{question.createdAt}</div>
              <div className="w-20">
                {question.active && (
                  <div className="flex items-center gap-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                    <span className="text-green-600">Active</span>
                  </div>
                )}
              </div>
              <div className="flex w-24 items-center justify-end gap-2">
                {/* <button className="rounded-full p-1 hover:bg-gray-100">
                  <Eye size={18} className="text-gray-500" />
                </button> */}
                <button 
                  onClick={() => handleEditClick(question)}
                  disabled={isUpdating}
                  className="rounded-full p-1 hover:bg-gray-100"
                >
                  <Pencil size={18} className="text-gray-500" />
                </button>
                <button className="rounded-full p-1 hover:bg-gray-100" onClick={() => handleDeleteClick(question.id)}>
                  <Trash2 size={18} className="text-gray-500" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Delete Question</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this question? This action cannot be undone.</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleDeleteCancel}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                disabled={deleteLoading}
              >
                {deleteLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
