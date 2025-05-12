import React from 'react'
import Link from 'next/link'

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">True Feedback</h3>
            <p className="text-sm">
              The leading platform for anonymous feedback and communication.
            </p>
          </div>
          {[
            { title: "Quick Links", links: [{ href: "/", text: "Home" }, { href: "/about", text: "About" }, { href: "/features", text: "Features" }, { href: "/pricing", text: "Pricing" }] },
            { title: "Legal", links: [{ href: "/privacy", text: "Privacy" }, { href: "/terms", text: "Terms" }, { href: "/cookies", text: "Cookies" }] },
            { title: "Connect", links: [{ href: "/contact", text: "Contact" }, { href: "/support", text: "Support" }, { href: "/faq", text: "FAQ" }] },
          ].map((col, i) => (
            <div key={i}>
              <h4 className="text-white text-md font-medium mb-4">{col.title}</h4>
              <ul className="space-y-2 text-sm">
                {col.links.map((link, j) => (
                  <li key={j}>
                    <Link href={link.href.replace(`${link.href}`, '/')} className="hover:text-white transition-colors">
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>© {new Date().getFullYear()} True Feedback. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
