import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <nav className="border-b border-primary/10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <svg
                className="h-8 w-8 text-primary"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
              </svg>
              <span className="text-xl font-bold text-primary">Drone-a-charya</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/auth/login">
                <Button variant="ghost" className="text-foreground hover:text-primary">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/sign-up">
                <Button className="bg-primary hover:bg-primary/90">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative flex-1 bg-gradient-to-br from-primary/5 via-background to-background py-20 px-4">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <h1 className="text-5xl sm:text-6xl font-bold text-foreground">
              Connect. Collaborate.{' '}
              <span className="text-primary">Create.</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              Drone-a-charya is a collaborative platform for drone enthusiasts, students, educators, and companies. Build amazing drone technology together.
            </p>
            <div className="mt-10 flex gap-4 justify-center">
              <Link href="/auth/sign-up">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-base px-8">
                  Start Building Today
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline" className="border-primary/20 text-base px-8">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 border-t border-primary/10">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-4xl font-bold text-center mb-4 text-foreground">
            Powerful Features
          </h2>
          <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto">
            Everything you need to collaborate on drone projects and innovations
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Project Management',
                description: 'Create, organize, and manage your drone projects with version control',
                icon: '📋',
              },
              {
                title: 'Collaboration Tools',
                description: 'Work together in real-time with team members and mentors',
                icon: '👥',
              },
              {
                title: 'Share & Learn',
                description: 'Share your designs, learn from others, and build together',
                icon: '🚀',
              },
              {
                title: 'Professional Network',
                description: 'Connect with industry professionals and expand your network',
                icon: '🔗',
              },
              {
                title: 'Resource Library',
                description: 'Access tutorials, documentation, and drone technology resources',
                icon: '📚',
              },
              {
                title: 'Community Feed',
                description: 'Stay updated with the latest projects and innovations in the community',
                icon: '📰',
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="rounded-lg border border-primary/10 bg-card p-6 hover:border-primary/30 transition-colors"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="font-semibold text-lg text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary/5 py-16 px-4 border-t border-primary/10">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to join the drone revolution?
          </h2>
          <p className="text-muted-foreground mb-8">
            Create your account today and start collaborating with thousands of drone enthusiasts worldwide.
          </p>
          <Link href="/auth/sign-up">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-base px-8">
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-primary/10 bg-background py-8 px-4">
        <div className="mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-foreground mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Security
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Docs
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Community
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Support
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-primary/10 pt-8">
            <p className="text-sm text-muted-foreground text-center">
              © 2024 Drone-a-charya. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
