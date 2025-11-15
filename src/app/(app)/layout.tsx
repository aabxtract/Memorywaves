import { AppSidebar } from "@/components/layout/AppSidebar";
import { Header } from "@/components/layout/Header";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full">
      <aside className="hidden md:block md:w-72 border-r bg-background">
        <div className="sticky top-0 flex h-screen flex-col">
            <AppSidebar />
        </div>
      </aside>
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 container py-8 px-4 md:px-8">
            {children}
        </main>
      </div>
    </div>
  );
}
