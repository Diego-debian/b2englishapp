"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import { PlusCircle, Edit2, Trash2 } from "lucide-react";

/**
 * Page for managing the list of verbs (CRUD operations).  Administrators can
 * create new verbs, edit existing ones and delete those no longer needed.
 * This page fetches the entire verb list on mount and updates state in
 * response to user actions.  All API requests are made against the base URL
 * specified in the NEXT_PUBLIC_API_URL environment variable.
 */
interface Verb {
  id: number;
  infinitive: string;
  past: string;
  participle: string;
  translation: string;
  example_b2: string;
}

const initialForm: Omit<Verb, "id"> = {
  infinitive: "",
  past: "",
  participle: "",
  translation: "",
  example_b2: "",
};

export default function VerbManagementPage() {
  const apiBase = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8001").trim();
  const [verbs, setVerbs] = useState<Verb[]>([]);
  const [formData, setFormData] = useState(initialForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all verbs on initial render
  useEffect(() => {
    async function fetchVerbs() {
      try {
        const res = await fetch(`${apiBase}/verbs`);
        if (!res.ok) {
          throw new Error(`Error al obtener los verbos: HTTP ${res.status}`);
        }
        const data: Verb[] = await res.json();
        setVerbs(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      }
    }
    fetchVerbs();
  }, [apiBase]);

  // Handle input changes for the form
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Reset form to initial state
  const resetForm = () => {
    setFormData(initialForm);
    setEditingId(null);
  };

  // Submit form for create or update
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (editingId === null) {
        // Create new verb
        const res = await fetch(`${apiBase}/verbs`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`No se pudo crear el verbo. HTTP ${res.status}. ${text}`);
        }
        const newVerb: Verb = await res.json();
        setVerbs((prev) => [...prev, newVerb]);
        resetForm();
      } else {
        // Update existing verb
        const res = await fetch(`${apiBase}/verb/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`No se pudo actualizar el verbo. HTTP ${res.status}. ${text}`);
        }
        const updatedVerb: Verb = await res.json();
        setVerbs((prev) => prev.map((v) => (v.id === updatedVerb.id ? updatedVerb : v)));
        resetForm();
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Begin editing an existing verb
  const handleEdit = (verb: Verb) => {
    setEditingId(verb.id);
    // Copy values into form state
    setFormData({
      infinitive: verb.infinitive,
      past: verb.past,
      participle: verb.participle,
      translation: verb.translation,
      example_b2: verb.example_b2,
    });
    // Scroll to top so the form is visible
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Delete a verb by ID
  const handleDelete = async (id: number) => {
    const confirmed = window.confirm("¿Seguro que deseas eliminar este verbo?");
    if (!confirmed) return;
    try {
      const res = await fetch(`${apiBase}/verb/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`No se pudo eliminar el verbo. HTTP ${res.status}. ${text}`);
      }
      setVerbs((prev) => prev.filter((v) => v.id !== id));
      if (editingId === id) {
        resetForm();
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <main className="max-w-5xl mx-auto p-4">
      <div className="mb-4">
        <Link href="/dashboard" className="text-blue-600 hover:underline">
          ← Volver al panel
        </Link>
      </div>
      <h2 className="text-3xl font-semibold mb-4">Gestión de Verbos</h2>
      {/* Form for creating/updating verbs */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md mb-8 grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div>
          <label htmlFor="infinitive" className="block text-sm font-medium mb-1">
            Infinitivo
          </label>
          <input
            id="infinitive"
            name="infinitive"
            type="text"
            value={formData.infinitive}
            onChange={handleChange}
            required
            className="w-full border-gray-300 border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label htmlFor="past" className="block text-sm font-medium mb-1">
            Pasado simple
          </label>
          <input
            id="past"
            name="past"
            type="text"
            value={formData.past}
            onChange={handleChange}
            required
            className="w-full border-gray-300 border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label htmlFor="participle" className="block text-sm font-medium mb-1">
            Participio
          </label>
          <input
            id="participle"
            name="participle"
            type="text"
            value={formData.participle}
            onChange={handleChange}
            required
            className="w-full border-gray-300 border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label htmlFor="translation" className="block text-sm font-medium mb-1">
            Traducción
          </label>
          <input
            id="translation"
            name="translation"
            type="text"
            value={formData.translation}
            onChange={handleChange}
            required
            className="w-full border-gray-300 border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="example_b2" className="block text-sm font-medium mb-1">
            Ejemplo (B2)
          </label>
          <textarea
            id="example_b2"
            name="example_b2"
            value={formData.example_b2}
            onChange={handleChange}
            required
            rows={2}
            className="w-full border-gray-300 border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="md:col-span-2 flex justify-end items-center gap-4 mt-2">
          {editingId !== null ? (
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none"
            >
              Cancelar
            </button>
          ) : null}
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-md text-white bg-gradient-to-r from-green-500 to-blue-500 hover:from-blue-500 hover:to-green-500 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50"
          >
            {editingId === null ? (
              <>
                <PlusCircle className="w-4 h-4" aria-hidden="true" />
                <span>Agregar verbo</span>
              </>
            ) : (
              <>
                <Edit2 className="w-4 h-4" aria-hidden="true" />
                <span>Guardar cambios</span>
              </>
            )}
          </button>
        </div>
      </form>
      {error && (
        <div className="mb-6 p-3 bg-red-100 border border-red-300 rounded-md text-red-800">
          {error}
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Infinitivo</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Pasado</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Participio</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Traducción</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Ejemplo</th>
              <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {verbs.map((v) => (
              <tr key={v.id} className="border-b last:border-b-0 hover:bg-gray-50">
                <td className="px-4 py-2 whitespace-nowrap">{v.infinitive}</td>
                <td className="px-4 py-2 whitespace-nowrap">{v.past}</td>
                <td className="px-4 py-2 whitespace-nowrap">{v.participle}</td>
                <td className="px-4 py-2 whitespace-nowrap">{v.translation}</td>
                <td className="px-4 py-2 whitespace-nowrap max-w-xs break-words">{v.example_b2}</td>
                <td className="px-4 py-2 text-center flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleEdit(v)}
                    className="text-blue-600 hover:text-blue-800"
                    aria-label={`Editar ${v.infinitive}`}
                  >
                    <Edit2 className="w-4 h-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(v.id)}
                    className="text-red-600 hover:text-red-800"
                    aria-label={`Eliminar ${v.infinitive}`}
                  >
                    <Trash2 className="w-4 h-4" aria-hidden="true" />
                  </button>
                </td>
              </tr>
            ))}
            {verbs.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                  No hay verbos registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}