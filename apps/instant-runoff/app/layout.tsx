import '../pages/styles.css';
import { AppLink } from '../components/app-link/app-link';
import { Tooltip } from '../components/tooltip/tooltip';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <head />
      <body>
        <nav>
          <AppLink href="/">
            <Tooltip title="Home">
              <i className="fa-solid fa-square-poll-vertical home-icon"></i>
            </Tooltip>
            <div className="sr-only">Home</div>
          </AppLink>
        </nav>
        {children}
      </body>
    </html>
  );
}
