import Link from "next/link"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer >
      <div className="mx-auto max-w-6xl px-6 py-12 lg:px-8 lg:py-16">
        <div className="flex items-start justify-between ">
          {/* Logo */}
          <div className="mb-12">
            <Link href="/" className="inline-block">
              <span className="text-2xl font-bold text-secondary">PushUp</span>
            </Link>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-2 gap-8 md:gap-12 mb-16">
            {/* Product */}
            <div>
              <h3 className="text-sm font-semibold text-secondary mb-4">Product</h3>
              <ul className="space-y-3">
                <FooterLink href="#features" label="Features" />
                <FooterLink href="#faq" label="Use Case" />
                {/* <FooterLink href="#pricing" label="Pricing" /> */}
              </ul>
            </div>



            {/* Get in Touch */}
            <div>
              <h3 className="text-sm font-semibold text-secondary mb-4">Get in Touch</h3>
              <ul className="space-y-3">
                <li className="text-sm text-muted-foreground">
                  <Link href={'mailto:anirudhparmar2004@gmail.com'}>
                    anirudhparmar2004@gmail.com
                  </Link>
                </li>
                <li className="text-sm text-muted-foreground">
                  <Link href={'https://x.com/anirudhprmar'}>
                    dm me on X
                  </Link>
                </li>
              </ul>
            </div>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <p className="text-sm text-muted-foreground">
            Copyright © {currentYear} PushUp 
          </p>
        </div>
      </div>
    </footer>
  )
}

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <li>
      <Link href={href} className="text-sm text-muted-foreground hover:text-gray-500 transition-colors">
        {label}
      </Link>
    </li>
  )
}