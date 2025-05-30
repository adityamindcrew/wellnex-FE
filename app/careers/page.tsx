"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export default function CareersForm() {
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    message: "",
    file: null as File | null
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    message: "",
    file: ""
  })

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(false)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [success])

  const validate = () => {
    const newErrors: typeof errors = { name: "", phoneNumber: "", email: "", message: "", file: "" };
    if (!formData.name.trim()) newErrors.name = "Full Name is required.";
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = "Phone Number is required.";
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "Invalid email address.";
    if (!formData.message.trim()) newErrors.message = "Message is required.";
    if (!formData.file) newErrors.file = "Resume file is required.";
    setErrors(newErrors);
    return Object.values(newErrors).every((v) => !v);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData((prev) => ({ ...prev, file }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return;
    setIsSubmitting(true)
    setSuccess(false)
    setTimeout(() => {
      setIsSubmitting(false)
      setSuccess(true)
      setFormData({
        name: "",
        phoneNumber: "",
        email: "",
        message: "",
        file: null
      })
      setErrors({ name: "", phoneNumber: "", email: "", message: "", file: "" })
    }, 1200)
  }

  const isFormComplete =
    formData.name.trim() &&
    formData.phoneNumber.trim() &&
    formData.email.trim() &&
    /^\S+@\S+\.\S+$/.test(formData.email) &&
    formData.message.trim() &&
    formData.file;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-lg w-full p-4 sm:p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-2 text-center">We're here to help you thrive!</h2>
        <p className="text-gray-600 mb-6 text-center">Get in touch</p>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1"
            />
            {errors.name && <div className="text-xs text-red-500 mt-1">{errors.name}</div>}
          </div>

          <div>
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              placeholder="+44 123 456 7890"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              className="mt-1"
            />
            {errors.phoneNumber && <div className="text-xs text-red-500 mt-1">{errors.phoneNumber}</div>}
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1"
            />
            {errors.email && <div className="text-xs text-red-500 mt-1">{errors.email}</div>}
          </div>

          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              name="message"
              placeholder="Tell us how we can help..."
              value={formData.message}
              onChange={handleChange}
              className="min-h-[120px] mt-1"
              required
            />
            {errors.message && <div className="text-xs text-red-500 mt-1">{errors.message}</div>}
          </div>

          <div>
            <Label htmlFor="file">Upload Resume (PDF, DOCX, etc.)</Label>
            <Input
              id="file"
              name="file"
              type="file"
              accept=".pdf,.doc,.docx,.txt,.rtf"
              onChange={handleFileChange}
              className="mt-1"
            />
            {formData.file && (
              <div className="text-xs text-gray-500 mt-1">Selected: {formData.file.name}</div>
            )}
            {errors.file && <div className="text-xs text-red-500 mt-1">{errors.file}</div>}
          </div>

          {success && (
            <div className="text-green-500 text-sm text-center">Thank you for your message! We'll get back to you soon.</div>
          )}

          <div className="pt-2">
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || !isFormComplete}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
