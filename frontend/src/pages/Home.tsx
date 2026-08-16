import AppBar from "@/components/Header";
import { SideBar } from "@/components/SideBar";
import Map from "@/components/Map";
import { SchoolProvider } from "@/context/SchoolProvider";

export default function HomePage() {
  return (
    <div className="flex h-screen min-h-0 flex-col text-foreground">
      <AppBar />

      <main className="flex-1 min-h-0 w-full p-6">
        <section className="flex h-full min-h-0 flex-row gap-6">
          <SchoolProvider>
            <SideBar />
            <Map />
          </SchoolProvider>
        </section>
      </main>

      <footer className="w-full shrink-0 border-t border-divider bg-surface px-8 py-2 text-xs text-foreground-500">
        <div className="flex justify-between">
          <span className="text-orange-600">
            This is a private project! No
            guarantees!
          </span>
          <span>Version: 1.0.0</span>
        </div>
      </footer>
    </div>
  );
}