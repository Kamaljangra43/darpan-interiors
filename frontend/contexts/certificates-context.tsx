"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface Certificate {
  _id: string;
  title: string;
  issuingOrganization: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  description?: string;
  image?: {
    url: string;
    publicId?: string;
  };
  holderName?: string;
  category?: "company" | "professional" | "safety" | "quality" | "other";
  isActive: boolean;
  displayOrder: number;
}

interface CertificatesContextType {
  certificates: Certificate[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const CertificatesContext = createContext<CertificatesContextType | undefined>(
  undefined
);

export const useCertificates = () => {
  const context = useContext(CertificatesContext);
  if (!context) {
    throw new Error(
      "useCertificates must be used within a CertificatesProvider"
    );
  }
  return context;
};

interface CertificatesProviderProps {
  children: ReactNode;
}

export const CertificatesProvider = ({
  children,
}: CertificatesProviderProps) => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const response = await fetch(
        `${API_BASE_URL}/certificates?isActive=true`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch certificates");
      }

      const data = await response.json();
      setCertificates(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching certificates:", err);
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      setCertificates([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const value: CertificatesContextType = {
    certificates,
    loading,
    error,
    refetch: fetchCertificates,
  };

  return (
    <CertificatesContext.Provider value={value}>
      {children}
    </CertificatesContext.Provider>
  );
};
