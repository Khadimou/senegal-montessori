import Link from 'next/link';
import { Leaf, MapPin, Phone, Mail, Facebook, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center">
                <Leaf className="w-7 h-7 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-white tracking-tight">
                  Montessori
                </span>
                <span className="text-xs text-amber-500 font-medium -mt-1">
                  Sénégal
                </span>
              </div>
            </Link>
            <p className="text-stone-400 leading-relaxed">
              Votre boutique de jouets éducatifs Montessori au Sénégal. 
              Des matériels de qualité pour l&apos;épanouissement de vos enfants.
            </p>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-stone-800 rounded-xl flex items-center justify-center hover:bg-amber-500 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-stone-800 rounded-xl flex items-center justify-center hover:bg-amber-500 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-6">Navigation</h3>
            <ul className="space-y-3">
              {[
                { href: '/', label: 'Accueil' },
                { href: '/produits', label: 'Boutique' },
                { href: '/a-propos', label: 'À Propos' },
                { href: '/contact', label: 'Contact' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-stone-400 hover:text-amber-500 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-6">Catégories</h3>
            <ul className="space-y-3">
              {[
                'Vie Pratique',
                'Matériel Sensoriel',
                'Langage',
                'Mathématiques',
                'Culture & Sciences',
              ].map((category) => (
                <li key={category}>
                  <Link
                    href="/produits"
                    className="text-stone-400 hover:text-amber-500 transition-colors"
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-6">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <span className="text-stone-400">
                  Almadies, Dakar<br />Sénégal
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-amber-500 flex-shrink-0" />
                <a href="tel:+221771234567" className="text-stone-400 hover:text-amber-500 transition-colors">
                  +221 77 123 45 67
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-amber-500 flex-shrink-0" />
                <a href="mailto:contact@montessori-senegal.com" className="text-stone-400 hover:text-amber-500 transition-colors">
                  contact@montessori-senegal.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-stone-500 text-sm">
              © {new Date().getFullYear()} Montessori Sénégal. Tous droits réservés.
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="#" className="text-stone-500 hover:text-amber-500 transition-colors">
                Mentions légales
              </Link>
              <Link href="#" className="text-stone-500 hover:text-amber-500 transition-colors">
                Politique de confidentialité
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

