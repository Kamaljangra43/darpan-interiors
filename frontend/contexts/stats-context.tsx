"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { statsService } from "@/lib/services/statsService";

interface Stat {
  _id?: string;
  label: string;
  value: string;
  icon?: string;
  order: number;
}

interface StatsContextType {
  stats: Stat[];
  addStat: (stat: Omit<Stat, "_id">) => Promise<void>;
  updateStat: (id: string, stat: Partial<Stat>) => Promise<void>;
  deleteStat: (id: string) => Promise<void>;
  loading: boolean;
}

const StatsContext = createContext<StatsContextType | undefined>(undefined);

export function StatsProvider({ children }: { children: React.ReactNode }) {
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await statsService.getAllStats();
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const addStat = async (stat: Omit<Stat, "_id">) => {
    try {
      const newStat = await statsService.createStat(stat);
      setStats((prev) => [...prev, newStat]);
    } catch (error) {
      console.error("Error adding stat:", error);
      throw error;
    }
  };

  const updateStat = async (id: string, stat: Partial<Stat>) => {
    try {
      const updated = await statsService.updateStat(id, stat);
      setStats((prev) => prev.map((s) => (s._id === id ? updated : s)));
    } catch (error) {
      console.error("Error updating stat:", error);
      throw error;
    }
  };

  const deleteStat = async (id: string) => {
    try {
      await statsService.deleteStat(id);
      setStats((prev) => prev.filter((s) => s._id !== id));
    } catch (error) {
      console.error("Error deleting stat:", error);
      throw error;
    }
  };

  return (
    <StatsContext.Provider
      value={{ stats, addStat, updateStat, deleteStat, loading }}
    >
      {children}
    </StatsContext.Provider>
  );
}

export function useStats() {
  const context = useContext(StatsContext);
  if (!context) {
    throw new Error("useStats must be used within StatsProvider");
  }
  return context;
}
