export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full max-w-[1200px] mx-auto space-y-6">
      {children}
    </div>
  )
}