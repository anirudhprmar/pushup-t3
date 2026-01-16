import { api, HydrateClient } from "~/trpc/server";

import { redirect } from "next/navigation";
import HabitVisualizer from "../habits/_components/HabitVisualizer";
import UserProgress from "./_components/UserProgress";
import MonthlyAnalysis from "./_components/MonthlyAnalysis";


export default async function profile() {

  const user = await api.user.me();

  if (!user) {
    redirect("/login")
  }

  const date = new Date().toISOString().split("T")[0]!
  const year = date.split('-')[0]
  
  return (
    <HydrateClient>
      <main className="min-h-screen">
        <div className="mx-auto max-w-4xl p-3">
          <header className="flex items-center justify-between gap-2">
            <h1 className="font-bold text-3xl">Hi!, {user.name?.split(" ")[0] ?? "there"}</h1>
            <p className="text-3xl text-muted-foreground tracking-tighter" aria-label={`Year ${year}`}>
              {year}
            </p>
          </header>

          <section aria-label="Habit Progress Visualization" className="flex flex-col items-center justify-center w-fit mx-auto py-10">
            <HabitVisualizer />
            <UserProgress />
          </section>

          <section aria-label="Monthly Analysis">
            <MonthlyAnalysis />
          </section>
        </div>
      </main>
    </HydrateClient>
  );
}