interface HeaderProps {
  status: string
}

export default function Header({ status }: HeaderProps) {
  return (
    <div className="flex justify-between p-4">
      <div className="flex items-center">
        <div className="mr-2 rounded-full bg-accent w-3 h-3"></div>
        <p>Sweet Story</p>
      </div>
      <div className="bg-card px-3 py-1 rounded-full">
        <p className="text-accent">{status}</p>
      </div>
    </div>
  )
}
