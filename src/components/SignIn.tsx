'use client';
import React, { useState, useEffect } from 'react';
import { signIn, useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Spotlight } from "@/components/ui/Spotlight";

export default function Signin() {
  const [loading, setLoading] = useState(false);
  const { data: session, isPending } = useSession();
  const router = useRouter();

  // Redirect silently if already logged in
  useEffect(() => {
    if (session && !isPending) {
      router.push("/home");
    }
  }, [session, isPending, router]);

  const handleSignIn = async () => {
    console.log("[AUTH] Sign-in button clicked");
    try {
      setLoading(true);

      await signIn.social({
        provider: "google",
        callbackURL: "/home",
      });


    } catch (err) {
      console.error("[AUTH] Sign-in error:", err);
      setLoading(false);
      // Only redirect on actual errors
      router.push("/auth");
    }
  };

  if (isPending) {
    return (
      <div className="flex w-full bg-black min-h-screen items-center justify-center">
        <div className="relative z-10">
          <div className="animate-spin h-5 w-5 border-2 border-white/10 border-t-white rounded-full mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex w-full bg-black min-h-screen items-center justify-center overflow-hidden antialiased bg-grid-white/[0.02]">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />

      <div className="relative z-10 w-full max-w-md mx-auto px-4">
        <div className="p-8 md:p-12">
          <div className="text-center mb-10">
            <h1 className="font-serif text-4xl text-white mb-3 tracking-tight">Minder</h1>
            <p className="text-white/40 text-sm font-light tracking-wide">Welcome back, please sign in to continue</p>
          </div>

          <button
            disabled={loading}
            onClick={handleSignIn}
            className="w-full h-12 bg-white hover:bg-gray-100 text-black rounded-lg font-medium text-sm transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {loading ? (
              <div className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-black rounded-full" />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 256 262"
                className="transition-transform group-hover:scale-105"
              >
                <path
                  fill="#4285F4"
                  d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                />
                <path
                  fill="#34A853"
                  d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                />
                <path
                  fill="#FBBC05"
                  d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"
                />
                <path
                  fill="#EB4335"
                  d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                />
              </svg>
            )}
            <span>{loading ? 'Signing in...' : 'Continue with Google'}</span>
          </button>

          <div className="text-center mt-8">
            <p className="text-white/20 text-[10px] font-medium tracking-[0.2em] uppercase">
              Secure Access
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}