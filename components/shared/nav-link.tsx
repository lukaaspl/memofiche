import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";

interface NavLinkProps {
  render: (isActive: boolean) => JSX.Element;
  href: string;
  exact?: boolean;
}

export default function NavLink({
  render,
  href,
  exact = false,
}: NavLinkProps): JSX.Element {
  const { pathname } = useRouter();
  const isActive = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Link href={href} passHref>
      <a className={clsx({ active: isActive })}>{render(isActive)}</a>
    </Link>
  );
}
