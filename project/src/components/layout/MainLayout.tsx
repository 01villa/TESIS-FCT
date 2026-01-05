import { type ReactNode } from 'react';
import { Outlet } from 'react-router-dom';

interface MainLayoutProps {
  children?: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div>
      <header>Header</header>
      <nav>Navigation</nav>
      <main>
        {children || <Outlet />}
      </main>
      <footer>Footer</footer>
    </div>
  );
};
