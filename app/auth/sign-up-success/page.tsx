import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-background via-background to-background/95 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-primary">Drone-a-charya</h1>
          <p className="mt-2 text-sm text-muted-foreground">Welcome aboard!</p>
        </div>

        <Card className="border-primary/20">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
              <svg
                className="h-6 w-6 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <CardTitle className="text-2xl">Account Created!</CardTitle>
            <CardDescription>
              Verify your email to get started
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              We&apos;ve sent a confirmation email to your inbox. Click the link in the email to verify your account and unlock all features of Drone-a-charya.
            </p>
            <div className="rounded-md bg-accent/10 p-3">
              <p className="text-xs text-accent-foreground">
                Didn&apos;t receive the email? Check your spam folder or wait a few minutes.
              </p>
            </div>
            <Link href="/auth/login" className="block w-full">
              <Button className="w-full bg-primary hover:bg-primary/90">
                Back to Sign In
              </Button>
            </Link>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Need help? Contact our support team
        </p>
      </div>
    </div>
  )
}
