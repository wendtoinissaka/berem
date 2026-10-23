"use client";

import { useSearchParams } from "next/navigation";

export default function DevisFeedback() {
  const searchParams = useSearchParams();
  const result = searchParams.get("result");

  if (!result) return null;

  const messages: Record<
    string,
    { title: string; description: string; className: string }
  > = {
    success: {
      title: "Demande envoyée !",
      description:
        "Votre demande a bien été enregistrée. Merci de votre confiance.",
      className: "border-green-200 bg-green-50 text-green-800",
    },
    invalid: {
      title: "Informations à vérifier",
      description:
        "Certains champs sont manquants ou incorrects. Vérifiez le formulaire puis réessayez.",
      className: "border-amber-200 bg-amber-50 text-amber-800",
    },
    error: {
      title: "Envoi impossible",
      description:
        "Une erreur est survenue lors de l'enregistrement. Veuillez réessayer plus tard.",
      className: "border-red-200 bg-red-50 text-red-800",
    },
  };

  const message = messages[result];

  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`mb-6 rounded-xl border p-5 ${message.className}`}
    >
      <h3 className="font-bold">{message.title}</h3>
      <p className="mt-2 text-sm leading-6">{message.description}</p>
    </div>
  );
}