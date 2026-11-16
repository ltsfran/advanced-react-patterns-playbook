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

  // Memorizamos el objeto del contexto para evitar re-renders innecesarios (SonarQube S6481)
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

interface OpenProps {
  children: React.ReactElement<{ onClick?: () => void }>;
  windowName: string;
}

function Open({ children, windowName }: Readonly<OpenProps>) {
  const context = useContext(ModalContext);
  if (!context) throw new Error('Open must be used within a Modal');

  return React.cloneElement(children, {
    onClick: () => {
      // Ejecutamos el onClick original del botón si existía, y luego abrimos el modal
      children.props.onClick?.();
      context.open(windowName);
    },
  });
}

interface WindowProps {
  children: ReactNode;
  name: string;
}

function Window({ children, name }: Readonly<WindowProps>) {
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

Modal.Open = Open;
Modal.Window = Window;