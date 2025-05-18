'use client'

import { useState } from 'react'

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('wisi')

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 min-h-screen pt-24">
      <h1 className="text-3xl font-bold mb-8 text-[#006B3F]">Administration FHN</h1>
      
      <div className="mb-8">
        <div className="border-b border-[#FFE5A5]/20">
          <nav className="-mb-px flex space-x-8">
            {['wisi', 'tarii', 'fhn'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  py-4 px-1 border-b-2 font-medium text-sm transition-all duration-300
                  ${activeTab === tab 
                    ? 'border-[#FF8B7B] text-[#FF8B7B]'
                    : 'border-transparent text-[#006B3F] hover:text-[#FF8B7B] hover:border-[#FFE5A5]'}
                `}
              >
                Formulaires {tab.toUpperCase()}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6 border border-[#FFE5A5]/20">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#FFE5A5]/20">
            <thead className="bg-[#006B3F]/5">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#006B3F] uppercase tracking-wider">
                  Nom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#006B3F] uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#006B3F] uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#006B3F] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[#FFE5A5]/20">
              {/* Les données seront chargées dynamiquement ici */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}