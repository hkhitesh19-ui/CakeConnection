'use client';
// ============================================
// ExpressDeliveryScooter Component — Winni Style
// Matches Winni's exact class: <div class="left bg-express_delivery_1">
// Features 60fps SVG scooter with spinning wheels, road bounce & speed trails
// ============================================

import Link from 'next/link';
import { cn } from '@/utils';

interface ExpressDeliveryScooterProps {
  className?: string;
  isMobile?: boolean;
  href?: string;
}

export function ExpressDeliveryScooter({
  className,
  isMobile = false,
  href = '/cakes?delivery=superfast',
}: ExpressDeliveryScooterProps) {
  return (
    <Link
      href={href}
      id="header-express-delivery"
      className={cn(
        'group inline-flex items-center gap-2 transition-all duration-300 select-none cursor-pointer',
        isMobile
          ? 'px-2.5 py-1 rounded-full bg-rose-50/90 border border-rose-200/90 text-brand-rose shadow-xs'
          : 'px-3.5 py-1.5 rounded-full bg-gradient-to-r from-rose-50 via-pink-50 to-rose-50 border border-rose-200 text-brand-rose shadow-xs hover:shadow-md hover:border-brand-rose/40 hover:bg-rose-100/60',
        className
      )}
      title="2 Hour Superfast Delivery Across Vadodara"
    >
      {/* Exact Winni-Style Class Container */}
      <div className="left bg-express_delivery_1 relative flex items-center justify-center flex-shrink-0">
        {/* Animated Scooter SVG */}
        <div className="scooter-bounce relative w-7 h-5 sm:w-8 sm:h-6 flex items-center justify-center">
          <svg
            viewBox="0 0 64 48"
            className="w-full h-full drop-shadow-xs"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Speed Wind / Dust Trails Behind Scooter */}
            <g className="scooter-speed-lines" stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round">
              <line x1="2" y1="28" x2="10" y2="28" className="speed-line-1" />
              <line x1="0" y1="33" x2="8" y2="33" className="speed-line-2" />
              <line x1="4" y1="38" x2="11" y2="38" className="speed-line-3" />
            </g>

            {/* Delivery Gift Box on the Back Rack */}
            <rect
              x="12"
              y="16"
              width="14"
              height="13"
              rx="2"
              fill="#fb7185"
              stroke="#e11d48"
              strokeWidth="1.5"
            />
            {/* Gift Ribbon */}
            <line x1="19" y1="16" x2="19" y2="29" stroke="#ffffff" strokeWidth="1.5" />
            <line x1="12" y1="22.5" x2="26" y2="22.5" stroke="#ffffff" strokeWidth="1.5" />
            <circle cx="19" cy="15" r="2" fill="#ffe4e6" stroke="#e11d48" strokeWidth="1" />

            {/* Scooter Body / Chassis */}
            <path
              d="M18 29L32 30L38 34L46 34L50 20L44 14"
              stroke="#e11d48"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Footboard */}
            <line x1="24" y1="34" x2="42" y2="34" stroke="#881337" strokeWidth="3" strokeLinecap="round" />

            {/* Handlebar & Headlight */}
            <path
              d="M48 18L52 14M52 14L55 14M52 14L49 12"
              stroke="#be123c"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Headlight Glow */}
            <circle cx="53" cy="18" r="2.5" fill="#fde047" />
            <path
              d="M55 18L63 15M55 18L64 18M55 18L63 21"
              stroke="#fef08a"
              strokeWidth="1"
              strokeLinecap="round"
              opacity="0.8"
            />

            {/* Front Mudguard */}
            <path
              d="M42 32C44 28 52 28 54 32"
              stroke="#e11d48"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Rear Wheel (Animated Rotation) */}
            <g className="scooter-wheel wheel-rear" transform-origin="18 36">
              <circle cx="18" cy="36" r="6" stroke="#334155" strokeWidth="2.5" fill="#f8fafc" />
              <circle cx="18" cy="36" r="2" fill="#e11d48" />
              <line x1="18" y1="30" x2="18" y2="42" stroke="#64748b" strokeWidth="1" />
              <line x1="12" y1="36" x2="24" y2="36" stroke="#64748b" strokeWidth="1" />
            </g>

            {/* Front Wheel (Animated Rotation) */}
            <g className="scooter-wheel wheel-front" transform-origin="48 36">
              <circle cx="48" cy="36" r="6" stroke="#334155" strokeWidth="2.5" fill="#f8fafc" />
              <circle cx="48" cy="36" r="2" fill="#e11d48" />
              <line x1="48" y1="30" x2="48" y2="42" stroke="#64748b" strokeWidth="1" />
              <line x1="42" y1="36" x2="54" y2="36" stroke="#64748b" strokeWidth="1" />
            </g>
          </svg>
        </div>
      </div>

      {/* Label Matching Winni: 2 Hour Delivery Gifts */}
      <span
        className={cn(
          'font-extrabold tracking-tight transition-colors whitespace-nowrap',
          isMobile ? 'text-[11px] text-brand-rose' : 'text-xs sm:text-[13px] text-brand-rose group-hover:text-brand-red'
        )}
      >
        2 Hour Delivery Gifts
      </span>

      {/* Embedded High-Performance Keyframe Animations */}
      <style jsx>{`
        .scooter-bounce {
          animation: scooterBob 0.6s ease-in-out infinite alternate;
        }
        @keyframes scooterBob {
          0% {
            transform: translateY(0px) rotate(0deg);
          }
          100% {
            transform: translateY(-2px) rotate(-1deg);
          }
        }
        :global(.scooter-wheel) {
          animation: wheelSpin 0.7s linear infinite;
          transform-box: fill-box;
          transform-origin: center;
        }
        @keyframes wheelSpin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        :global(.speed-line-1) {
          animation: trailPulse 0.5s ease-in-out infinite;
        }
        :global(.speed-line-2) {
          animation: trailPulse 0.5s ease-in-out 0.15s infinite;
        }
        :global(.speed-line-3) {
          animation: trailPulse 0.5s ease-in-out 0.3s infinite;
        }
        @keyframes trailPulse {
          0% {
            opacity: 0.2;
            transform: translateX(2px);
          }
          50% {
            opacity: 1;
            transform: translateX(-3px);
          }
          100% {
            opacity: 0.1;
            transform: translateX(-6px);
          }
        }
      `}</style>
    </Link>
  );
}
