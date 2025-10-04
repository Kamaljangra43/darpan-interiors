"use client";

import { Button } from "@/components/ui/button";
import { X, Moon, Sun } from "lucide-react";
import { useTheme } from "../contexts/theme-context";

interface SettingsModalProps {
  onClose: () => void;
}

export default function SettingsModal({ onClose }: SettingsModalProps) {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className={`${
          isDarkMode
            ? "bg-gray-900 border border-gray-800"
            : "bg-gradient-to-br from-white via-orange-25 to-white border border-gray-200"
        } rounded-lg p-8 max-w-md w-full shadow-xl`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2
            className={`text-2xl font-light ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Settings
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className={
              isDarkMode
                ? "text-gray-400 hover:text-white hover:bg-gray-800"
                : ""
            }
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-6">
          {/* Dark Mode Toggle */}
          <div>
            <h3
              className={`text-lg font-medium mb-4 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Appearance
            </h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isDarkMode ? (
                  <Moon className="h-5 w-5 text-gray-300" />
                ) : (
                  <Sun className="h-5 w-5 text-amber-600" />
                )}
                <span
                  className={isDarkMode ? "text-gray-300" : "text-gray-700"}
                >
                  {isDarkMode ? "Dark Mode" : "Light Mode"}
                </span>
              </div>
              <button
                onClick={toggleDarkMode}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isDarkMode ? "bg-amber-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isDarkMode ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
