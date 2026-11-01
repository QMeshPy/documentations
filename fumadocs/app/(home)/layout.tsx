export default function Layout({ children }: LayoutProps<'/'>) {
  // The home page draws its own chrome (hero panel plus README panel).
  return <>{children}</>;
}
