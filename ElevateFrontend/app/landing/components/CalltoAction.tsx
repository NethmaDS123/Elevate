"use client";
export default function CallToAction() {
  return (
    <section className="py-20 text-center">
      <h2 className="text-3xl md:text-5xl font-bold mb-8">
        Ready to <span className="text-blue-400">Elevate</span> Your Career?
      </h2>
      <button
        onClick={() => alert("Navigating to sign-up...")}
        className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-12 rounded-full text-lg font-semibold shadow-lg transition-transform hover:scale-105 focus:ring-4 focus:ring-blue-300"
      >
        Get Started
      </button>
    </section>
  );
}
