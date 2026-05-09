import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { DashboardContent } from '@/components/dashboard/dashboard-content'
import { ParticlesBackground } from '@/components/dashboard/particles-background'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      <ParticlesBackground />
      <div className="relative z-10">
        <DashboardHeader user={user} />
        <DashboardContent user={user} />
      </div>
    </div>
  )
}
