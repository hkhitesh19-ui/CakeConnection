import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search, X } from 'lucide-react';
import { popularCountries, allCountries } from '@/data/countryData';
import type { Country } from '@/data/countryData';

interface CountryCodeSelectProps {
  value: string;
  onChange: (dialCode: string) => void;
  className?: string;
}

function CountryFlag({ code, alt, flag }: { code?: string; alt?: string; flag?: string }) {
  const [hasError, setHasError] = useState(false);
  const cleanCode = code?.toLowerCase();

  if (!cleanCode || hasError) {
    return <span className="text-base leading-none">{flag || '🏳️'}</span>;
  }

  return (
    <img
      src={`https://flagcdn.com/24x18/${cleanCode}.png`}
      srcSet={`https://flagcdn.com/48x36/${cleanCode}.png 2x`}
      width="20"
      height="15"
      alt={alt || code}
      onError={() => setHasError(true)}
      className="inline-block rounded-[2px] shadow-xs object-cover flex-shrink-0"
      loading="lazy"
    />
  );
}

export default function CountryCodeSelect({
  value,
  onChange,
  className = '',
}: CountryCodeSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Find the currently selected country by dial code
  const selectedCountry = useMemo(() => {
    if (!value) {
      return {
        code: '',
        name: 'Select Country Code',
        dial: 'Select Country Code',
        flag: '🏳️',
      };
    }
    return (
      allCountries.find((c) => c.dial === value) ??
      popularCountries.find((c) => c.dial === value) ?? {
        code: 'IN',
        name: 'India',
        dial: '+91',
        flag: '🇮🇳',
      }
    );
  }, [value]);

  // Filter countries based on search query
  const filteredPopular = useMemo(() => {
    if (!searchQuery.trim()) return popularCountries;
    const q = searchQuery.toLowerCase().trim();
    return popularCountries.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.dial.includes(q) ||
        c.code.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const filteredAll = useMemo(() => {
    if (!searchQuery.trim()) return allCountries;
    const q = searchQuery.toLowerCase().trim();
    return allCountries.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.dial.includes(q) ||
        c.code.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchQuery('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on Escape key
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
        setSearchQuery('');
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      // Small delay to allow animation to start
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => {
      if (prev) setSearchQuery('');
      return !prev;
    });
  }, []);

  const handleSelect = useCallback(
    (country: Country) => {
      onChange(country.dial);
      setIsOpen(false);
      setSearchQuery('');
    },
    [onChange]
  );

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
    searchInputRef.current?.focus();
  }, []);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={handleToggle}
        className={`
          flex items-center gap-2 px-3 py-2.5
          bg-surface-secondary border border-border-secondary rounded-lg
          text-text-primary text-sm font-medium
          hover:border-brand-rose/40 hover:bg-surface-tertiary
          focus:outline-none focus:border-brand-rose/50 focus:ring-1 focus:ring-brand-rose/20
          transition-all duration-200 cursor-pointer select-none
          ${isOpen ? 'border-brand-rose/50 ring-1 ring-brand-rose/20' : ''}
        `}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`Country code: ${selectedCountry.name} ${selectedCountry.dial}`}
      >
        <CountryFlag code={selectedCountry.code} alt={selectedCountry.name} flag={selectedCountry.flag} />
        <span className="text-text-primary font-medium">{selectedCountry.dial}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-text-muted transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="
              absolute z-50 left-0 mt-1.5
              w-72 max-h-80
              bg-surface-secondary border border-border-secondary
              rounded-xl shadow-xl shadow-black/10
              overflow-hidden
            "
            role="listbox"
            aria-label="Select country code"
          >
            {/* Search Bar */}
            <div className="sticky top-0 z-10 bg-surface-secondary border-b border-border-secondary p-2.5">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search countries..."
                  className="
                    w-full pl-8 pr-8 py-2
                    bg-surface-tertiary border border-border-secondary rounded-lg
                    text-text-primary text-sm placeholder:text-text-muted
                    focus:outline-none focus:border-brand-rose/50 focus:ring-1 focus:ring-brand-rose/20
                    transition-all duration-200
                  "
                  aria-label="Search countries"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-surface-secondary text-text-muted hover:text-text-secondary transition-colors"
                    aria-label="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Scrollable List */}
            <div className="overflow-y-auto max-h-[calc(20rem-3.5rem)] overscroll-contain">
              {/* Popular Countries */}
              {filteredPopular.length > 0 && (
                <div>
                  <div className="px-3 pt-2.5 pb-1.5">
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-text-muted">
                      Popular
                    </span>
                  </div>
                  {filteredPopular.map((country) => (
                    <CountryRow
                      key={`popular-${country.code}`}
                      country={country}
                      isSelected={country.dial === value}
                      onSelect={handleSelect}
                    />
                  ))}
                </div>
              )}

              {/* Divider */}
              {filteredPopular.length > 0 && filteredAll.length > 0 && (
                <div className="mx-3 my-1 border-t border-border-secondary" />
              )}

              {/* All Countries */}
              {filteredAll.length > 0 && (
                <div>
                  {!searchQuery && (
                    <div className="px-3 pt-2 pb-1.5">
                      <span className="text-[10px] font-semibold uppercase tracking-widest text-text-muted">
                        All Countries
                      </span>
                    </div>
                  )}
                  {filteredAll.map((country) => (
                    <CountryRow
                      key={`all-${country.code}`}
                      country={country}
                      isSelected={country.dial === value}
                      onSelect={handleSelect}
                    />
                  ))}
                </div>
              )}

              {/* No Results */}
              {filteredPopular.length === 0 && filteredAll.length === 0 && (
                <div className="px-4 py-8 text-center">
                  <p className="text-text-muted text-sm">No countries found</p>
                  <p className="text-text-muted/60 text-xs mt-1">
                    Try a different search term
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Country Row Item ─────────────────────────────────────── */

interface CountryRowProps {
  country: Country;
  isSelected: boolean;
  onSelect: (country: Country) => void;
}

function CountryRow({ country, isSelected, onSelect }: CountryRowProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(country)}
      className={`
        w-full flex items-center gap-3 px-3 py-2
        text-left cursor-pointer select-none
        transition-colors duration-150
        ${
          isSelected
            ? 'bg-brand-rose/10 text-text-primary'
            : 'text-text-secondary hover:bg-surface-tertiary hover:text-text-primary'
        }
      `}
      role="option"
      aria-selected={isSelected}
    >
      <CountryFlag code={country.code} alt={country.name} flag={country.flag} />
      <span className="flex-1 text-sm truncate">{country.name}</span>
      <span
        className={`text-xs font-mono flex-shrink-0 ${
          isSelected ? 'text-brand-rose font-semibold' : 'text-text-muted'
        }`}
      >
        {country.dial}
      </span>
    </button>
  );
}
