import NextLink from 'next/link';
import { Link } from '@chakra-ui/react';

type AppLinkProps = {
  className?: string;
  children: React.ReactNode;
  href: string;
};

export function AppLink(props: AppLinkProps) {
  const { className, children, href } = props;
  return (
    <Link
      as={NextLink}
      href={href}
      className={className}
      color="var(--primary-color)"
    >
      {children}
    </Link>
  );
}

export default AppLink;
