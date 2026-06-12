import Link from 'next/link';
import Image from 'next/image';

export function Logo({ className = '' }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2 select-none group ${className}`}>
      <Image
        src="/logo.png"
        alt="Cake Connection Logo"
        width={240}
        height={80}
        className="h-11 md:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]"
        priority
      />
    </Link>
  );
}
