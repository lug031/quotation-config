interface PlaceholderPageProps {
  title: string;
}

export function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <main className="min-h-0 min-w-0 flex-1 overflow-auto px-4 py-8">
      <div className="rounded-md border border-slate-200 bg-white p-8 text-center text-slate-600">
        <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
      </div>
    </main>
  );
}
