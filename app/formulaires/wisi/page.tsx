'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { wisiSchema } from '@/server/schema'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

// Composants d'interface utilisateur améliorés
function Input({ label, name, value, onChange, type = 'text', error, ...rest }: any) {
  return (
    <div className="space-y-2 relative group">
      <label className="block text-sm font-medium text-gray-700 group-hover:text-[#006B3F] transition-colors duration-200">{label}</label>
      <div className="relative">
        <input
          name={name}
          value={value}
          onChange={onChange}
          type={type}
          className={`w-full rounded-md border ${error ? 'border-red-500' : 'border-gray-300'} 
          shadow-sm focus:border-[#006B3F] focus:ring-2 focus:ring-[#006B3F]/20 transition-all duration-300
          px-4 py-3 outline-none hover:border-[#006B3F]/70
          ${value ? 'bg-white' : 'bg-gray-50'}`}
          {...rest}
        />
        {type === 'date' && !value && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>
      <AnimatePresence>
        {error && (
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="text-red-500 text-xs mt-1 absolute"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

function Select({ label, name, value, onChange, options, error, ...rest }: any) {
  return (
    <div className="space-y-2 relative group">
      <label className="block text-sm font-medium text-gray-700 group-hover:text-[#006B3F] transition-colors duration-200">{label}</label>
      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full rounded-md border appearance-none ${error ? 'border-red-500' : 'border-gray-300'} 
          shadow-sm focus:border-[#006B3F] focus:ring-2 focus:ring-[#006B3F]/20 transition-all duration-300
          px-4 py-3 outline-none hover:border-[#006B3F]/70 pr-10
          ${value ? 'bg-white' : 'bg-gray-50'}`}
          {...rest}
        >
          {options.map((opt: any) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
      <AnimatePresence>
        {error && (
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="text-red-500 text-xs mt-1 absolute"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function WISIFormStepper() {
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  
  // Utilisation de Zod pour la validation
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    watch,
    trigger
  } = useForm({
    resolver: zodResolver(wisiSchema),
    mode: 'onChange'
  })

  const formData = watch()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setValue(name as any, value, { shouldValidate: true })
  }

  const wiziSubmit = async (data: any) => {
    setIsSubmitting(true)
    
    try {
      const res = await fetch('/api/wisi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const json = await res.json()

      if (json.success) {
        toast.success('Formulaire soumis avec succès !')
        router.push('/dashboard')
      } else {
        toast.error(json.error || 'Erreur lors de la soumission.')
      }
    } catch (e) {
      console.error('Erreur wisi', e)
      toast.error("Une erreur est survenue lors de la soumission du formulaire")
    } finally {
      setIsSubmitting(false)
    }
  }

  const validateStep = async (stepNumber: number) => {
    let fieldsToValidate: string[] = []
    
    switch (stepNumber) {
      case 1:
        fieldsToValidate = ['nom', 'prenom', 'dateNaissance', 'lieuNaissance', 'adresse', 'telephone']
        break
      case 2:
        fieldsToValidate = ['email', 'typeHandicap', 'niveauEtude', 'situationFamiliale', 'nombreEnfants', 'profession']
        break
      case 3:
        fieldsToValidate = ['revenuMensuel', 'besoins']
        break
    }
    
    const result = await trigger(fieldsToValidate as any)
    return result
  }

  const nextStep = async () => {
    const isValid = await validateStep(step)
    if (isValid) {
      setStep(prev => prev + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      toast.error("Veuillez corriger les erreurs avant de continuer")
    }
  }
  
  const prevStep = () => {
    setStep(prev => prev - 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Animation variants améliorés
  const variants = {
    enter: { opacity: 0, x: 50, scale: 0.98 },
    center: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0, x: -50, scale: 0.98 }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-gray-100">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl w-full mx-auto bg-white rounded-xl shadow-xl p-8 overflow-hidden"
      >
        <h1 className="text-3xl font-bold text-[#006B3F] text-center mb-2">Formulaire WISI</h1>
        <p className="text-gray-600 text-center mb-6">Étape {step} sur 3</p>
        
        {/* Indicateur de progression amélioré */}
        <div className="relative mb-8">
          <div className="flex justify-between mb-2">
            {[1, 2, 3].map((stepNumber) => (
              <motion.div 
                key={stepNumber}
                animate={{ 
                  color: step >= stepNumber ? '#006B3F' : '#9CA3AF',
                  fontWeight: step === stepNumber ? 600 : 400
                }}
                className="text-xs font-medium flex flex-col items-center"
              >
                <motion.div 
                  animate={{ 
                    backgroundColor: step >= stepNumber ? '#006B3F' : '#E5E7EB',
                    scale: step === stepNumber ? 1.2 : 1
                  }}
                  transition={{ duration: 0.3 }}
                  className="w-6 h-6 rounded-full mb-1 flex items-center justify-center text-white text-xs"
                >
                  {stepNumber}
                </motion.div>
                Étape {stepNumber}
              </motion.div>
            ))}
          </div>
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-gray-200">
            <motion.div
              animate={{ width: `${(step / 3) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[#006B3F]"
            ></motion.div>
          </div>
        </div>

        <form onSubmit={handleSubmit(wiziSubmit)} className="space-y-6">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial="enter"
                animate="center"
                exit="exit"
                variants={variants}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="bg-[#006B3F] text-white w-7 h-7 rounded-full flex items-center justify-center mr-2 text-sm">1</span>
                  Informations personnelles
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input 
                    label="Nom" 
                    value={formData.nom} 
                    error={errors.nom?.message as string} 
                    {...register('nom')} 
                    onChange={handleChange} 
                  />
                  <Input 
                    label="Prénom" 
                    value={formData.prenom} 
                    error={errors.prenom?.message as string} 
                    {...register('prenom')} 
                    onChange={handleChange} 
                  />
                  <Input 
                    label="Date de naissance" 
                    type="date" 
                    value={formData.dateNaissance} 
                    error={errors.dateNaissance?.message as string} 
                    {...register('dateNaissance')} 
                    onChange={handleChange} 
                  />
                  <Input 
                    label="Lieu de naissance" 
                    value={formData.lieuNaissance} 
                    error={errors.lieuNaissance?.message as string} 
                    {...register('lieuNaissance')} 
                    onChange={handleChange} 
                  />
                  <Input 
                    label="Adresse" 
                    value={formData.adresse} 
                    error={errors.adresse?.message as string} 
                    {...register('adresse')} 
                    onChange={handleChange} 
                  />
                  <Input 
                    label="Téléphone" 
                    type="tel" 
                    value={formData.telephone} 
                    error={errors.telephone?.message as string} 
                    {...register('telephone')} 
                    onChange={handleChange} 
                  />
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial="enter"
                animate="center"
                exit="exit"
                variants={variants}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="bg-[#006B3F] text-white w-7 h-7 rounded-full flex items-center justify-center mr-2 text-sm">2</span>
                  Situation personnelle
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input 
                    label="Email" 
                    type="email" 
                    value={formData.email} 
                    error={errors.email?.message as string} 
                    {...register('email')} 
                    onChange={handleChange} 
                  />
                  <Select
                    label="Type de handicap"
                    value={formData.typeHandicap}
                    error={errors.typeHandicap?.message as string}
                    {...register('typeHandicap')}
                    onChange={handleChange}
                    options={[
                      { value: '', label: 'Sélectionnez un type' },
                      { value: 'moteur', label: 'Handicap moteur' },
                      { value: 'visuel', label: 'Handicap visuel' },
                      { value: 'auditif', label: 'Handicap auditif' },
                      { value: 'mental', label: 'Handicap mental' },
                      { value: 'autre', label: 'Autre' }
                    ]}
                  />
                  <Input 
                    label="Niveau d'étude" 
                    value={formData.niveauEtude} 
                    error={errors.niveauEtude?.message as string} 
                    {...register('niveauEtude')} 
                    onChange={handleChange} 
                  />
                  <Select
                    label="Situation familiale"
                    value={formData.situationFamiliale}
                    error={errors.situationFamiliale?.message as string}
                    {...register('situationFamiliale')}
                    onChange={handleChange}
                    options={[
                      { value: '', label: 'Sélectionnez une situation' },
                      { value: 'celibataire', label: 'Célibataire' },
                      { value: 'marie', label: 'Marié(e)' },
                      { value: 'divorce', label: 'Divorcé(e)' },
                      { value: 'veuf', label: 'Veuf/Veuve' }
                    ]}
                  />
                  <Input 
                    label="Nombre d'enfants" 
                    type="number" 
                    value={formData.nombreEnfants} 
                    error={errors.nombreEnfants?.message as string} 
                    {...register('nombreEnfants')} 
                    onChange={handleChange} 
                  />
                  <Input 
                    label="Profession" 
                    value={formData.profession} 
                    error={errors.profession?.message as string} 
                    {...register('profession')} 
                    onChange={handleChange} 
                  />
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial="enter"
                animate="center"
                exit="exit"
                variants={variants}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="bg-[#006B3F] text-white w-7 h-7 rounded-full flex items-center justify-center mr-2 text-sm">3</span>
                  Informations complémentaires
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input 
                    label="Revenu mensuel" 
                    type="number" 
                    value={formData.revenuMensuel} 
                    error={errors.revenuMensuel?.message as string} 
                    {...register('revenuMensuel')} 
                    onChange={handleChange} 
                  />
                </div>
                <div className="space-y-2 relative group">
                  <label className="block text-sm font-medium text-gray-700 group-hover:text-[#006B3F] transition-colors duration-200">Besoins spécifiques</label>
                  <textarea
                    {...register('besoins')}
                    name="besoins"
                    value={formData.besoins}
                    onChange={handleChange}
                    rows={4}
                    className={`w-full rounded-lg border ${errors.besoins ? 'border-red-500' : 'border-gray-300'} 
                    shadow-sm focus:border-[#006B3F] focus:ring-2 focus:ring-[#006B3F]/20 transition-all duration-300
                    px-4 py-3 outline-none hover:border-[#006B3F]/70 resize-none
                    ${formData.besoins ? 'bg-white' : 'bg-gray-50'}`}
                    placeholder="Décrivez vos besoins spécifiques..."
                  />
                  <AnimatePresence>
                    {errors.besoins && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="text-red-500 text-xs mt-1"
                      >
                        {errors.besoins.message as string}
                      </motion.p>
                    )}
                  </AnimatePresence>
                  <motion.div 
                    animate={{ 
                      opacity: formData.besoins ? 1 : 0,
                      scale: formData.besoins ? 1 : 0.9
                    }}
                    className="absolute bottom-2 right-2 text-xs text-gray-400"
                  >
                    {formData.besoins?.length || 0} caractères
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-between mt-8">
            {step > 1 && (
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: "#D1D5DB" }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={prevStep}
                className="bg-gray-300 text-gray-800 py-2.5 px-5 rounded-lg hover:bg-gray-400 transition-all duration-200 font-medium flex items-center shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Précédent
              </motion.button>
            )}
            {step < 3 ? (
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: "#005535" }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={nextStep}
                className="ml-auto bg-[#006B3F] text-white py-2.5 px-6 rounded-lg hover:bg-[#005535] transition-all duration-200 font-medium flex items-center shadow-md"
              >
                Suivant
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: "#005535" }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={isSubmitting}
                className="ml-auto bg-[#006B3F] text-white py-2.5 px-6 rounded-lg hover:bg-[#005535] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center font-medium shadow-md"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Traitement...
                  </>
                ) : (
                  <>
                    Soumettre
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </>
                )}
              </motion.button>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  )
}

