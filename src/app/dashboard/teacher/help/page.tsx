'use client';

import React, { useState } from "react";
import {  Phone, Mail, MessageCircle, ChevronDown, ChevronUp } from "lucide-react";

export default function HelpSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const helpItems = [
    {
      icon: Phone,
      title: "Phone Support",
      description: "Call us during business hours (9 AM - 6 PM)",
      action: "Call Now",
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Send us your queries via email",
      action: "Send Email",
    },
  ];

 const faqs = [
  {
    question: "How do I upload course materials for my students?",
    answer:
      "You can upload lecture notes, assignments, and supplementary resources through the Faculty Portal under the 'Courses' section. Select the relevant course and use the 'Upload Materials' option to share content with your students.",
  },
  {
    question: "How do I take attendance for my classes?",
    answer:
      "Attendance can be marked through the Faculty Dashboard in the 'Attendance' section. Select the course and date, then mark students as present, absent, or late. The attendance record is updated in real-time and accessible by students and administrators.",
  },
  {
    question: "How can I evaluate and grade student submissions?",
    answer:
      "Go to the 'Assignments' tab in your Faculty Portal. You can view, evaluate, and provide feedback on student submissions. Grades entered here are automatically synced with the academic record system.",
  },
  {
    question: "How do I apply for academic or casual leave?",
    answer:
      "To apply for leave, navigate to the 'Leave Application' section in the HR Portal. Fill in the required details, upload supporting documents if needed, and submit. You'll receive a notification once your application is reviewed and approved.",
  },
  {
    question: "Where can I access student performance reports?",
    answer:
      "Student performance reports are available in the 'Reports' section of your Faculty Dashboard. You can filter by course, semester, or student ID to view detailed analytics on attendance, grades, and participation.",
  },
  {
    question: "How do I update my faculty profile?",
    answer:
      "You can update your profile by clicking on 'My Profile' in the Faculty Portal. Fields such as qualifications, areas of research, and contact information can be edited. Some changes may require approval from the department head.",
  },
];


  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleAction = (actionType: string) => {
    switch (actionType) {
      case "Send Email":
        window.location.href = "mailto:support@ioi.edu";
        break;
      case "Call Now":
        window.location.href = "tel:+91 80-1234-5678";
        break;
      default:
        break;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Help & Support
        </h2>
        <p className="text-gray-600">
          Get assistance with your academic journey
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {helpItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg border-0 hover:shadow-xl transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Icon className="w-6 h-6 text-[#1B3A6A]" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">
                    {item.title}
                  </h3>
                </div>
                <p className="text-gray-600 mb-4">{item.description}</p>
                <button
                  onClick={() => handleAction(item.action)}
                  className="w-full bg-[#1B3A6A] hover:bg-[#486AA0] text-white py-2 px-4 rounded-lg font-medium transition-colors cursor-pointer ease-in-out duration-300"
                >
                  {item.action}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg border-0">
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6">
            Frequently Asked Questions
          </h3>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-4 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors rounded-lg"
                >
                  <h4 className="font-semibold text-gray-800 pr-4">
                    {faq.question}
                  </h4>
                  {openFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="px-4 pb-4">
                    <p className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg border-0">
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Contact Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Phone className="w-6 h-6 text-[#1B3A6A] mx-auto mb-2" />
              <div className="text-sm text-gray-600">Support Hotline</div>
              <div className="font-semibold text-gray-800">
                +91 80-1234-5678
              </div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Mail className="w-6 h-6 text-[#1B3A6A] mx-auto mb-2" />
              <div className="text-sm text-gray-600">Email Support</div>
              <div className="font-semibold text-gray-800">
                 support@ioi.edu | tech@ioi.edu
              </div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <MessageCircle className="w-6 h-6 text-[#1B3A6A] mx-auto mb-2" />
              <div className="text-sm text-gray-600">Live Chat</div>
              <div className="font-semibold text-gray-800">Available 24/7</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}