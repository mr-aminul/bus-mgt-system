import { createContext, useContext, useState, type ReactNode } from 'react'
import { OPERATORS, type BusOperator } from '@/data/operators'

interface OperatorContextValue {
  operator: BusOperator;
  setOperatorId: (id: string) => void;
  operators: BusOperator[];
}

const OperatorContext = createContext<OperatorContextValue | null>(null);

export function useOperator() {
  const ctx = useContext(OperatorContext);
  if (!ctx) throw new Error("useOperator must be used within OperatorProvider");
  return ctx;
}

export function OperatorProvider({ children }: { children: ReactNode }) {
  const [operatorId, setOperatorId] = useState(OPERATORS[0].id);
  const operator = OPERATORS.find((o) => o.id === operatorId) ?? OPERATORS[0]

  return (
    <OperatorContext.Provider value={{ operator, setOperatorId, operators: OPERATORS }}>
      {children}
    </OperatorContext.Provider>
  );
}
