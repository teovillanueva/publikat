interface HeaderProps extends React.PropsWithChildren<{}> {
  title: string;
  description: string;
}

export function Header({ children, description, title }: HeaderProps) {
  return (
    <div className="py-6 flex items-center container">
      <div className="flex-1">
        <h1 className="text-3xl font-semibold">{title}</h1>
        <p className="text-sm mt-1 text-muted-foreground">{description}</p>
      </div>
      {children}
    </div>
  );
}
