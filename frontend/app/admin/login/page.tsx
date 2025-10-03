"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function AdminLogin() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Admin Access</h2>
          <p className="mt-2 text-gray-600">Sign in with your Google account</p>
        </div>
        <Button
          onClick={() => signIn("google", { callbackUrl: "/admin/dashboard" })}
          className="w-full bg-amber-600 hover:bg-amber-700"
        >
          Sign in with Google
        </Button>
      </div>
    </div>
  );
}
