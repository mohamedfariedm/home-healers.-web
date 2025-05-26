"use client";

import { motion } from "framer-motion";
import React, { useState } from "react";

export default function ContactSection() {
  // You can add form state handling here if needed
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add your submit logic here (e.g. API call)
    alert("تم ارسال الرسالة بنجاح!");
  };

  return (
    <motion.div
      className="flex flex-col lg:flex-row gap-14 items-start w-full max-w-[1280px] mx-auto mt-20 px-4 xl:px-0"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Form Container */}
      <motion.div
        className="flex flex-col items-center gap-10 bg-white rounded-xl border border-[#d0d5dd] p-6 md:p-12 w-full"
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#1e1e1e] mb-2">اتصل بنا</h2>
          <p className="text-sm text-[#736b7a]">من فضلك ادخل البيانات التالية لتتمكن من ارسال طلبك</p>
        </div>

        <form className="w-full max-w-[590px] space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label htmlFor="name" className="block text-start text-sm font-medium text-[#1e1e1e]">الاسم</label>
            <input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="bg-white w-full border border-[#d0d5dd] rounded-md px-4 py-3 text-sm text-start"
              placeholder="ادخل الاسم كاملا"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-start text-sm font-medium text-[#1e1e1e]">البريد الالكتروني</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="bg-white w-full border border-[#d0d5dd] rounded-md px-4 py-3 text-sm text-start"
              placeholder="ادخل البريد الالكتروني"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="phone" className="block text-start text-sm font-medium text-[#1e1e1e]">رقم الهاتف</label>
            <div className="flex items-center border border-[#d0d5dd] rounded-md overflow-hidden">
              <div className="bg-[#e8eaf3]/50 px-3 py-2 flex items-center gap-2">
                <img src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-18/SUr7AzvBDd.png" className="w-6 h-6" alt="flag" />
                <span className="text-sm font-medium">+966</span>
              </div>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="bg-white flex-1 px-4 py-3 text-sm text-start"
                placeholder="رقم الهاتف"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="block text-start text-sm font-medium text-[#1e1e1e]">الرسالة</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="w-full bg-white border border-[#d0d5dd] rounded-md px-4 py-3 text-sm text-start h-40"
              placeholder="الرسالة"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#143087] text-white py-3 rounded-md flex justify-center items-center gap-2 hover:bg-[#0f2d6a] transition-colors duration-300"
          >
            <img
              src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-18/XEW1LZHYfx.png"
              className="w-3 h-6"
              alt="arrow icon"
              aria-hidden="true"
            />
            <span className="text-lg font-medium">ارسال رسالتك</span>
          </button>
        </form>
      </motion.div>

      {/* Contact Info */}
      <motion.div
        className="flex flex-col gap-8 w-full lg:max-w-[538px]"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
      >
        {[
          {
            icon: "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-18/fxFV5KXUD4.png",
            title: "قم بزيارتنا",
            description: "الرياض - شارع الامير عبدالعزيز بن مساعد بن جلوي",
          },
          {
            icon: "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-18/RKCBiHeaWM.png",
            title: "أرسلنا عبر الايميل",
            description: "customer.service@home-healers.com",
          },
          {
            icon: "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-18/pyxgUkH7d4.png",
            title: "قم بالاتصال بنا",
            description: "0551172232",
          },
        ].map(({ icon, title, description }, i) => (
          <motion.div
    key={i}
    className="flex flex-col gap-2 bg-[#143087] rounded-xl p-8 text-white cursor-pointer"
    whileHover={{ scale: 1.05, boxShadow: "0 8px 20px rgba(98, 160, 246, 0.5)" }}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
  >
    <div className="flex gap-4 items-center">
      <div className="w-14 h-14 bg-[#62a0f6] rounded-md flex items-center justify-center">
        <img src={icon} alt={`${title} icon`} className="w-5 h-5" />
      </div>
      <div className="flex flex-col items-start text-start gap-2">
        <span className="text-lg lg:text-2xl font-semibold">{title}</span>
        <span className="text-sm lg:text-base">{description}</span>
      </div>
    </div>
  </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
