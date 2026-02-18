"use client";

import React, { createContext, useContext } from "react";

interface RamadanContextValue {
  isRamadan: boolean;
}

const RamadanContext = createContext<RamadanContextValue>({ isRamadan: false });

export function RamadanProvider({
  children,
  isRamadan,
}: {
  children: React.ReactNode;
  isRamadan: boolean;
}) {
  return (
    <RamadanContext.Provider value={{ isRamadan }}>
      {children}
    </RamadanContext.Provider>
  );
}

/** Use this hook in any client component to check if Ramadan mode is active */
export function useRamadan() {
  return useContext(RamadanContext);
}
