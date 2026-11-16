'use client';

import React, { createContext, useContext, useState, useMemo, useCallback, ReactNode } from 'react';

interface ModalContextType {
  openName: string;
  close: () => void;
  open: (name: string) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function Modal({ children }: Readonly<{ children: ReactNode }>) {
  const [openName, setOpenName] = useState('');

  const close = useCallback(() => setOpenName(''), []);
  const open = useCallback((name: string) => setOpenName(name), []);

  const contextValue = useMemo(
    () => ({ openName, close, open }),
    [openName, close, open]
  );

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
    </ModalContext.Provider>
  );
}

interface OpenProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  children: ReactNode;
  windowName: string;
}

export function ModalOpen({
  children,
  windowName,
  onClick,
  ...rest
}: Readonly<OpenProps>) {
  const context = useContext(ModalContext);
  if (!context) throw new Error('Open must be used within a Modal');

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    context.open(windowName);
  };

  return (
    <button type="button" onClick={handleClick} {...rest}>
      {children}
    </button>
  );
}

interface WindowProps {
  children: ReactNode;
  name: string;
}

export function ModalWindow({ children, name }: Readonly<WindowProps>) {
  const context = useContext(ModalContext);
  if (!context) throw new Error('Window must be used within a Modal');

  if (name !== context.openName) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg relative text-black min-w-75">
        <button
          type="button"
          aria-label="Close modal"
          className="absolute top-2 right-4 font-bold text-gray-500 hover:text-gray-800"
          onClick={context.close}
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}
