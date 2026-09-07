"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

export interface ConsultationModalOptions {
  defaultService?: string;
  defaultPlan?: string;
  source?: string;
}

interface ConsultationModalContextType {
  isOpen: boolean;
  options: ConsultationModalOptions;
  openConsultationModal: (options?: ConsultationModalOptions) => void;
  closeConsultationModal: () => void;
}

const ConsultationModalContext = createContext<ConsultationModalContextType | undefined>(undefined);

export function ConsultationModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConsultationModalOptions>({});

  const openConsultationModal = useCallback((opts: ConsultationModalOptions = {}) => {
    setOptions(opts);
    setIsOpen(true);
  }, []);

  const closeConsultationModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <ConsultationModalContext.Provider
      value={{
        isOpen,
        options,
        openConsultationModal,
        closeConsultationModal,
      }}
    >
      {children}
    </ConsultationModalContext.Provider>
  );
}

export function useConsultationModal() {
  const context = useContext(ConsultationModalContext);
  if (!context) {
    throw new Error("useConsultationModal must be used within a ConsultationModalProvider");
  }
  return context;
}
