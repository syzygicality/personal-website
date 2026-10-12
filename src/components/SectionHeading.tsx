export default function SectionHeading({ title, className = '', children }: { title: string; className?: string; children?: React.ReactNode }) {
  return (
    <div className={`flex items-baseline gap-5 ${className}`}>
      <h2 className="m-0 text-[48px]/[.92] font-bold tracking-[-.035em]">{title}</h2>
      {children}
    </div>
  )
}
