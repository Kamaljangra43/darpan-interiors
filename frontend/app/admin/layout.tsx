"use client";

import { SessionProvider } from "next-auth/react";
import { ProjectsProvider } from "@/contexts/projects-context";
import { TestimonialsProvider } from "@/contexts/testimonials-context";
import { StatsProvider } from "@/contexts/stats-context";
import { ServicesProvider } from "@/contexts/services-context";
import { AboutProvider } from "@/contexts/about-context";
import { SiteImagesProvider } from "@/contexts/site-images-context";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <ProjectsProvider>
        <TestimonialsProvider>
          <StatsProvider>
            <ServicesProvider>
              <AboutProvider>
                <SiteImagesProvider>{children}</SiteImagesProvider>
              </AboutProvider>
            </ServicesProvider>
          </StatsProvider>
        </TestimonialsProvider>
      </ProjectsProvider>
    </SessionProvider>
  );
}
