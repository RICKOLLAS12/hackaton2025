'use client'

import { useState } from 'react'
import InputField from '@/components/ui/InputField'

export default function TARIIFormPage() {
  const [formData, setFormData] = useState({
    // Volet administratif - Identification de l'enfant
    nom: '',
    prenom: '',
    dateNaissance: '',
    lieuNaissance: '',
    nationalite: '',
    adresse: '',
    telephone: '',
    email: '',

    // Volet administratif - Mère
    nomMere: '',
    prenomMere: '',
    dateNaissanceMere: '',
    lieuNaissanceMere: '',
    nationaliteMere: '',
    situationFamilialeMere: '',
    situationProfessionnelleMere: '',
    telephoneMere: '',
    telephoneProMere: '',
    emailMere: '',
    mereDécédée: false,
    dateDécèsMere: '',

    // Volet administratif - Père
    nomPere: '',
    prenomPere: '',
    dateNaissancePere: '',
    lieuNaissancePere: '',
    situationFamilialePere: '',
    situationProfessionnellePere: '',
    telephonePere: '',
    telephoneProPere: '',
    emailPere: '',
    pereDécédé: false,
    dateDécèsPere: '',

    // Autorité parentale
    autoriteParentale: '',
    autreAutoriteDetails: '',

    // Date de réception (admin)
    dateReception: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Données TARII:', formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const isCheckbox = type === 'checkbox'
    setFormData(prev => ({
      ...prev,
      [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value
    }))
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 min-h-screen pt-24">
      <div className="bg-white p-6 rounded-xl shadow-lg border border-[#FFE5A5]">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#006B3F] mb-2">Formulaire de renseignement établissement TARII</h1>
          <p className="text-gray-600">
            Votre enfant a été admis dans notre établissement. Afin de nous permettre de mieux le connaître, 
            nous vous invitons à remplir ce dossier de la manière la plus complète possible.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section Identification de l'enfant */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-[#FF8B7B] border-b border-[#FFE5A5] pb-2">
              Identification de l'enfant
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Nom"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                required
              />
              <InputField
                label="Prénom"
                name="prenom"
                value={formData.prenom}
                onChange={handleChange}
                required
              />
              <InputField
                label="Date de naissance"
                name="dateNaissance"
                type="date"
                value={formData.dateNaissance}
                onChange={handleChange}
                required
              />
              <InputField
                label="Lieu de naissance"
                name="lieuNaissance"
                value={formData.lieuNaissance}
                onChange={handleChange}
                required
              />
              <InputField
                label="Nationalité"
                name="nationalite"
                value={formData.nationalite}
                onChange={handleChange}
                required
              />
              <InputField
                label="Adresse"
                name="adresse"
                value={formData.adresse}
                onChange={handleChange}
                required
              />
              <InputField
                label="Téléphone"
                name="telephone"
                type="tel"
                value={formData.telephone}
                onChange={handleChange}
              />
              <InputField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Section Informations sur la mère */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-[#FF8B7B] border-b border-[#FFE5A5] pb-2">
              Informations sur la mère
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Nom"
                name="nomMere"
                value={formData.nomMere}
                onChange={handleChange}
                required
              />
              <InputField
                label="Prénom"
                name="prenomMere"
                value={formData.prenomMere}
                onChange={handleChange}
                required
              />
              <select
                name="situationFamilialeMere"
                value={formData.situationFamilialeMere}
                onChange={handleChange}
                className="form-select rounded-lg border-[#FFE5A5] focus:border-[#FF8B7B] focus:ring-[#FF8B7B]"
                required
              >
                <option value="">Situation familiale</option>
                <option value="celibataire">Célibataire</option>
                <option value="mariee">Mariée</option>
                <option value="pacsee">Pacsée</option>
                <option value="concubinage">En concubinage</option>
                <option value="separee">Séparée</option>
                <option value="divorcee">Divorcée</option>
                <option value="veuve">Veuve</option>
              </select>
              <InputField
                label="Situation professionnelle"
                name="situationProfessionnelleMere"
                value={formData.situationProfessionnelleMere}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Section Informations sur le père */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-[#FF8B7B] border-b border-[#FFE5A5] pb-2">
              Informations sur le père
            </h2>
            {/* Mêmes champs que pour la mère */}
          </div>

          {/* Section Autorité parentale */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-[#FF8B7B] border-b border-[#FFE5A5] pb-2">
              Autorité parentale
            </h2>
            <div className="space-y-4">
              <select
                name="autoriteParentale"
                value={formData.autoriteParentale}
                onChange={handleChange}
                className="form-select rounded-lg border-[#FFE5A5] focus:border-[#FF8B7B] focus:ring-[#FF8B7B]"
                required
              >
                <option value="">Qui détient l'autorité parentale ?</option>
                <option value="pere">Père</option>
                <option value="mere">Mère</option>
                <option value="deux">Père et mère</option>
                <option value="autre">Autre personne</option>
              </select>
              {formData.autoriteParentale === 'autre' && (
                <textarea
                  name="autreAutoriteDetails"
                  value={formData.autreAutoriteDetails}
                  onChange={handleChange}
                  placeholder="Précisez les coordonnées de la personne ou de l'organisme"
                  className="w-full p-2 border border-[#FFE5A5] rounded-lg focus:border-[#FF8B7B] focus:ring-[#FF8B7B]"
                  rows={4}
                />
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#FF8B7B] text-white py-3 px-6 rounded-lg hover:bg-[#FF7B6B] transition-colors font-semibold"
          >
            Soumettre le formulaire
          </button>
        </form>
      </div>

      <div className="mt-4 text-sm text-gray-600 text-center">
        <p>Toutes les informations confidentielles transmises dans ce formulaire ne seront et ne pourront être utilisées à des fins personnelles ou commerciales.</p>
      </div>
    </div>
  )
}