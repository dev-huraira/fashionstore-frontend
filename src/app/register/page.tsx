'use client';

import '../login/page.css';
import './register.css';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE } from '@/lib/api';

// ─── Country data with local phone number format examples ─────────────────────
const COUNTRIES = [
  { name: 'Afghanistan',            code: 'AF', dial: '+93',  flag: '🇦🇫', ph: '070 123 4567' },
  { name: 'Albania',                code: 'AL', dial: '+355', flag: '🇦🇱', ph: '066 123 4567' },
  { name: 'Algeria',                code: 'DZ', dial: '+213', flag: '🇩🇿', ph: '0550 123 456' },
  { name: 'Andorra',                code: 'AD', dial: '+376', flag: '🇦🇩', ph: '312 345'      },
  { name: 'Angola',                 code: 'AO', dial: '+244', flag: '🇦🇴', ph: '923 123 456'  },
  { name: 'Argentina',              code: 'AR', dial: '+54',  flag: '🇦🇷', ph: '11 2345 6789' },
  { name: 'Armenia',                code: 'AM', dial: '+374', flag: '🇦🇲', ph: '077 123 456'  },
  { name: 'Australia',              code: 'AU', dial: '+61',  flag: '🇦🇺', ph: '412 345 678'  },
  { name: 'Austria',                code: 'AT', dial: '+43',  flag: '🇦🇹', ph: '0664 123456'  },
  { name: 'Azerbaijan',             code: 'AZ', dial: '+994', flag: '🇦🇿', ph: '040 123 45 67'},
  { name: 'Bahrain',                code: 'BH', dial: '+973', flag: '🇧🇭', ph: '3600 1234'    },
  { name: 'Bangladesh',             code: 'BD', dial: '+880', flag: '🇧🇩', ph: '01812 345678' },
  { name: 'Belarus',                code: 'BY', dial: '+375', flag: '🇧🇾', ph: '029 123 45 67'},
  { name: 'Belgium',                code: 'BE', dial: '+32',  flag: '🇧🇪', ph: '0470 12 34 56'},
  { name: 'Bolivia',                code: 'BO', dial: '+591', flag: '🇧🇴', ph: '7123 4567'    },
  { name: 'Bosnia and Herzegovina', code: 'BA', dial: '+387', flag: '🇧🇦', ph: '061 123 456'  },
  { name: 'Brazil',                 code: 'BR', dial: '+55',  flag: '🇧🇷', ph: '11 91234 5678'},
  { name: 'Bulgaria',               code: 'BG', dial: '+359', flag: '🇧🇬', ph: '087 123 4567' },
  { name: 'Cambodia',               code: 'KH', dial: '+855', flag: '🇰🇭', ph: '012 345 678'  },
  { name: 'Canada',                 code: 'CA', dial: '+1',   flag: '🇨🇦', ph: '204 555 0123' },
  { name: 'Chile',                  code: 'CL', dial: '+56',  flag: '🇨🇱', ph: '9 1234 5678'  },
  { name: 'China',                  code: 'CN', dial: '+86',  flag: '🇨🇳', ph: '131 2345 6789'},
  { name: 'Colombia',               code: 'CO', dial: '+57',  flag: '🇨🇴', ph: '312 345 6789' },
  { name: 'Croatia',                code: 'HR', dial: '+385', flag: '🇭🇷', ph: '091 234 5678' },
  { name: 'Cuba',                   code: 'CU', dial: '+53',  flag: '🇨🇺', ph: '5 1234567'    },
  { name: 'Cyprus',                 code: 'CY', dial: '+357', flag: '🇨🇾', ph: '96 123456'    },
  { name: 'Czech Republic',         code: 'CZ', dial: '+420', flag: '🇨🇿', ph: '601 123 456'  },
  { name: 'Denmark',                code: 'DK', dial: '+45',  flag: '🇩🇰', ph: '32 12 34 56'  },
  { name: 'Ecuador',                code: 'EC', dial: '+593', flag: '🇪🇨', ph: '099 123 4567' },
  { name: 'Egypt',                  code: 'EG', dial: '+20',  flag: '🇪🇬', ph: '0100 123 4567'},
  { name: 'Estonia',                code: 'EE', dial: '+372', flag: '🇪🇪', ph: '5123 4567'    },
  { name: 'Ethiopia',               code: 'ET', dial: '+251', flag: '🇪🇹', ph: '091 123 4567' },
  { name: 'Finland',                code: 'FI', dial: '+358', flag: '🇫🇮', ph: '041 2345678'  },
  { name: 'France',                 code: 'FR', dial: '+33',  flag: '🇫🇷', ph: '06 12 34 56 78'},
  { name: 'Georgia',                code: 'GE', dial: '+995', flag: '🇬🇪', ph: '555 12 34 56' },
  { name: 'Germany',                code: 'DE', dial: '+49',  flag: '🇩🇪', ph: '01512 3456789'},
  { name: 'Ghana',                  code: 'GH', dial: '+233', flag: '🇬🇭', ph: '023 123 4567' },
  { name: 'Greece',                 code: 'GR', dial: '+30',  flag: '🇬🇷', ph: '691 234 5678' },
  { name: 'Guatemala',              code: 'GT', dial: '+502', flag: '🇬🇹', ph: '5123 4567'    },
  { name: 'Hungary',                code: 'HU', dial: '+36',  flag: '🇭🇺', ph: '06 20 123 4567'},
  { name: 'Iceland',                code: 'IS', dial: '+354', flag: '🇮🇸', ph: '611 1234'     },
  { name: 'India',                  code: 'IN', dial: '+91',  flag: '🇮🇳', ph: '98765 43210'  },
  { name: 'Indonesia',              code: 'ID', dial: '+62',  flag: '🇮🇩', ph: '0812 3456 7890'},
  { name: 'Iran',                   code: 'IR', dial: '+98',  flag: '🇮🇷', ph: '0912 345 6789'},
  { name: 'Iraq',                   code: 'IQ', dial: '+964', flag: '🇮🇶', ph: '0791 234 5678'},
  { name: 'Ireland',                code: 'IE', dial: '+353', flag: '🇮🇪', ph: '085 123 4567' },
  { name: 'Israel',                 code: 'IL', dial: '+972', flag: '🇮🇱', ph: '050 123 4567' },
  { name: 'Italy',                  code: 'IT', dial: '+39',  flag: '🇮🇹', ph: '312 345 6789' },
  { name: 'Jamaica',                code: 'JM', dial: '+1-876', flag: '🇯🇲', ph: '210 1234'   },
  { name: 'Japan',                  code: 'JP', dial: '+81',  flag: '🇯🇵', ph: '090 1234 5678'},
  { name: 'Jordan',                 code: 'JO', dial: '+962', flag: '🇯🇴', ph: '079 123 4567' },
  { name: 'Kazakhstan',             code: 'KZ', dial: '+7',   flag: '🇰🇿', ph: '701 234 56 78'},
  { name: 'Kenya',                  code: 'KE', dial: '+254', flag: '🇰🇪', ph: '0712 345678'  },
  { name: 'Kuwait',                 code: 'KW', dial: '+965', flag: '🇰🇼', ph: '5000 1234'    },
  { name: 'Kyrgyzstan',             code: 'KG', dial: '+996', flag: '🇰🇬', ph: '0700 123 456' },
  { name: 'Laos',                   code: 'LA', dial: '+856', flag: '🇱🇦', ph: '020 123 4567' },
  { name: 'Latvia',                 code: 'LV', dial: '+371', flag: '🇱🇻', ph: '21 234 567'   },
  { name: 'Lebanon',                code: 'LB', dial: '+961', flag: '🇱🇧', ph: '71 123 456'   },
  { name: 'Libya',                  code: 'LY', dial: '+218', flag: '🇱🇾', ph: '091 123 4567' },
  { name: 'Lithuania',              code: 'LT', dial: '+370', flag: '🇱🇹', ph: '612 34567'    },
  { name: 'Luxembourg',             code: 'LU', dial: '+352', flag: '🇱🇺', ph: '628 123 456'  },
  { name: 'Malaysia',               code: 'MY', dial: '+60',  flag: '🇲🇾', ph: '012 345 6789' },
  { name: 'Maldives',               code: 'MV', dial: '+960', flag: '🇲🇻', ph: '912 3456'     },
  { name: 'Mexico',                 code: 'MX', dial: '+52',  flag: '🇲🇽', ph: '55 1234 5678' },
  { name: 'Moldova',                code: 'MD', dial: '+373', flag: '🇲🇩', ph: '0621 23 456'  },
  { name: 'Morocco',                code: 'MA', dial: '+212', flag: '🇲🇦', ph: '0612 345678'  },
  { name: 'Myanmar',                code: 'MM', dial: '+95',  flag: '🇲🇲', ph: '09 123 456789'},
  { name: 'Nepal',                  code: 'NP', dial: '+977', flag: '🇳🇵', ph: '984 1234567'  },
  { name: 'Netherlands',            code: 'NL', dial: '+31',  flag: '🇳🇱', ph: '06 12345678'  },
  { name: 'New Zealand',            code: 'NZ', dial: '+64',  flag: '🇳🇿', ph: '021 123 4567' },
  { name: 'Nigeria',                code: 'NG', dial: '+234', flag: '🇳🇬', ph: '0803 123 4567'},
  { name: 'North Korea',            code: 'KP', dial: '+850', flag: '🇰🇵', ph: '191 234 5678' },
  { name: 'Norway',                 code: 'NO', dial: '+47',  flag: '🇳🇴', ph: '406 12 345'   },
  { name: 'Oman',                   code: 'OM', dial: '+968', flag: '🇴🇲', ph: '9212 3456'    },
  { name: 'Pakistan',               code: 'PK', dial: '+92',  flag: '🇵🇰', ph: '300 123 4567' },
  { name: 'Palestine',              code: 'PS', dial: '+970', flag: '🇵🇸', ph: '059 123 4567' },
  { name: 'Panama',                 code: 'PA', dial: '+507', flag: '🇵🇦', ph: '6123 4567'    },
  { name: 'Peru',                   code: 'PE', dial: '+51',  flag: '🇵🇪', ph: '912 345 678'  },
  { name: 'Philippines',            code: 'PH', dial: '+63',  flag: '🇵🇭', ph: '0917 123 4567'},
  { name: 'Poland',                 code: 'PL', dial: '+48',  flag: '🇵🇱', ph: '512 345 678'  },
  { name: 'Portugal',               code: 'PT', dial: '+351', flag: '🇵🇹', ph: '912 345 678'  },
  { name: 'Qatar',                  code: 'QA', dial: '+974', flag: '🇶🇦', ph: '3312 3456'    },
  { name: 'Romania',                code: 'RO', dial: '+40',  flag: '🇷🇴', ph: '0712 345 678' },
  { name: 'Russia',                 code: 'RU', dial: '+7',   flag: '🇷🇺', ph: '912 345 67 89'},
  { name: 'Saudi Arabia',           code: 'SA', dial: '+966', flag: '🇸🇦', ph: '051 234 5678' },
  { name: 'Senegal',                code: 'SN', dial: '+221', flag: '🇸🇳', ph: '77 123 45 67' },
  { name: 'Serbia',                 code: 'RS', dial: '+381', flag: '🇷🇸', ph: '060 1234567'  },
  { name: 'Singapore',              code: 'SG', dial: '+65',  flag: '🇸🇬', ph: '8123 4567'    },
  { name: 'Slovakia',               code: 'SK', dial: '+421', flag: '🇸🇰', ph: '0912 123 456' },
  { name: 'Slovenia',               code: 'SI', dial: '+386', flag: '🇸🇮', ph: '031 234 567'  },
  { name: 'Somalia',                code: 'SO', dial: '+252', flag: '🇸🇴', ph: '61 1234567'   },
  { name: 'South Africa',           code: 'ZA', dial: '+27',  flag: '🇿🇦', ph: '071 123 4567' },
  { name: 'South Korea',            code: 'KR', dial: '+82',  flag: '🇰🇷', ph: '010 2000 0000'},
  { name: 'Spain',                  code: 'ES', dial: '+34',  flag: '🇪🇸', ph: '612 345 678'  },
  { name: 'Sri Lanka',              code: 'LK', dial: '+94',  flag: '🇱🇰', ph: '071 234 5678' },
  { name: 'Sudan',                  code: 'SD', dial: '+249', flag: '🇸🇩', ph: '0912 345 678' },
  { name: 'Sweden',                 code: 'SE', dial: '+46',  flag: '🇸🇪', ph: '070 123 45 67'},
  { name: 'Switzerland',            code: 'CH', dial: '+41',  flag: '🇨🇭', ph: '078 123 45 67'},
  { name: 'Syria',                  code: 'SY', dial: '+963', flag: '🇸🇾', ph: '094 123 4567' },
  { name: 'Taiwan',                 code: 'TW', dial: '+886', flag: '🇹🇼', ph: '09 1234 5678' },
  { name: 'Tajikistan',             code: 'TJ', dial: '+992', flag: '🇹🇯', ph: '917 12 3456'  },
  { name: 'Tanzania',               code: 'TZ', dial: '+255', flag: '🇹🇿', ph: '0712 345 678' },
  { name: 'Thailand',               code: 'TH', dial: '+66',  flag: '🇹🇭', ph: '081 234 5678' },
  { name: 'Tunisia',                code: 'TN', dial: '+216', flag: '🇹🇳', ph: '20 123 456'   },
  { name: 'Turkey',                 code: 'TR', dial: '+90',  flag: '🇹🇷', ph: '0531 234 56 78'},
  { name: 'Turkmenistan',           code: 'TM', dial: '+993', flag: '🇹🇲', ph: '8 65 123456'  },
  { name: 'Uganda',                 code: 'UG', dial: '+256', flag: '🇺🇬', ph: '0712 345678'  },
  { name: 'Ukraine',                code: 'UA', dial: '+380', flag: '🇺🇦', ph: '050 123 4567' },
  { name: 'United Arab Emirates',   code: 'AE', dial: '+971', flag: '🇦🇪', ph: '050 123 4567' },
  { name: 'United Kingdom',         code: 'GB', dial: '+44',  flag: '🇬🇧', ph: '07911 123456' },
  { name: 'United States',          code: 'US', dial: '+1',   flag: '🇺🇸', ph: '201 555 0123' },
  { name: 'Uruguay',                code: 'UY', dial: '+598', flag: '🇺🇾', ph: '094 123 456'  },
  { name: 'Uzbekistan',             code: 'UZ', dial: '+998', flag: '🇺🇿', ph: '90 123 45 67' },
  { name: 'Venezuela',              code: 'VE', dial: '+58',  flag: '🇻🇪', ph: '0412 123 4567'},
  { name: 'Vietnam',                code: 'VN', dial: '+84',  flag: '🇻🇳', ph: '091 234 56 78'},
  { name: 'Yemen',                  code: 'YE', dial: '+967', flag: '🇾🇪', ph: '0712 345 678' },
  { name: 'Zimbabwe',               code: 'ZW', dial: '+263', flag: '🇿🇼', ph: '071 234 5678' },
];

// Count only digit characters in a string (used for phone length validation)
const countDigits = (s: string) => (s.match(/\d/g) || []).length;

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES.find(c => c.code === 'US')!);
  const [dialOpen, setDialOpen] = useState(false);
  const [dialSearch, setDialSearch] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string; email?: string; phone?: string;
    password?: string; confirmPassword?: string; terms?: string; general?: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const dialRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dialRef.current && !dialRef.current.contains(e.target as Node)) {
        setDialOpen(false);
        setDialSearch('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Auto-focus search when dropdown opens
  useEffect(() => {
    if (dialOpen && searchRef.current) searchRef.current.focus();
  }, [dialOpen]);

  const filteredCountries = COUNTRIES.filter(c =>
    c.name.toLowerCase().includes(dialSearch.toLowerCase()) ||
    c.dial.includes(dialSearch)
  );

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!name.trim()) newErrors.name = 'Enter your name.';
    if (!email.trim()) newErrors.email = 'Enter your email.';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Enter a valid email address.';
    // Phone: if filled, must match the exact digit count for the selected country
    if (phoneNumber.trim()) {
      const enteredDigits = countDigits(phoneNumber);
      const expectedDigits = countDigits(selectedCountry.ph);
      if (enteredDigits !== expectedDigits) {
        newErrors.phone = `Enter exactly ${expectedDigits} digits for ${selectedCountry.name} (e.g. ${selectedCountry.ph})`;
      }
    }
    if (!password) newErrors.password = 'Enter a password.';
    else if (password.length < 6) newErrors.password = 'Passwords must be at least 6 characters.';
    if (!confirmPassword) newErrors.confirmPassword = 'Re-enter your password.';
    else if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match.';
    if (!termsAccepted) newErrors.terms = 'You must agree to the Terms of Use and Privacy Notice to continue.';
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }
    setErrors({});
    setLoading(true);
    const phone = phoneNumber ? `${selectedCountry.dial}${phoneNumber}` : '';
    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name, email, phone, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors({ general: data.message || 'Registration failed. Please try again.' });
      } else {
        window.dispatchEvent(new Event('authChange'));
        router.push('/');
      }
    } catch {
      setErrors({ general: 'Unable to connect to the server. Please try again later.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">Create account</h1>
        {errors.general && <div className="error-banner">{errors.general}</div>}
        <form className="login-form" onSubmit={handleSubmit}>

          {/* Name */}
          <div className="form-group">
            <label htmlFor="reg-name">Your name</label>
            <input type="text" id="reg-name" placeholder="First and last name"
              value={name} onChange={e => setName(e.target.value)}
              className={errors.name ? 'input-error' : ''} />
            {errors.name && <span className="error-msg">{errors.name}</span>}
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="reg-email">Email address</label>
            <input type="email" id="reg-email"
              value={email} onChange={e => setEmail(e.target.value)}
              className={errors.email ? 'input-error' : ''} />
            {errors.email && <span className="error-msg">{errors.email}</span>}
          </div>

          {/* ── Phone with country picker ── */}
          <div className="form-group">
            <label htmlFor="reg-phone">Mobile number <span className="optional-label">(optional)</span></label>
            <div className={`phone-input-group${errors.phone ? ' input-error-group' : ''}`}>

              {/* Country code selector */}
              <div className="dial-picker" ref={dialRef}>
                <button
                  type="button"
                  id="dial-code-btn"
                  className="dial-trigger"
                  onClick={() => { setDialOpen(o => !o); setDialSearch(''); }}
                  aria-haspopup="listbox"
                  aria-expanded={dialOpen}
                  title={selectedCountry.name}
                >
                  <img
                    className="dial-flag-img"
                    src={`https://flagcdn.com/24x18/${selectedCountry.code.toLowerCase()}.png`}
                    srcSet={`https://flagcdn.com/48x36/${selectedCountry.code.toLowerCase()}.png 2x`}
                    width="24"
                    height="18"
                    alt={selectedCountry.name}
                  />
                  <span className="dial-code">{selectedCountry.dial}</span>
                  <svg className={`dial-chevron${dialOpen ? ' open' : ''}`} width="11" height="11"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {dialOpen && (
                  <div className="dial-dropdown" role="listbox" aria-label="Select country code">

                    {/* Search box */}
                    <div className="dial-search-wrap">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                      </svg>
                      <input
                        ref={searchRef}
                        type="text"
                        className="dial-search"
                        placeholder="Search country or code…"
                        value={dialSearch}
                        onChange={e => setDialSearch(e.target.value)}
                        aria-label="Search countries"
                      />
                      {dialSearch && (
                        <button type="button" className="dial-clear" onClick={() => setDialSearch('')} aria-label="Clear search">×</button>
                      )}
                    </div>

                    {/* Country list */}
                    <ul className="dial-list">
                      {filteredCountries.length === 0 && (
                        <li className="dial-no-result">No countries found</li>
                      )}
                      {filteredCountries.map(country => (
                        <li
                          key={country.code}
                          role="option"
                          aria-selected={selectedCountry.code === country.code}
                          className={`dial-item${selectedCountry.code === country.code ? ' selected' : ''}`}
                          onClick={() => {
                            setSelectedCountry(country);
                            setPhoneNumber('');
                            setDialOpen(false);
                            setDialSearch('');
                          }}
                        >
                          {/* Flag image (flagcdn.com — works on all platforms including Windows) */}
                          <img
                            className="dial-item-flag-img"
                            src={`https://flagcdn.com/24x18/${country.code.toLowerCase()}.png`}
                            srcSet={`https://flagcdn.com/48x36/${country.code.toLowerCase()}.png 2x`}
                            width="24"
                            height="18"
                            alt={country.name}
                          />
                          {/* Country name */}
                          <span className="dial-item-name">{country.name}</span>
                          {/* Dial code badge */}
                          <span className="dial-item-code">{country.dial}</span>
                          {/* Tick for selected */}
                          {selectedCountry.code === country.code && (
                            <svg className="dial-item-tick" width="14" height="14" viewBox="0 0 24 24"
                              fill="none" stroke="currentColor" strokeWidth="3"
                              strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Number input — placeholder + maxLength enforced per country */}
              <input
                type="tel"
                id="reg-phone"
                className="phone-number-input"
                placeholder={selectedCountry.ph}
                value={phoneNumber}
                maxLength={selectedCountry.ph.length}
                onChange={e => {
                  const raw = e.target.value.replace(/[^0-9\s\-]/g, '');
                  // Block input once digit count reaches the expected maximum
                  if (countDigits(raw) <= countDigits(selectedCountry.ph)) {
                    setPhoneNumber(raw);
                    if (errors.phone) setErrors(prev => ({ ...prev, phone: undefined }));
                  }
                }}
                autoComplete="tel-national"
              />
            </div>

            {/* Show green tick only when digit count is exactly right */}
            {phoneNumber && countDigits(phoneNumber) === countDigits(selectedCountry.ph) && (
              <span className="phone-digit-hint done">✓ Looks good!</span>
            )}

            {errors.phone && <span className="error-msg">{errors.phone}</span>}
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="reg-password">Password</label>
            <input type="password" id="reg-password" placeholder="At least 6 characters"
              value={password} onChange={e => setPassword(e.target.value)}
              className={errors.password ? 'input-error' : ''} />
            {errors.password && <span className="error-msg">{errors.password}</span>}
          </div>

          {/* Confirm password */}
          <div className="form-group">
            <label htmlFor="reg-password-confirm">Re-enter password</label>
            <input type="password" id="reg-password-confirm"
              value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
              className={errors.confirmPassword ? 'input-error' : ''} />
            {errors.confirmPassword && <span className="error-msg">{errors.confirmPassword}</span>}
          </div>

          {/* Terms */}
          <div className="terms-checkbox-group">
            <label className="terms-label">
              <input type="checkbox" className="terms-checkbox"
                checked={termsAccepted}
                onChange={e => {
                  setTermsAccepted(e.target.checked);
                  if (e.target.checked && errors.terms) setErrors(prev => ({ ...prev, terms: undefined }));
                }} />
              <span className="terms-text">
                By creating an account, I agree to FashionStore&apos;s{' '}
                <Link href="/terms" className="terms-link">Conditions of Use</Link>
                {' '}and{' '}
                <Link href="/privacy" className="terms-link">Privacy Notice</Link>.
              </span>
            </label>
            {errors.terms && <span className="error-msg">{errors.terms}</span>}
          </div>

          <button type="submit" className="btn-auth" disabled={loading}>
            {loading ? 'Creating account…' : 'Continue'}
          </button>
        </form>

        <div className="divider-line"></div>
        <div className="signin-link">
          Already have an account? <Link href="/login" className="link-text">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
