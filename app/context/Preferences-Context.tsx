"use client";
import { createContext, useContext, useState, useEffect } from "react";

type Preferences = {
  interest: string;
  contentStyle: string;
};

type PreferencesContextType = {
  preferences: Preferences;
  setPreferences: (prefs: Preferences) => void;
};

const PreferencesContext = createContext<PreferencesContextType | null>(null);

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [preferences, setPreferences] = useState<Preferences>({
    interest: "basketball",
    contentStyle: "concise",
  });

  useEffect(() => {
    const stored = localStorage.getItem("userPreferences");
    if (stored) setPreferences(JSON.parse(stored));
  }, []);

  const updatePreferences = (prefs: Preferences) => {
    setPreferences(prefs);
    localStorage.setItem("userPreferences", JSON.stringify(prefs));
  };

  return (
    <PreferencesContext.Provider value={{ preferences, setPreferences: updatePreferences }}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const ctx = useContext(PreferencesContext);
  if (!ctx) throw new Error("usePreferences must be used inside PreferencesProvider");
  return ctx;
}
