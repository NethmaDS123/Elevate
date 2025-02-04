"use client";
export default function FAQ() {
  const faqs = [
    {
      question: "How does the resume optimizer work?",
      answer: "Our AI analyzes your resume and provides actionable insights.",
    },
    {
      question: "Is there a free trial?",
      answer: "Yes, we offer a 7-day free trial with all features included.",
    },
    {
      question: "What skills can I learn?",
      answer:
        "Our learning pathways cover a wide range of technical and professional skills.",
    },
  ];

  return (
    <section className="py-20 text-center">
      <h2 className="text-3xl md:text-5xl font-bold mb-12">
        Frequently Asked <span className="text-blue-400">Questions</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
          >
            <h3 className="text-xl font-semibold mb-4 text-blue-400">
              {faq.question}
            </h3>
            <p className="text-gray-300">{faq.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
