'use client';

import { Modal } from '@/components/patterns/01-compound-components/Modal';

export default function PlaybookPage() {
  return (
    <main className="min-h-screen p-12 bg-gray-50 text-gray-900">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Advanced React Patterns</h1>
        
        <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">01. Compound Components</h2>
          <p className="text-gray-600 mb-6">
            Ejemplo de un Modal que maneja su propio estado interno usando Context, 
            dando libertad total para reordenar sus elementos.
          </p>

          {/* Aquí aplicamos la magia del Compound Component */}
          <Modal>
            {/* El gatillador */}
            <Modal.Open windowName="demo-modal">
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                Abrir Modal de Prueba
              </button>
            </Modal.Open>

            {/* El contenido (puedes poner lo que quieras aquí adentro) */}
            <Modal.Window name="demo-modal">
              <div className="p-2">
                <h3 className="text-lg font-bold text-gray-900 mb-2">¡Arquitectura en acción!</h3>
                <p className="text-gray-600 mb-4">
                  Fíjate cómo este contenido está totalmente desacoplado. No tuvimos que 
                  pasar 20 props al botón ni al contenedor.
                </p>
                <div className="flex justify-end">
                  <button 
                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition"
                    // Nota: El botón de cerrar principal (la X) ya viene en el componente Window,
                    // pero aquí el usuario podría agregar sus propios botones de acción.
                  >
                    Confirmar
                  </button>
                </div>
              </div>
            </Modal.Window>
          </Modal>

        </section>
      </div>
    </main>
  );
}