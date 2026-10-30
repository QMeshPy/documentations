import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col justify-center flex-1 px-6 py-16 max-w-3xl mx-auto w-full">
      <p className="text-sm font-medium text-fd-muted-foreground mb-3">
        Distributed Quantum Services
      </p>
      <h1 className="text-4xl font-bold tracking-tight mb-4">QMesh Docs</h1>
      <p className="text-lg text-fd-muted-foreground mb-8">
        Architecture, research, implementation notes, and roadmap for the
        QMeshPy distributed quantum platform.
      </p>
      <div className="flex flex-wrap gap-3">
        <Link
          href="/docs"
          className="inline-flex items-center rounded-lg bg-fd-primary px-4 py-2 text-sm font-medium text-fd-primary-foreground"
        >
          Start here
        </Link>
        <Link
          href="/docs/architecture"
          className="inline-flex items-center rounded-lg border px-4 py-2 text-sm font-medium"
        >
          Architecture
        </Link>
        <Link
          href="/docs/research"
          className="inline-flex items-center rounded-lg border px-4 py-2 text-sm font-medium"
        >
          Research
        </Link>
      </div>
    </div>
  );
}
