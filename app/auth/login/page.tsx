'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema } from '@/server/schema'
import { connectUser } from '@/server/data'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  })

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const SignIn = async (data: { email: string; nom?: string; prenom?: string; telephone?: string; password: string }) => {
    if (!data.email || !data.password) {
      setError("Identifiants incorrects, veuillez réessayer");
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const con = await connectUser(data.email, data.password);
      
      if (con.user?.password === data.password) {
        // Stocker les informations utilisateur dans localStorage
        localStorage.setItem('user', JSON.stringify({
          id: con.user?.id,
          nom: con.user?.nom || data.nom,
          prenom: con.user?.prenom || data.prenom,
          email: data.email,
          role: con.user?.role
        }));
        
        // Appel API pour créer une session côté serveur
        const res = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        
        const result = await res.json();
        
        if (result.success) {
          // Messages personnalisés selon le rôle
          switch (con.user?.role) {
            case "ADMIN":
              toast.success('Connexion réussie. Bienvenue dans votre espace administrateur !', {
                duration: 5000,
                position: 'top-center',
              });
              setTimeout(() => router.push('/dashboard/admin'), 2000); // Augmenté à 2 secondes
              break;
            case "PARENT":
              toast.success('Connexion réussie. Bienvenue dans votre espace parent !', {
                duration: 5000,
                position: 'top-center',
              });
              setTimeout(() => router.push('/dashboard/parent'), 1000);
              break;
            case "STAFF":
              toast.success('Connexion réussie. Bienvenue dans votre espace secrétariat !', {
                duration: 5000,
                position: 'top-center',
              });
              setTimeout(() => router.push('/dashboard/secretaire'), 1000);
              break;
            case "ANALYSTE":
              toast.success('Connexion réussie. Bienvenue dans votre espace d\'analyse !', {
                duration: 5000,
                position: 'top-center',
              });
              setTimeout(() => router.push('/dashboard'), 1000);
              break;
            default:
              toast.success('Connexion réussie. Bienvenue dans votre espace personnel !', {
                duration: 5000,
                position: 'top-center',
              });
              setTimeout(() => router.push('/dashboard'), 1000);
          }
        } else {
          setError(result.message || 'Identifiants incorrects');
        }
      } else {
        setError("Identifiants incorrects");
      }
    } catch (e) {
      setError('Une erreur est survenue lors de la connexion');
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen pt-24 flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="relative w-20 h-20">
              <Image 
                src="/images/logo.png" 
                alt="Logo Fondation Horizons Nouveaux" 
                fill
                className="object-contain"
              />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-[#006B3F]">Connexion</h2>
          <p className="mt-2 text-sm text-gray-600">
            Accédez à votre espace personnel
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(SignIn)}>
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
              <p className="text-red-700">{error}</p>
            </div>
          )}
          
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">Adresse email</label>
              <input
                id="email"
                {...register('email')}
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-[#006B3F] focus:border-[#006B3F] focus:z-10 sm:text-sm"
                placeholder="Adresse email"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="sr-only">Mot de passe</label>
              <input
                id="password"
                {...register('password')}
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-[#006B3F] focus:border-[#006B3F] focus:z-10 sm:text-sm"
                placeholder="Mot de passe"
              />
            </div>
          </div>
          
          {errors.password?.message && (
            <p className="mt-1 text-red-500 text-sm">{errors.password?.message}</p>
          )}
          
          {errors.email?.message && (
            <p className="mt-1 text-red-500 text-sm">{errors.email?.message}</p>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-[#006B3F] focus:ring-[#006B3F] border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Se souvenir de moi
              </label>
            </div>

            <div className="text-sm">
              <Link href="/auth/forgot-password" className="font-medium text-[#FF8B7B] hover:text-[#FF7B6B]">
                Mot de passe oublié?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#006B3F] hover:bg-[#005535] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#006B3F] ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Connexion en cours...' : 'Se connecter'}
            </button>
          </div>
        </form>
        
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Vous n'avez pas de compte?{' '}
            <Link href="/auth/register" className="font-medium text-[#FF8B7B] hover:text-[#FF7B6B]">
              Créer un compte
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
