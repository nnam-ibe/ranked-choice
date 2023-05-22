import NextLink from 'next/link';

type AppLinkProps = {
  className?: string;
  children: React.ReactNode;
  href: string;
};

export function AppLink(props: AppLinkProps) {
  const { className, children, href } = props;
  return (
    <NextLink href={href} className={className}>
      {children}
    </NextLink>
  );
}

export default AppLink;
