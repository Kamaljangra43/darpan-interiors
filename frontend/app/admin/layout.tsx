"use client";

import { SessionProvider } from "next-auth/react";
import { ProjectsProvider } from "@/contexts/projects-context";
import { TestimonialsProvider } from "@/contexts/testimonials-context";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <ProjectsProvider>
        <TestimonialsProvider>{children}</TestimonialsProvider>
      </ProjectsProvider>
    </SessionProvider>
  );
}
