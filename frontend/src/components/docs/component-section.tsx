interface ComponentSectionProps {
  id: string
  title: string
  description: string
  children: React.ReactNode
}

export function ComponentSection({ id, title, description, children }: ComponentSectionProps) {
  return (
    <section id={id} className="scroll-mt-8 py-8 border-b border-border last:border-b-0">
      <h3 className="text-[length:var(--text-xl)] font-semibold tracking-tight mb-1">{title}</h3>
      <p className="text-[length:var(--text-base)] text-muted-foreground mb-4">{description}</p>
      <div className="rounded-lg border bg-card p-6">
        {children}
      </div>
    </section>
  )
}
