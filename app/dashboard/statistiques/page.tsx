'use client'

import { useState, useEffect } from 'react'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'

// Types pour les statistiques
type StatItem = {
  label: string
  value: number
  color: string
}

type UserRole = 'ADMIN' | 'STAFF' | 'PARENT' | 'ANALYSTE'

type DossierStats = {
  total: number
  enCours: number
  acceptes: number
  enAttente: number
  rejetes: number
}

export default function StatistiquesPage() {
  const [userStats, setUserStats] = useState<StatItem[]>([])
  const [dossierStats, setDossierStats] = useState<DossierStats>({
    total: 0,
    enCours: 0,
    acceptes: 0,
    enAttente: 0,
    rejetes: 0
  })
  const [loading, setLoading] = useState(true)
  const [userRole, setUserRole] = useState<UserRole | null>(null)
  
  // Couleurs pour les graphiques
  const COLORS = ['#006B3F', '#FFE5A5', '#FF8B7B', '#4299E1', '#9F7AEA']
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        
        // Récupérer le rôle de l'utilisateur depuis le localStorage
        const userData = localStorage.getItem('user')
        if (userData) {
          const user = JSON.parse(userData)
          setUserRole(user.role as UserRole)
        }
        
        // Récupérer les statistiques des utilisateurs (pour les admins)
        const userStatsResponse = await fetch('/api/stats/users')
        const userStatsData = await userStatsResponse.json()
        setUserStats(userStatsData)
        
        // Récupérer les statistiques des dossiers
        const dossierStatsResponse = await fetch('/api/stats/dossiers')
        const dossierStatsData = await dossierStatsResponse.json()
        setDossierStats(dossierStatsData)
      } catch (error) {
        console.error('Erreur lors du chargement des statistiques:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchStats()
  }, [])
  
  // Convertir les statistiques de dossiers en format pour le graphique
  const dossierChartData = [
    { name: 'En cours', value: dossierStats.enCours, color: '#4299E1' },
    { name: 'Acceptés', value: dossierStats.acceptes, color: '#006B3F' },
    { name: 'En attente', value: dossierStats.enAttente, color: '#FFE5A5' },
    { name: 'Rejetés', value: dossierStats.rejetes, color: '#FF8B7B' }
  ]
  
  // Données pour le graphique d'évolution mensuelle (simulées)
  const monthlyData = [
    { name: 'Jan', dossiers: 12, utilisateurs: 5 },
    { name: 'Fév', dossiers: 19, utilisateurs: 8 },
    { name: 'Mar', dossiers: 25, utilisateurs: 12 },
    { name: 'Avr', dossiers: 32, utilisateurs: 15 },
    { name: 'Mai', dossiers: 40, utilisateurs: 20 },
    { name: 'Juin', dossiers: 45, utilisateurs: 25 }
  ]
  
  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-10 bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#006B3F]"></div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen pt-24 pb-10 bg-gray-50">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-[#006B3F] mb-8">Statistiques</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Carte des statistiques globales */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Aperçu des dossiers</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-blue-600">{dossierStats.total}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600">Acceptés</p>
                <p className="text-2xl font-bold text-green-600">{dossierStats.acceptes}</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600">En attente</p>
                <p className="text-2xl font-bold text-yellow-600">{dossierStats.enAttente}</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600">Rejetés</p>
                <p className="text-2xl font-bold text-red-600">{dossierStats.rejetes}</p>
              </div>
            </div>
          </div>
          
          {/* Graphique camembert des dossiers */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Répartition des dossiers</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dossierChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {dossierChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        {/* Graphique d'évolution mensuelle */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Évolution mensuelle</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="dossiers" fill="#006B3F" name="Dossiers" />
                <Bar dataKey="utilisateurs" fill="#FF8B7B" name="Nouveaux utilisateurs" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Section réservée aux administrateurs */}
        {userRole === 'ADMIN' && (
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Statistiques des utilisateurs</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {userStats.map((stat, index) => (
                <div key={index} className={`${stat.color.replace('bg-', 'bg-').replace('500', '50')} p-4 rounded-lg text-center`}>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className={`text-2xl font-bold ${stat.color.replace('bg-', 'text-')}`}>{stat.value}</p>
                </div>
              ))}
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={userStats}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ label, percent }) => `${label} ${(percent * 100).toFixed(0)}%`}
                  >
                    {userStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color.replace('bg-', '#').replace('blue-500', '4299E1').replace('green-500', '48BB78').replace('yellow-500', 'ECC94B').replace('purple-500', '9F7AEA')} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}