import { useRef, useCallback } from 'react'
import { EnvelopeCard } from './components/EnvelopeCard'
import { MusicButton } from './components/MusicButton'
import { useAudioPlayer } from './components/useAudioPlayer'
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
import { FloralAnimationStyles, OrchidBranchDivider } from './components/FloralOverlay'

export default function App() {
    const { isPlaying, toggle, play } = useAudioPlayer()
    const musicStarted = useRef(false)
    const scrollContainerRef = useRef<HTMLDivElement>(null)

    // Start music on first envelope open (once only — respects manual toggle after)
    const handleEnvelopeOpen = useCallback(() => {
        if (!musicStarted.current) {
            musicStarted.current = true
            play()
        }
    }, [play])

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
                {/* Music toggle — vinyl disc button */}
                <MusicButton isPlaying={isPlaying} onClick={toggle} />

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
                        <EnvelopeCard onOpen={handleEnvelopeOpen} />
                        <WeddingPhotoDivider />
                        <FamilyInfo />
                        <EventDetails />
                        <PhotoHero />
                        <CouplePortraits />
                        {/* Orchid branch divider between story sections */}
                        <OrchidBranchDivider delay={100} />
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

            {/* Global floral animation keyframes */}
            <FloralAnimationStyles />

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
