
import React, { useState } from 'react';
import { Phone, MessageCircle, Book, ChevronDown, ChevronRight } from 'lucide-react';

const HelpPage: React.FC = () => {
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const faqs = [
    {
      id: '1',
      question: 'How do I log my symptoms?',
      answer: 'Go to the Symptoms tab and tap on the symptom you\'re experiencing. Use the slider to indicate severity, then tap "Save & Return Home".'
    },
    {
      id: '2',
      question: 'What if I forget to take my medication?',
      answer: 'Don\'t worry! You can still mark it as taken later, or use the "Postpone" button to set a reminder for later.'
    },
    {
      id: '3',
      question: 'How do I share my data with my doctor?',
      answer: 'Visit the Records tab and use the "Export Records" feature to generate a summary you can share with your healthcare provider.'
    },
    {
      id: '4',
      question: 'Is my health data secure?',
      answer: 'Yes, all your health information is encrypted and stored securely. We never share your personal data without your explicit consent.'
    }
  ];

  const toggleFaq = (id: string) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-wellness-calm-800 mb-2">
            We're here to help
          </h1>
          <p className="text-wellness-calm-600 text-lg">
            Find answers or get in touch with our support team
          </p>
        </div>

        {/* Contact Options */}
        <div className="grid grid-cols-1 gap-4 mb-8">
          <button className="ojas-card hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-4 p-6">
            <div className="w-12 h-12 rounded-full bg-wellness-green/10 flex items-center justify-center">
              <Phone className="w-6 h-6 text-wellness-green" />
            </div>
            <div className="text-left">
              <h3 className="text-lg font-medium text-wellness-calm-800">Call Support</h3>
              <p className="text-wellness-calm-600">Available 9 AM - 5 PM EST</p>
            </div>
          </button>

          <button className="ojas-card hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-4 p-6">
            <div className="w-12 h-12 rounded-full bg-wellness-blue/10 flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-wellness-blue" />
            </div>
            <div className="text-left">
              <h3 className="text-lg font-medium text-wellness-calm-800">Live Chat</h3>
              <p className="text-wellness-calm-600">Get instant help online</p>
            </div>
          </button>
        </div>

        {/* FAQ Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Book className="w-6 h-6 text-wellness-calm-600" />
            <h2 className="text-xl font-semibold text-wellness-calm-800">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map(faq => (
              <div key={faq.id} className="ojas-card">
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full flex items-center justify-between text-left"
                >
                  <h3 className="text-lg font-medium text-wellness-calm-800 pr-4">
                    {faq.question}
                  </h3>
                  {expandedFaq === faq.id ? (
                    <ChevronDown className="w-5 h-5 text-wellness-calm-600 flex-shrink-0" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-wellness-calm-600 flex-shrink-0" />
                  )}
                </button>
                {expandedFaq === faq.id && (
                  <div className="mt-4 pt-4 border-t border-wellness-calm-200">
                    <p className="text-wellness-calm-700 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Quick Tips */}
        <div className="ojas-card bg-wellness-green/5 border-wellness-green/20">
          <h3 className="text-lg font-semibold text-wellness-calm-800 mb-3">
            💡 Quick Tip
          </h3>
          <p className="text-wellness-calm-700 leading-relaxed">
            For the best experience, try to log your symptoms and medications at consistent times each day. This helps create more meaningful patterns in your health data.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
