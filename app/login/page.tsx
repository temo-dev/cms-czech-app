import { LoginForm } from '@/components/auth/login-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface LoginPageProps {
  searchParams: Promise<{ error?: string }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { error } = await searchParams

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50">
      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Trvalý Prep CMS</CardTitle>
          <CardDescription>Đăng nhập bằng tài khoản admin</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2">
              {error === 'forbidden' ? 'Tài khoản không có quyền truy cập CMS' : error}
            </div>
          )}
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  )
}
