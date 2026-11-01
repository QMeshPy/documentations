import defaultMdxComponents from 'fumadocs-ui/mdx';
import { Accordion, Accordions } from 'fumadocs-ui/components/accordion';
import { Step, Steps } from 'fumadocs-ui/components/steps';
import { Tab, Tabs } from 'fumadocs-ui/components/tabs';
import { File, Files, Folder } from 'fumadocs-ui/components/files';
import { TypeTable } from 'fumadocs-ui/components/type-table';
import {
  BookOpen,
  Boxes,
  Coins,
  Cpu,
  FlaskConical,
  Fingerprint,
  Globe,
  Layers,
  LineChart,
  Network,
  PackageCheck,
  Rocket,
  Server,
  ShieldCheck,
  Wallet,
  Bot,
  Link2,
  Map,
  Download,
  Terminal,
  Handshake,
  Route,
  Radar,
  ScrollText,
} from 'lucide-react';
import type { MDXComponents } from 'mdx/types';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { Mermaid } from './mermaid';
import { Iso } from './iso';

/** Icons available inside MDX, e.g. `<Card icon={<Network />} />`. */
const icons = {
  BookOpen,
  Boxes,
  Coins,
  Cpu,
  FlaskConical,
  Fingerprint,
  Globe,
  Layers,
  LineChart,
  Network,
  PackageCheck,
  Rocket,
  Server,
  ShieldCheck,
  Wallet,
  Bot,
  Link2,
  Map,
  Download,
  Terminal,
  Handshake,
  Route,
  Radar,
  ScrollText,
};

function Cards({ children }: { children: ReactNode }) {
  return <div className="qm-cards not-prose">{children}</div>;
}

function Card({
  title,
  href,
  icon,
  children,
}: {
  title: ReactNode;
  href?: string;
  icon?: ReactNode;
  children?: ReactNode;
}) {
  const body = (
    <>
      {icon}
      <h3>{title}</h3>
      {children ? <div className="qm-card-body">{children}</div> : null}
    </>
  );
  return href ? (
    <Link href={href} className="qm-card">
      {body}
    </Link>
  ) : (
    <div className="qm-card">{body}</div>
  );
}

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    Accordion,
    Accordions,
    Step,
    Steps,
    Tab,
    Tabs,
    File,
    Files,
    Folder,
    TypeTable,
    Mermaid,
    Iso,
    Cards,
    Card,
    ...icons,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
