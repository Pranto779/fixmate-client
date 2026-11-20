import Link from "next/link";
import {
  Wrench,
  Mail,
  Phone,
  MapPin,
  ArrowUpRight,
  Globe,
  MessageCircle,
  Send,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#243b53] text-white">
      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-6 pb-12 pt-16">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div>
            <Link href="/" className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#243b53]">
                <Wrench size={24} />
              </div>

              <div>
                <h2 className="text-2xl font-extrabold">
                  Fix<span className="text-[#e4a878]">Mate</span>
                </h2>

                <p className="text-[9px] tracking-[2px] text-white/60">
                  REPAIR MADE SIMPLE
                </p>
              </div>
            </Link>

            <p className="max-w-xs text-sm leading-7 text-white/65">
              Your trusted partner for home appliance repairs.
              Connect with skilled technicians and get reliable
              service right at your doorstep.
            </p>

            {/* Social Links */}
            <div className="mt-6 flex gap-3">
              {[
                { icon: Globe, href: "#", label: "Website" },
                { icon: MessageCircle, href: "#", label: "Community" },
                { icon: Send, href: "#", label: "Telegram" },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 text-white/70 transition hover:border-[#e4a878] hover:bg-[#e4a878] hover:text-[#243b53]"
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-[#e4a878]">
              Quick Links
            </h3>

            <ul className="space-y-4 text-sm text-white/65">
              {[
                { name: "Home", href: "/" },
                { name: "Services", href: "/services" },
                { name: "How It Works", href: "/about" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="inline-flex items-center gap-2 transition hover:translate-x-1 hover:text-[#e4a878]"
                  >
                    {link.name}
                    <ArrowUpRight size={13} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-[#e4a878]">
              Our Services
            </h3>

            <ul className="space-y-4 text-sm text-white/65">
              {[
                "AC Repair",
                "Refrigerator Repair",
                "TV Repair",
                "Washing Machine Repair",
                "Electrical Services",
              ].map((service) => (
                <li key={service}>
                  <Link
                    href="/services"
                    className="transition hover:text-[#e4a878]"
                  >
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            

            <div className="space-y-5">
              {/* Address */}
              <div className="flex items-start gap-3">
                <MapPin
                  size={19}
                  className="mt-1 shrink-0 text-[#e4a878]"
                />

                <p className="text-sm leading-6 text-white/65">
                  Dhaka, Bangladesh
                </p>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-3">
                <Phone
                  size={18}
                  className="shrink-0 text-[#e4a878]"
                />

                <p className="text-sm text-white/65">
                  +880 1951066952
                </p>
              </div>

              {/* Email */}
              <div className="flex items-center gap-3">
                <Mail
                  size={18}
                  className="shrink-0 text-[#e4a878]"
                />

                <p className="text-sm text-white/65">
                 pranto7726@gmail.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 text-center sm:flex-row sm:text-left">

          <p className="text-xs text-white/50">
            © 2026 FixMate. All rights reserved.
          </p>

          <div className="flex gap-6 text-xs text-white/50">
            <Link
              href="/privacy"
              className="transition hover:text-[#e4a878]"
            >
              Privacy Policy
            </Link>

            <Link
              href="/terms"
              className="transition hover:text-[#e4a878]"
            >
              Terms of Service
            </Link>
          </div>

          <p className="text-xs text-white/50">
            Made with <span className="text-[#e4a878]">♥</span> for better living.
          </p>

        </div>
      </div>
    </footer>
  );
};

export default Footer;