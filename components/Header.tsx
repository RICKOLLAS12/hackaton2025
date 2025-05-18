'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'

// Types pour améliorer la maintenabilité
type MenuItem = {
  name: string
  path: string
}

type User = {
  id: number
  nom: string
  prenom: string
  email: string
  role: string
  avatar?: string
}

const FORM_ITEMS: MenuItem[] = [
  { name: 'WISI', path: '/formulaires/wisi' },
  { name: 'TARII', path: '/formulaires/tarii' },
  { name: 'FHN', path: '/formulaires/fhn' }
]

// Liens du dashboard selon le rôle
const DASHBOARD_LINKS: Record<string, MenuItem[]> = {
  ADMIN: [
    { name: 'Tableau de bord', path: '/dashboard' },
    { name: 'Utilisateurs', path: '/dashboard/utilisateurs' },
    { name: 'Dossiers', path: '/dashboard/dossiers' },
    { name: 'Statistiques', path: '/dashboard/statistiques' }
  ],
  STAFF: [
    { name: 'Tableau de bord', path: '/dashboard' },
    { name: 'Dossiers', path: '/dashboard/dossiers' },
    { name: 'Formulaires', path: '/dashboard/formulaires' },
    { name: 'Statistiques', path: '/dashboard/statistiques' }
  ],
  PARENT: [
    { name: 'Tableau de bord', path: '/dashboard' },
    { name: 'Mes dossiers', path: '/dashboard/mes-dossiers' },
    { name: 'Mes formulaires', path: '/dashboard/mes-formulaires' },
    { name: 'Statistiques', path: '/dashboard/statistiques' }
  ],
  ANALYSTE: [
    { name: 'Tableau de bord', path: '/dashboard' },
    { name: 'Analyses', path: '/dashboard/analyses' },
    { name: 'Rapports', path: '/dashboard/rapports' },
    { name: 'Statistiques', path: '/dashboard/statistiques' }
  ]
}

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const isDashboard = pathname.startsWith('/dashboard')

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)

    // Amélioration de la vérification d'authentification
    const checkAuth = () => {
      try {
        const userData = localStorage.getItem('user')

        if (userData) {
          const parsedUser = JSON.parse(userData)
          setUser(parsedUser)
          setIsLoggedIn(true)
        } else {
          // Ne pas déconnecter automatiquement si aucun utilisateur n'est trouvé
          // Cela permet de conserver l'état de connexion même après un rafraîchissement
          setUser(null)
          setIsLoggedIn(false)
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de l\'authentification:', error)
        // Ne pas déconnecter en cas d'erreur, juste logger l'erreur
      }
    }

    checkAuth()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Vérifier l'authentification à chaque changement de route
  useEffect(() => {
    const checkAuthOnRouteChange = () => {
      try {
        const userData = localStorage.getItem('user')

        if (userData) {
          const parsedUser = JSON.parse(userData)
          setUser(parsedUser)
          setIsLoggedIn(true)
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de l\'authentification:', error)
      }
    }

    checkAuthOnRouteChange()
    setIsMobileMenuOpen(false)
    setShowProfileMenu(false)
  }, [pathname])

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`)
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
    } finally {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      setUser(null)
      setIsLoggedIn(false)
      setShowProfileMenu(false)
      router.push('/')
    }
  }

  // Obtenir les liens du dashboard en fonction du rôle de l'utilisateur
  const getDashboardLinks = () => {
    if (!user || !user.role) return DASHBOARD_LINKS.PARENT;
    return DASHBOARD_LINKS[user.role] || DASHBOARD_LINKS.PARENT;
  }

  const dashboardLinks = getDashboardLinks();

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${
      isDashboard
        ? 'bg-[#006B3F]/95 backdrop-blur-sm shadow-lg py-2'
        : isScrolled
          ? 'bg-white/95 backdrop-blur-sm shadow-lg py-2'
          : 'bg-[#FF8B7B]/90 py-4'
    }`}>
      <nav className="container mx-auto px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center group">
              <div className="relative w-14 h-14 mr-3">
                <Image
                  src="/images/logo.png"
                  alt="Fondation Horizons Nouveaux"
                  fill
                  className="object-contain transition-transform duration-300 group-hover:scale-105"
                  priority
                />
              </div>
              <div>
                <h1 className={`text-xl font-bold ${isDashboard ? 'text-white' : isScrolled ? 'text-[#006B3F]' : 'text-white'}`}>
                  {isDashboard ? 'Dashboard' : 'Fondation'}
                </h1>
                <p className="text-xs text-[#FFE5A5]">
                  {isDashboard ? (user?.role || 'Utilisateur') : 'Horizons Nouveaux'}
                </p>
              </div>
            </Link>
          </div>

          {/* Navigation desktop */}
          <div className="hidden md:flex items-center space-x-8">
            {isDashboard ? (
              // Liens du dashboard
              <>
                {dashboardLinks.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`relative group text-white ${isActive(item.path) ? 'font-semibold' : ''}`}
                  >
                    <span>{item.name}</span>
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FFE5A5] transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                ))}
                <Link
                  href="/"
                  className="relative group text-white"
                >
                  <span>Retour au site</span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FFE5A5] transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </>
            ) : (
              // Navigation standard
              <>
                <Link
                  href="/"
                  className={`relative group ${
                    isScrolled ? 'text-[#006B3F]' : 'text-white'
                  } ${isActive('/') ? 'font-semibold' : ''}`}
                >
                  <span>Accueil</span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FFE5A5] transition-all duration-300 group-hover:w-full"></span>
                </Link>
                {isLoggedIn && (
                  <Link 
                    href="/dashboard" 
                    className={`relative group ${
                      isScrolled ? 'text-[#006B3F]' : 'text-white'
                    } ${isActive('/dashboard') ? 'font-semibold' : ''}`}
                  >
                    <span>Tableau de bord</span>
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FFE5A5] transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                )}
                {isLoggedIn && FORM_ITEMS.map((item) => (
                  <Link
                    key={item.name}
                    href={item.path}
                    className={`relative group ${
                      isScrolled ? 'text-[#006B3F]' : 'text-white'
                    } ${isActive(item.path) ? 'font-semibold' : ''}`}
                  >
                    <span>Formulaire {item.name}</span>
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FFE5A5] transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                ))}
              </>
            )}

            {/* Afficher le bouton de connexion ou le profil utilisateur */}
            {!isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <Link
                  href="/auth/login"
                  className={`relative group ${
                    isDashboard ? 'text-white' : isScrolled ? 'text-[#006B3F]' : 'text-white'
                  } ${isActive('/auth/login') ? 'font-semibold' : ''}`}
                >
                  <span>Se connecter</span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FFE5A5] transition-all duration-300 group-hover:w-full"></span>
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-[#006B3F] text-white px-6 py-2 rounded-full hover:bg-[#005535] transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  S'inscrire
                </Link>
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-[#FFE5A5]">
                    <Image
                      src={user?.avatar || "/images/avatar-placeholder.jpg"}
                      alt="Photo de profil"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className={`${isDashboard ? 'text-white' : isScrolled ? 'text-[#006B3F]' : 'text-white'}`}>
                    {user?.prenom} {user?.nom}
                  </span>
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 animate-fadeIn">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Mon compte
                    </Link>
                    <Link
                      href="/dossiers"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Mes dossiers
                    </Link>
                    {!isDashboard && isLoggedIn && (
                      <Link
                        href={user?.role === "ADMIN"
                          ? "/dashboard/admin"
                          : user?.role === "PARENT"
                            ? "/dashboard/parent"
                            : user?.role === "STAFF"
                              ? "/dashboard/secretaire"
                              : user?.role === "ANALYSTE"
                                ? "/dashboard"
                                : "/dashboard"
                        }
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Tableau de bord
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Se déconnecter
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bouton menu mobile */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Menu"
          >
            {isMobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Menu mobile */}
        {isMobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 space-y-4 animate-fadeIn">
            {isDashboard ? (
              // Menu mobile pour le dashboard
              <>
                {dashboardLinks.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`block py-2 text-white hover:text-[#FFE5A5] transition-colors ${
                      isActive(item.path) ? 'font-semibold' : ''
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
                <Link
                  href="/"
                  className="block py-2 text-white hover:text-[#FFE5A5] transition-colors"
                >
                  Retour au site
                </Link>
              </>
            ) : (
              // Menu mobile standard
              <>
                <Link
                  href="/"
                  className={`block py-2 ${
                    isScrolled ? 'text-[#006B3F]' : 'text-white'
                  } hover:text-[#FFE5A5] transition-colors ${
                    isActive('/') ? 'font-semibold' : ''
                  }`}
                >
                  Accueil
                </Link>
                {isLoggedIn && (
                  <Link
                    href="/dashboard"
                    className={`block py-2 ${
                      isScrolled ? 'text-[#006B3F]' : 'text-white'
                    } hover:text-[#FFE5A5] transition-colors ${
                      isActive('/dashboard') ? 'font-semibold' : ''
                    }`}
                  >
                    Tableau de bord
                  </Link>
                )}
                {isLoggedIn && FORM_ITEMS.map((item) => (
                  <Link
                    key={item.name}
                    href={item.path}
                    className={`block py-2 ${
                      isScrolled ? 'text-[#006B3F]' : 'text-white'
                    } hover:text-[#FFE5A5] transition-colors ${
                      isActive(item.path) ? 'font-semibold' : ''
                    }`}
                  >
                    Formulaire {item.name}
                  </Link>
                ))}
              </>
            )}

            {/* Afficher les options de connexion ou le profil utilisateur en mobile */}
            {!isLoggedIn ? (
              <>
                <Link
                  href="/auth/login"
                  className={`block py-2 ${
                    isDashboard ? 'text-white' : isScrolled ? 'text-[#006B3F]' : 'text-white'
                  } hover:text-[#FFE5A5] transition-colors ${
                    isActive('/auth/login') ? 'font-semibold' : ''
                  }`}
                >
                  Se connecter
                </Link>
                <Link
                  href="/auth/register"
                  className="block bg-[#006B3F] text-white px-4 py-2 rounded-md hover:bg-[#005535] transition-colors text-center"
                >
                  S'inscrire
                </Link>
              </>
            ) : (
              <>
                <div className="flex items-center py-2">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-[#FFE5A5] mr-2">
                    <Image
                      src={user?.avatar || "/images/avatar-placeholder.jpg"}
                      alt="Photo de profil"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className={`${isDashboard ? 'text-white' : isScrolled ? 'text-[#006B3F]' : 'text-white'} font-semibold`}>
                    {user?.prenom} {user?.nom}
                  </span>
                </div>
                <Link
                  href="/profile"
                  className={`block py-2 pl-10 ${
                    isDashboard ? 'text-white' : isScrolled ? 'text-[#006B3F]' : 'text-white'
                  } hover:text-[#FFE5A5] transition-colors`}
                >
                  Mon compte
                </Link>
                <Link
                  href="/dossiers"
                  className={`block py-2 pl-10 ${
                    isDashboard ? 'text-white' : isScrolled ? 'text-[#006B3F]' : 'text-white'
                  } hover:text-[#FFE5A5] transition-colors`}
                >
                  Mes dossiers
                </Link>
                {!isDashboard && isLoggedIn && (
                  <Link
                    href={user?.role === "ADMIN"
                      ? "/dashboard/admin"
                      : user?.role === "PARENT"
                        ? "/dashboard/parent"
                        : user?.role === "STAFF"
                          ? "/dashboard/secretaire"
                          : user?.role === "ANALYSTE"
                            ? "/dashboard"
                            : "/dashboard"
                    }
                    className={`block py-2 pl-10 ${
                      isScrolled ? 'text-[#006B3F]' : 'text-white'
                    } hover:text-[#FFE5A5] transition-colors`}
                  >
                    Tableau de bord
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className={`block py-2 pl-10 text-left w-full ${
                    isDashboard ? 'text-red-300' : isScrolled ? 'text-red-600' : 'text-red-300'
                  } hover:text-red-500 transition-colors`}
                >
                  Se déconnecter
                </button>
              </>
            )}
          </nav>
        )}
      </nav>
    </header>
  )
}