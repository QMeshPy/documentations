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
} from 'lucide-react';
import type { MDXComponents } from 'mdx/types';
import { Mermaid } from './mermaid';

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
};

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
    ...icons,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
