import Image from 'next/image'
import Link from 'next/link'
import HelpButton from '@/components/HelpButton'
import AuthButton from '@/components/AuthButton'

export default function Home() {
  return (
    <div className="min-h-screen pt-16 md:pt-24"> {/* Réduction du padding-top sur mobile */}
       {/* Hero Section */}
       <section className="relative py-12 md:py-0 min-h-[500px] md:h-screen md:min-h-[100px] md:max-h-[900px] bg-gray-50"> 
        <div className="container mx-auto px-4 h-full flex items-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="space-y-4 md:space-y-8 mt-8 md:mt-0"> 
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-[#006B3F]"></div>
                  <div className="w-8 h-8 rounded-full bg-[#FF8B7B]"></div>
                  <div className="w-8 h-8 rounded-full bg-[#FFE5A5]"></div>
                </div>
                <span className="text-gray-600">+3000 enfants accompagnés</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#006B3F]"> 
                Offrons à chaque enfant une chance de réussir ! 
              </h1>
              
              <p className="text-lg md:text-xl text-gray-600"> 
                Une solution digitale pensée pour faciliter le lien entre les familles et la Fondation Horizons Nouveaux dans le suivi des enfants en situation de handicap. 
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <AuthButton 
                  href="/formulaires/wisi"
                  className="bg-[#FF8B7B] text-white px-8 py-4 rounded-full text-lg hover:bg-[#FF7B6B] transition-all duration-300 transform hover:scale-105 hover:shadow-lg font-semibold"
                >
                  Donation
                </AuthButton>
                <Link 
                  href="/about"
                  className="bg-[#006B3F] text-white px-8 py-4 rounded-full text-lg hover:bg-[#005535] transition-all duration-300 transform hover:scale-105 hover:shadow-lg font-semibold"
                >
                  Soumettre un dossier
                </Link>
              </div>
            </div>
            
            <div className="relative w-full h-[500px] md:h-[600px] lg:h-[500px] mt-8 md:mt-0">
              <div className="relative h-full w-full">
                <div className="absolute top-0 right-0 w-4/5 h-4/5 overflow-hidden rounded-lg shadow-lg">
                  <Image
                    src="/images/hero-1.jpg"
                    alt="Portrait d'enfant"
                    fill
                    sizes="(max-width: 768px) 80vw, 50vw"
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="absolute bottom-0 left-0 w-2/3 h-3/4 overflow-hidden rounded-3xl shadow-lg">
                  <Image
                    src="/images/hero-2.jpg"
                    alt="Enfant souriant"
                    fill
                    sizes="(max-width: 768px) 70vw, 40vw"
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 w-3 h-3 rounded-full bg-[#FF8B7B]"></div>
                <div className="absolute -left-4 top-1/4 w-3 h-3 rounded-full bg-[#006B3F]"></div>
                <div className="absolute -right-4 bottom-1/4 w-3 h-3 rounded-full bg-[#FFE5A5]"></div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Section d'introduction */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold text-[#006B3F] mb-6">Notre Mission</h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                La Fondation Horizons Nouveaux est dédiée à l'accompagnement des enfants en situation de handicap et leurs familles. Notre approche personnalisée permet à chaque enfant de développer son plein potentiel dans un environnement bienveillant et adapté.
              </p>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                Nous croyons fermement que chaque enfant mérite une chance égale de s'épanouir, d'apprendre et de grandir, quels que soient ses défis.
              </p>
              <Link 
                href="/about"
                className="inline-flex items-center text-[#FF8B7B] font-semibold hover:text-[#006B3F] transition-colors"
              >
                Découvrir notre histoire
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7m0 0l-7 7" />
                </svg>
              </Link>
            </div>
            <div className="md:w-1/2 relative">
              <div className="relative h-80 w-full rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="/images/mission.jpg"
                  alt="Notre mission"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 h-40 w-40 rounded-lg overflow-hidden shadow-lg border-4 border-white">
                <Image
                  src="/images/mission-detail.jpg"
                  alt="Détail de notre mission"
                  fill
                  sizes="(max-width: 768px) 30vw, 15vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nouvelle section Galerie */}
      <section className="py-20 bg-[#f8f9fa]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#006B3F] mb-4">Notre Galerie</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Découvrez les moments forts et les activités de la Fondation Horizons Nouveaux à travers notre galerie d'images
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <div key={num} className="group relative overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl h-[300px] sm:h-[250px] md:h-[300px]">
                <div className="absolute inset-0 w-full h-full">
                  <Image
                    src={`/images/gallery-${num}.jpg`}
                    alt={`Image de galerie ${num}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    priority={num <= 2}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="absolute bottom-0 left-0 w-full p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-xl font-bold">Activité {num}</h3>
                  <p className="text-sm text-white/80">Accompagnement et développement des jeunes</p>
                </div>
                <Link href={`/galerie/image-${num}`} className="absolute inset-0 z-10 cursor-pointer" aria-label={`Voir l'image ${num} en plein écran`}>
                  <span className="sr-only">Voir en plein écran</span>
                </Link>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link 
              href="/galerie"
              className="inline-flex items-center bg-[#006B3F] text-white px-8 py-3 rounded-full hover:bg-[#005535] transition-all duration-300 transform hover:scale-105 hover:shadow-lg font-semibold"
            >
              Voir toutes les photos
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Section "Pourquoi nous choisir" */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#006B3F] mb-4">Nos Formulaires</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Nous proposons différents formulaires adaptés à vos besoins pour faciliter l'accompagnement de votre enfant
            </p>
            {/* Ajout du bouton d'aide */}
            <div className="mt-4">
              <HelpButton text="Besoin d'aide pour choisir un formulaire ?" className="mx-auto" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                title: "Formulaire WISI",
                description: "Une évaluation complète et personnalisée des besoins de chaque enfant pour un accompagnement optimal",
                icon: "📝",
                link: "/formulaires/wisi"
              },
              {
                title: "Formulaire TARII",
                description: "Un suivi médical rigoureux et un développement personnel adapté aux capacités de chacun",
                icon: "🏥",
                link: "/formulaires/tarii"
              },
              {
                title: "Questionnaire FHN",
                description: "Une approche holistique pour comprendre et répondre aux besoins spécifiques de votre enfant",
                icon: "📋",
                link: "/formulaires/fhn"
              }
            ].map((service, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-[#FFE5A5] transform hover:scale-105">
                <div className="text-5xl mb-6 text-[#FF8B7B]">{service.icon}</div>
                <h3 className="text-2xl font-bold mb-4 text-[#006B3F]">{service.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
                <AuthButton 
                  href={service.link}
                  className="inline-flex items-center text-[#FF8B7B] font-semibold hover:text-[#006B3F] transition-colors"
                >
                  Remplir le formulaire
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </AuthButton>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Statistiques */}
      <section className="py-16 bg-gradient-to-br from-[#006B3F] via-[#005535] to-[#004B2F]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "500+", label: "Enfants Accompagnés" },
              { number: "25", label: "Années d'Expérience" },
              { number: "50+", label: "Professionnels Dévoués" },
              { number: "100%", label: "Engagement" }
            ].map((stat, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm rounded-xl p-6 transform hover:scale-105 transition-all duration-300">
                <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-[#FFE5A5] to-[#FFD875] bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <div className="text-white font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Témoignages */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#006B3F] mb-4">Témoignages</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Ce que disent les parents et les professionnels qui nous font confiance
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {[
              {
                text: "La Fondation Horizons Nouveaux a transformé la vie de mon enfant. L'accompagnement personnalisé et l'attention portée à ses besoins spécifiques ont fait toute la différence.",
                author: "Marie K.",
                role: "Parent d'un enfant accompagné"
              },
              {
                text: "En tant que professionnel de santé, je suis impressionné par l'approche holistique de la FHN. Leur dévouement envers chaque enfant est remarquable et les résultats parlent d'eux-mêmes.",
                author: "Dr. Jean Mbala",
                role: "Pédiatre"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-[#f8f9fa] p-8 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 relative transform hover:scale-105">
                <div className="absolute top-0 left-0 transform -translate-x-4 -translate-y-4">
                  <span className="text-6xl text-[#FFE5A5]">"</span>
                </div>
                <p className="text-gray-700 italic mb-6 relative z-10">{testimonial.text}</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-[#FF8B7B] rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.author.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <h4 className="font-bold text-[#006B3F]">{testimonial.author}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Contact */}
      <section className="py-20 bg-[#f8f9fa]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12">
            <div className="md:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold text-[#006B3F] mb-6">Contactez-nous</h2>
              <p className="text-lg text-gray-700 mb-8">
                Vous avez des questions ou besoin d'informations supplémentaires ? N'hésitez pas à nous contacter.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-[#FFE5A5] p-3 rounded-full mr-4">
                    <svg className="w-6 h-6 text-[#006B3F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#006B3F]">Adresse</h3>
                    <p className="text-gray-600">123 Avenue des Horizons, Libreville, Gabon</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-[#FFE5A5] p-3 rounded-full mr-4">
                    <svg className="w-6 h-6 text-[#006B3F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#006B3F]">Téléphone</h3>
                    <p className="text-gray-600">+241 12 345 678</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-[#FFE5A5] p-3 rounded-full mr-4">
                    <svg className="w-6 h-6 text-[#006B3F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#006B3F]">Email</h3>
                    <p className="text-gray-600">contact@fondation-hn.org</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 bg-white p-8 rounded-2xl shadow-xl">
              <h3 className="text-2xl font-bold text-[#006B3F] mb-6">Envoyez-nous un message</h3>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                    <input type="text" id="name" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#FF8B7B] focus:border-[#FF8B7B]" />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" id="email" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#FF8B7B] focus:border-[#FF8B7B]" />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Sujet</label>
                  <input type="text" id="subject" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#FF8B7B] focus:border-[#FF8B7B]" />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea id="message" rows={4} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#FF8B7B] focus:border-[#FF8B7B]"></textarea>
                </div>
                <button type="submit" className="w-full bg-[#FF8B7B] text-white py-3 px-6 rounded-lg hover:bg-[#FF7B6B] transition-all duration-300 transform hover:scale-105 font-semibold">
                  Envoyer le message
                </button>
              </form>
              {/* Ajout du bouton d'aide */}
              <div className="mt-4 text-center">
                <HelpButton text="Besoin d'aide pour nous contacter ?" className="mx-auto" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
// End of Home component
