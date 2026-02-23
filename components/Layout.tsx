import type { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="layout">
      <header className="layout__header">
        <div className="layout__header-inner">
          <h1 className="layout__title">Casper Blog</h1>
        </div>
      </header>
      <main className="layout__main">{children}</main>
    </div>
  );
}
