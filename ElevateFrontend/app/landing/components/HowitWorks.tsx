"use client";
export default function HowItWorks() {
  const steps = [
    {
      title: "Sign Up",
      description: "Create your profile and define your career goals.",
    },
    {
      title: "Analyze",
      description:
        "Receive detailed analysis of your resume, skills, and career gaps.",
    },
    {
      title: "Learn",
      description:
        "Follow personalized pathways to master industry-leading skills.",
    },
    {
      title: "Land the Job",
      description:
        "Ace your interviews and transition into your dream role with confidence.",
    },
  ];

  return (
    <section className="py-20 text-center">
      <h2 className="text-3xl md:text-5xl font-bold mb-12">
        How <span className="text-blue-400">Elevate</span> Works
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-6">
        {steps.map((step, index) => (
          <div
            key={index}
            className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
          >
            <h3 className="text-xl font-semibold mb-4 text-blue-400">
              {index + 1}. {step.title}
            </h3>
            <p className="text-gray-300">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
