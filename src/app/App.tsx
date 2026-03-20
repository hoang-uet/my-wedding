import { useRef, useCallback, useState } from 'react'
import { Volume2, VolumeX } from 'lucide-react'
import { EnvelopeCard } from './components/EnvelopeCard'
import { WeddingPhotoDivider } from './components/WeddingPhotoDivider'
import { FamilyInfo } from './components/FamilyInfo'
import { EventDetails } from './components/EventDetails'
import { PhotoHero } from './components/PhotoHero'
import { CouplePortraits } from './components/CouplePortraits'
import { OurStory } from './components/OurStory'
import { CalendarHighlight } from './components/CalendarHighlight'
import { WeddingTimeline } from './components/WeddingTimeline'
import { PhotoQuoteSplit } from './components/PhotoQuoteSplit'
import { Countdown } from './components/Countdown'
import { Gallery } from './components/Gallery'
import { RSVPForm } from './components/RSVPForm'
import { WeddingGift } from './components/WeddingGift'
import { ThankYou } from './components/ThankYou'
import { FloatingBar } from './components/FloatingBar'

export default function App() {
    const [musicPlaying, setMusicPlaying] = useState(false)
    const scrollContainerRef = useRef<HTMLDivElement>(null)

    const scrollToSection = useCallback((id: string) => {
        const container = scrollContainerRef.current
        if (!container) return
        const el = container.querySelector(`#${id}`)
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
    }, [])

    return (
        <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: '#D4CFC7' }}
        >
            {/* Phone Frame */}
            <div
                className="phone-frame relative flex flex-col"
                style={{
                    width: '100%',
                    maxWidth: '430px',
                    height: '100vh',
                    overflow: 'hidden',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.12), 0 8px 24px rgba(0,0,0,0.08)',
                    background: '#F0EBE2',
                }}
            >
                {/* Music button */}
                <button
                    onClick={() => setMusicPlaying(!musicPlaying)}
                    className="absolute top-4 right-4 z-[900] flex items-center justify-center cursor-pointer"
                    style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: musicPlaying ? 'rgba(74,93,58,0.9)' : 'rgba(255,255,255,0.85)',
                        border: 'none',
                        transition: 'all 300ms ease',
                        boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
                        backdropFilter: 'blur(8px)',
                    }}
                    aria-label={musicPlaying ? 'Tắt nhạc' : 'Bật nhạc'}
                >
                    {musicPlaying ? (
                        <Volume2
                            size={18}
                            color="white"
                            strokeWidth={1.5}
                            style={{
                                animation: 'musicSpin 4s linear infinite',
                            }}
                        />
                    ) : (
                        <VolumeX size={18} color="#4A5D3A" strokeWidth={1.5} />
                    )}
                </button>

                {/* Scrollable content */}
                <div
                    ref={scrollContainerRef}
                    className="flex-1 overflow-y-auto"
                    style={{
                        scrollBehavior: 'smooth',
                        paddingBottom: '56px',
                    }}
                >
                    <div className="relative">
                        <EnvelopeCard />
                        <WeddingPhotoDivider />
                        <FamilyInfo />
                        <EventDetails />
                        <PhotoHero />
                        <CouplePortraits />
                        <OurStory />
                        <CalendarHighlight />
                        <WeddingTimeline />
                        <PhotoQuoteSplit />
                        <Countdown />
                        <Gallery />
                        <RSVPForm />
                        <WeddingGift />
                        <ThankYou />
                    </div>
                </div>

                {/* Floating bottom bar */}
                <FloatingBar
                    onScrollToGallery={() => scrollToSection('gallery-section')}
                    onScrollToGift={() => scrollToSection('gift-section')}
                />
            </div>

            <style>{`
        @media (min-width: 768px) {
          .phone-frame {
            border-radius: 36px !important;
            max-height: 100vh;
          }
        }
        @media (max-width: 767px) {
          .phone-frame {
            max-width: 100% !important;
          }
        }
        @keyframes musicSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        /* Elegant thin scrollbar */
        div::-webkit-scrollbar {
          width: 2px;
        }
        div::-webkit-scrollbar-track {
          background: transparent;
        }
        div::-webkit-scrollbar-thumb {
          background: rgba(155,175,136,0.3);
          border-radius: 4px;
        }
        div::-webkit-scrollbar-thumb:hover {
          background: rgba(155,175,136,0.5);
        }
      `}</style>
        </div>
    )
}
