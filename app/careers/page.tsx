"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import Header from "@/components/ui/header"
import Footer from "@/components/footer"

export default function CareersForm() {
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    message: "",
    position: "",
    file: null as File | null
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    message: "",
    position: "",
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
    const newErrors: typeof errors = { name: "", phoneNumber: "", email: "", message: "", position: "", file: "" };
    if (!formData.name.trim()) newErrors.name = "Full Name is required.";
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = "Phone Number is required.";
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "Invalid email address.";
    if (!formData.position.trim()) newErrors.position = "Position is required.";
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return;
    setIsSubmitting(true)
    setSuccess(false)
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("phone", formData.phoneNumber);
      data.append("position", formData.position);
      data.append("resume", formData.file as File);
      // Optionally include message if your backend supports it
      data.append("message", formData.message);
      const response = await fetch("http://13.61.105.209/api/careers", {
        method: "POST",
        body: data
      });
      if (!response.ok) throw new Error("Failed to submit");
      setSuccess(true)
      setFormData({
        name: "",
        phoneNumber: "",
        email: "",
        message: "",
        position: "",
        file: null
      })
      setErrors({ name: "", phoneNumber: "", email: "", message: "", position: "", file: "" })
    } catch (err) {
      setErrors((prev) => ({ ...prev, file: "Submission failed. Please try again." }))
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormComplete =
    formData.name.trim() &&
    formData.phoneNumber.trim() &&
    formData.email.trim() &&
    /^\S+@\S+\.\S+$/.test(formData.email) &&
    formData.position.trim() &&
    formData.message.trim() &&
    formData.file;

  return (
    <>
    <Header />
      <div className="min-h-screen flex items-center justify-center bg-white py-12">
      <div className="max-w-lg w-full p-4 sm:p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-2 text-center">Join us in shaping the future of AI-powered beauty and wellness!</h2>
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
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                name="position"
                placeholder="Software Engineer"
                value={formData.position}
                onChange={handleChange}
                required
                className="mt-1"
              />
              {errors.position && <div className="text-xs text-red-500 mt-1">{errors.position}</div>}
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

            <div className="text-xs text-gray-500 text-center mb-2">
              We may not have active openings at the moment, we welcome you to submit your resume for future opportunities in marketing, customer service, backend development, and frontend development. If a position aligns with your skills and expertise, we'll be sure to reach out.
            </div>

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
         <Footer />
         </>
  )
}
