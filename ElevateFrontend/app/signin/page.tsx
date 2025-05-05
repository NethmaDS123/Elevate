"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

// Function to render the sign-in page content
function SignInPageContent() {
  const router = useRouter();
  const { status } = useSession();
  const searchParams = useSearchParams();
  const callbackUrl =
    searchParams.get("callbackUrl") || "/platform/features/dashboard";
  const [isLoading, setIsLoading] = useState(false);

  // Effect to handle redirect after successful authentication
  useEffect(() => {
    if (status === "authenticated") {
      router.push(callbackUrl);
    }
  }, [status, callbackUrl, router]);

  // Function to handle sign-in with Google
  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn("google", { callbackUrl });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      {/* Animated Background Elements */}
      <motion.div
        className="absolute top-20 left-40 w-96 h-96 bg-purple-200 rounded-full blur-3xl opacity-30"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 right-40 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-30"
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 4, repeat: Infinity, delay: 1 }}
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl backdrop-blur-lg border border-gray-100"
      >
        <div className="p-8">
          <div className="flex flex-col items-center space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold text-gray-900">
                <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Elevate
                </span>
              </h1>
              <p className="text-gray-500">
                Unlock your career potential with Elevate
              </p>
            </div>
            {/* Google Sign-In Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSignIn}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-xl bg-white border border-gray-200 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
              ) : (
                <>
                  <Image
                    src="/googlelogo.png"
                    alt="Google logo"
                    width={20}
                    height={20}
                    className="w-5 h-5"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Continue with Google
                  </span>
                </>
              )}
            </motion.button>
            {/* Divider */}
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500 text-sm">
                  More options coming soon
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* Footer */}
        <div className="bg-gray-50/80 rounded-b-2xl p-4 text-center border-t border-gray-100">
          <p className="text-sm text-gray-500">
            By continuing, you agree to our{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Terms
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

// Function to wrap the sign-in page content with a suspense fallback
export default function SignInPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInPageContent />
    </Suspense>
  );
}
