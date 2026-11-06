"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { FiMail, FiPhone, FiTruck, FiClock, FiUser, FiSend, FiMessageSquare, FiLoader, FiCheckCircle, FiMapPin, FiArrowRight, FiHeadphones, FiPaperclip, FiCalendar, FiGlobe } from "react-icons/fi";
import { BsShieldCheck, BsLightningCharge } from "react-icons/bs";
import { FaWhatsapp, FaTelegramPlane } from "react-icons/fa";

export default function ContactPage() {
  const [form, setForm] = useState({ 
    name: "", 
    email: "", 
    phone: "",
    subject: "", 
    message: ""
  });
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [siteSettings, setSiteSettings] = useState({});
  const [focusedField, setFocusedField] = useState(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => setSiteSettings(data.settings || {}))
      .catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSent(true);
        setForm({ 
          name: "", 
          email: "", 
          phone: "",
          subject: "", 
          message: ""
        });
        toast.success("Message sent successfully!");
      } else {
        toast.error("Failed to send message.");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const contactCards = [
    {
      icon: <FiMail className="w-5 h-5" />,
      label: "Email Support",
      value: siteSettings.contactEmail || "orders@buyetomidateproducts.com",
      desc: "Response within 2 hours",
      color: "from-[#10b981]/20 to-[#10b981]/5",
      href: `mailto:${siteSettings.contactEmail || "orders@buyetomidateproducts.com"}`,
    },
    {
      icon: <FiPhone className="w-5 h-5" />,
      label: "Priority Line",
      value: siteSettings.contactPhone || "+19852913802",
      desc: "24/7 Emergency support",
      color: "from-blue-500/20 to-blue-500/5",
      href: `tel:${siteSettings.contactPhone || "+19852913802"}`,
    },
    {
      icon: <FaWhatsapp className="w-5 h-5" />,
      label: "WhatsApp",
      value: "+1 (985) 291-3802",
      desc: "Chat with us instantly",
      color: "from-green-500/20 to-green-500/5",
      href: "https://wa.me/19852913802",
    },
    {
      icon: <FaTelegramPlane className="w-5 h-5" />,
      label: "Telegram",
      value: "@biggestsup",
      desc: "Message us on Telegram",
      color: "from-sky-500/20 to-sky-500/5",
      href: "https://t.me/biggestsup",
    },
  ];

  const trustBadges = [
    { icon: <BsShieldCheck className="w-4 h-4" />, text: "Encrypted & Secure" },
    { icon: <BsLightningCharge className="w-4 h-4" />, text: "Quick Response" },
    { icon: <FiHeadphones className="w-4 h-4" />, text: "24/7 Support" },
  ];

  const inputCls = "w-full bg-[#0d0d0d] border border-[#1e1e1e] text-white rounded-xl pl-11 pr-4 py-3.5 text-sm transition-all duration-300 placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#10b981]/50 focus:border-[#10b981]/50 focus:bg-[#111]";
  const selectCls = "w-full bg-[#0d0d0d] border border-[#1e1e1e] text-white rounded-xl px-4 py-3.5 text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#10b981]/50 focus:border-[#10b981]/50 focus:bg-[#111] cursor-pointer";

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#10b981]/5 via-transparent to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#10b981]/5 rounded-full blur-[120px]" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-2xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-[#10b981]/10 border border-[#10b981]/20 text-[#10b981] text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
              <FiMessageSquare className="w-3.5 h-3.5" />
              Get in Touch
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
              Connect With <span className="text-[#10b981]">BuyEtomidateProducts</span>
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed">
              Premium quality products, exceptional service, and worldwide delivery. Our specialists are ready to assist with your needs.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Contact Cards */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {contactCards.map((card, i) => (
            <motion.a
              key={card.label}
              href={card.href}
              target={card.href?.startsWith("http") ? "_blank" : undefined}
              rel={card.href?.startsWith("http") ? "noopener noreferrer" : undefined}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="group relative bg-[#111] border border-[#1e1e1e] rounded-2xl p-5 hover:border-[#10b981]/30 transition-all duration-300 cursor-pointer"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${card.color} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              <div className="relative">
                <div className="w-10 h-10 bg-[#1a1a1a] border border-[#262626] rounded-xl flex items-center justify-center text-[#10b981] mb-3 group-hover:bg-[#10b981]/10 group-hover:border-[#10b981]/30 transition-all">
                  {card.icon}
                </div>
                <h3 className="text-sm font-bold text-white mb-0.5">{card.label}</h3>
                <p className="text-sm text-[#10b981] font-medium mb-1">{card.value}</p>
                <p className="text-xs text-gray-500">{card.desc}</p>
              </div>
            </motion.a>
          ))}
        </div>
      </div>

      {/* Main Content — Form + Side Panel */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* Form — takes 3 cols */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-[#111] border border-[#10b981]/20 rounded-3xl p-12 text-center"
                >
                  <div className="w-20 h-20 bg-[#10b981]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FiCheckCircle className="w-10 h-10 text-[#10b981]" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                  <p className="text-gray-400 mb-6 max-w-sm mx-auto">
                    Thank you for reaching out. Our team will get back to you within 48 hours.
                  </p>
                  <button
                    onClick={() => setSent(false)}
                    className="inline-flex items-center gap-2 bg-[#10b981] hover:bg-[#059669] text-black font-semibold px-6 py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-[#10b981]/25"
                  >
                    Send Another Message
                    <FiArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  onSubmit={handleSubmit}
                  className="bg-[#111] border border-[#1e1e1e] rounded-3xl p-8 md:p-10"
                >
                  <h2 className="text-xl font-bold text-white mb-1">Send us a message</h2>
                  <p className="text-sm text-gray-500 mb-8">Fill in the form below and we&apos;ll respond as soon as possible.</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Full Name *</label>
                      <div className="relative group">
                        <FiUser className={`absolute left-3.5 top-4 w-4 h-4 transition-colors duration-300 ${focusedField === "name" ? "text-[#10b981]" : "text-gray-600"}`} />
                        <input
                          type="text"
                          placeholder="Your full name"
                          required
                          value={form.name}
                          onFocus={() => setFocusedField("name")}
                          onBlur={() => setFocusedField(null)}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className={inputCls}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Email Address *</label>
                      <div className="relative">
                        <FiMail className={`absolute left-3.5 top-4 w-4 h-4 transition-colors duration-300 ${focusedField === "email" ? "text-[#10b981]" : "text-gray-600"}`} />
                        <input
                          type="email"
                          placeholder="your@email.com"
                          required
                          value={form.email}
                          onFocus={() => setFocusedField("email")}
                          onBlur={() => setFocusedField(null)}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          className={inputCls}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mb-5">
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Phone Number</label>
                    <div className="relative">
                      <FiPhone className={`absolute left-3.5 top-4 w-4 h-4 transition-colors duration-300 ${focusedField === "phone" ? "text-[#10b981]" : "text-gray-600"}`} />
                      <input
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        value={form.phone}
                        onFocus={() => setFocusedField("phone")}
                        onBlur={() => setFocusedField(null)}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className={inputCls}
                      />
                    </div>
                  </div>

                  <div className="mb-5">
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Subject *</label>
                    <div className="relative">
                      <FiMessageSquare className={`absolute left-3.5 top-4 w-4 h-4 transition-colors duration-300 ${focusedField === "subject" ? "text-[#10b981]" : "text-gray-600"}`} />
                      <input
                        type="text"
                        placeholder="How can we help you?"
                        required
                        value={form.subject}
                        onFocus={() => setFocusedField("subject")}
                        onBlur={() => setFocusedField(null)}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        className={inputCls}
                      />
                    </div>
                  </div>

                  <div className="mb-8">
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Message *</label>
                    <div className="relative">
                      <FiSend className={`absolute left-3.5 top-4 w-4 h-4 transition-colors duration-300 ${focusedField === "message" ? "text-[#10b981]" : "text-gray-600"}`} />
                      <textarea
                        placeholder="Please provide detailed information about your inquiry..."
                        required
                        rows={6}
                        value={form.message}
                        onFocus={() => setFocusedField("message")}
                        onBlur={() => setFocusedField(null)}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        className={`${inputCls} resize-none`}
                      />
                      <div className="absolute bottom-3 right-3 text-xs text-gray-500">
                        {form.message.length}/1000 characters
                      </div>
                    </div>
                  </div>

                  
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#10b981] to-[#059669] hover:from-[#059669] hover:to-[#047857] disabled:opacity-50 text-black font-bold py-4 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-[#10b981]/25 text-base"
                  >
                    {submitting ? (
                      <FiLoader className="w-5 h-5 animate-spin" />
                    ) : (
                      <FiSend className="w-5 h-5" />
                    )}
                    {submitting ? "Sending..." : "Send Message"}
                  </button>

                  {/* Trust badges below button */}
                  <div className="flex items-center justify-center gap-6 mt-5">
                    {trustBadges.map((badge) => (
                      <div key={badge.text} className="flex items-center gap-1.5 text-gray-500">
                        <span className="text-[#10b981]">{badge.icon}</span>
                        <span className="text-[11px] font-medium">{badge.text}</span>
                      </div>
                    ))}
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* Side Panel — takes 2 cols */}
          <div className="lg:col-span-2 space-y-6">
            {/* FAQ shortcuts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="bg-[#111] border border-[#1e1e1e] rounded-3xl p-8"
            >
              <h3 className="text-lg font-bold text-white mb-5">Common Questions</h3>
              <div className="space-y-4">
                {[
                  { q: "How long does shipping take?", a: "Orders are processed within 48h. Standard delivery takes 3–7 business days within Europe." },
                  { q: "Do you offer bulk pricing?", a: "Yes! Contact us with your requirements and we'll provide a custom quote for large orders." },
                  { q: "Is shipping discreet?", a: "Absolutely. All packages are shipped in plain, unmarked packaging with no product references." },
                  { q: "What payment methods do you accept?", a: "We accept bank transfer, cryptocurrency, and other methods. Details are provided after order confirmation." },
                ].map((item, i) => (
                  <div key={i} className="border-b border-[#1a1a1a] pb-4 last:border-0 last:pb-0">
                    <h4 className="text-sm font-semibold text-[#10b981] mb-1">{item.q}</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">{item.a}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Response time card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="bg-gradient-to-br from-[#10b981]/10 to-[#10b981]/5 border border-[#10b981]/20 rounded-3xl p-8 text-center"
            >
              <div className="w-14 h-14 bg-[#10b981]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FiClock className="w-7 h-7 text-[#10b981]" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Fast Response Time</h3>
              <p className="text-sm text-gray-400 mb-4">Average reply within</p>
              <div className="text-4xl font-extrabold text-[#10b981] mb-1">&lt; 2 Hours</div>
              <p className="text-xs text-gray-500">during business hours</p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
