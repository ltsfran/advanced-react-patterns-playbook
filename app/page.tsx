'use client';

import { Modal } from '@/components/patterns/01-compound-components/Modal';
import { UserSearch } from '@/components/patterns/02-custom-hooks/UserSearch';

export default function PlaybookPage() {
  return (
    <main className="min-h-screen p-12 bg-gray-50 text-gray-900">
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold">Advanced React Patterns</h1>
        
        {/* Patrón 1: Compound Components */}
        <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">01. Compound Components</h2>
          <p className="text-gray-600 mb-6">
            Ejemplo de un Modal que maneja su propio estado interno usando Context, 
            dando libertad total para reordenar sus elementos.
          </p>

          <Modal>
            <Modal.Open windowName="demo-modal">
              <button 
                type="button"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Abrir Modal de Prueba
              </button>
            </Modal.Open>

            <Modal.Window name="demo-modal">
              <div className="p-2">
                <h3 className="text-lg font-bold text-gray-900 mb-2">¡Arquitectura en acción!</h3>
                <p className="text-gray-600 mb-4">
                  Fíjate cómo este contenido está totalmente desacoplado. No tuvimos que 
                  pasar 20 props al botón ni al contenedor.
                </p>
              </div>
            </Modal.Window>
          </Modal>
        </section>

        {/* Patrón 2: Logic Extraction with Custom Hooks */}
        <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">02. Logic Extraction (Custom Hooks)</h2>
          <p className="text-gray-600 mb-6">
            Componente de presentación puro conectado a <code>useUserSearch</code>, 
            aislando el debounce, manejo de estado asíncrono y cancelación de peticiones con AbortController.
          </p>

          <UserSearch />
        </section>
      </div>
    </main>
  );
}