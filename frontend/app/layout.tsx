import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "@/contexts/auth-context";
import { ThemeProvider } from "@/contexts/theme-context";
import { ProjectsProvider } from "@/contexts/projects-context";
import { TestimonialsProvider } from "@/contexts/testimonials-context";
import "./globals.css";

export const metadata = {
  title: "Darpan Interiors - Transforming Spaces, Creating Dreams",
  description: "Professional interior design services",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <ThemeProvider>
            <ProjectsProvider>
              <TestimonialsProvider>{children}</TestimonialsProvider>
            </ProjectsProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
