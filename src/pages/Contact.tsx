import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // ==========================================
  // 🟢 GOOGLE APPS SCRIPT CONFIGURATION 🟢
  // Replace this URL with your deployed Web App URL from Google Apps Script
  // ==========================================
  const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzCLMpa_du8Weizlq4jIYAjdYsjADc9dw5UYzNIOfJrViR6yZP55vAnrAhpAtro1oBeww/exec";
  // ==========================================

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();



    setIsSubmitting(true);

    const submitData = new FormData();
    submitData.append("Full Name", formData.name);
    submitData.append("Email", formData.email);
    submitData.append("Subject", formData.subject);
    submitData.append("Message", formData.message);

    try {
      // Direct POST to the Google Apps Script Web App
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        body: submitData
      });

      const result = await response.json();

      if (result.result === 'success') {
        setIsSuccess(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
        toast.success('Message sent successfully!');

        // Reset success message after 5 seconds
        setTimeout(() => setIsSuccess(false), 5000);
      } else {
        throw new Error(result.error || "Unknown error occurred");
      }
    } catch (error) {
      console.error("Error submitting form", error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="text-4xl font-bold text-violet-900">Contact Us</h1>
          <p className="mt-4 text-gray-600">We'd love to hear from you. Reach out to us for any queries.</p>
          <div className="mx-auto mt-4 h-1 w-24 bg-amber-500" />
        </div>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Contact Info & Map */}
          <div>
            <div className="mb-12 space-y-8">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-violet-900">Address</h3>
                  <p className="text-gray-600">Vignan Institute of Technology and Science,<br />Deshmukhi(V), Yadadri Bhuvanagiri(Dist),<br />Telangana - 508284</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Phone size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-violet-900">Phone</h3>
                  <p className="text-gray-600">+91 9876543210</p>
                  <p className="text-gray-600">+91 040 2345678</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-violet-900">Email</h3>
                  <p className="text-gray-600">hod.cseds@vignanits.ac.in</p>
                  <p className="text-gray-600">info@vignanits.ac.in</p>
                </div>
              </div>
            </div>

            {/* Map Embed */}
            <div className="h-64 w-full overflow-hidden rounded-2xl bg-gray-200 shadow-inner">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3808.571448657152!2d78.7441!3d17.3361!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb986f33888889%3A0x6b84705760894767!2sVignan%20Institute%20of%20Technology%20and%20Science!5e0!3m2!1sen!2sin!4v1625567890123!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                title="Google Maps"
              ></iframe>
            </div>
          </div>

          {/* Contact Form */}
          <div className="rounded-2xl bg-white p-8 shadow-lg border border-gray-50">
            <h3 className="mb-6 text-2xl font-bold text-violet-900">Send a Message</h3>

            {isSuccess ? (
              <div className="flex h-64 flex-col items-center justify-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <CheckCircle2 size={32} />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900">Message Sent!</h4>
                  <p className="text-gray-500">Thank you for reaching out. We will get back to you soon.</p>
                </div>
                <button
                  onClick={() => setIsSuccess(false)}
                  className="mt-4 text-sm font-bold text-violet-900 hover:text-violet-700 underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-violet-900 focus:outline-none"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-violet-900 focus:outline-none"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-violet-900 focus:outline-none"
                    placeholder="Admission Query"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Message</label>
                  <textarea
                    rows={5}
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-violet-900 focus:outline-none"
                    placeholder="How can we help you?"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-violet-900 py-3 font-bold text-white transition-all hover:bg-violet-800 disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send size={18} />
                      Send Message
                    </span>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
