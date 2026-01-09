import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/logo';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Logo className="w-16 h-16 text-primary" />
          </div>
          <CardTitle className="text-4xl font-headline text-foreground">Yakidesk</CardTitle>
          <CardDescription className="pt-2 text-base">
            Welcome back! Please sign in to book your desk.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-6 text-base">
              <Link href="/dashboard">Sign in with Google</Link>
            </Button>
          </div>
          <p className="mt-4 text-xs text-center text-muted-foreground">
            This is a simulated login. Click the button to proceed to the dashboard.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
