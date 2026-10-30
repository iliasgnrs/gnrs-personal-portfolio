import {
  Layers,
  Code2,
  Plug,
  Server,
  Bot,
  Sparkles,
  ShoppingCart,
  CalendarClock,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface Expertise {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const expertise: Expertise[] = [
  {
    icon: Layers,
    title: 'Headless Architecture',
    description:
      'Decoupled frontends (React/Vite) consuming WordPress/WooCommerce as a backend via REST/GraphQL.',
  },
  {
    icon: Code2,
    title: 'TypeScript & React Engineering',
    description:
      'Type-safe, component-driven frontends built for scale and long-term maintainability.',
  },
  {
    icon: Plug,
    title: 'WordPress & WooCommerce Plugins',
    description:
      'Custom PHP plugins, hooks, REST endpoints, and checkout/payment logic tailored to business needs.',
  },
  {
    icon: Server,
    title: 'PHP Backend Engineering',
    description:
      'Custom APIs, third-party integrations, and performance optimization for high-traffic sites.',
  },
  {
    icon: Bot,
    title: 'MCP Server Development',
    description:
      'Building Model Context Protocol servers that connect AI assistants to real business systems.',
  },
  {
    icon: Sparkles,
    title: 'Custom AI Agent Skills',
    description:
      'Designing agentic workflows and skills that automate reporting, compliance, and content pipelines.',
  },
  {
    icon: ShoppingCart,
    title: 'eCommerce Systems',
    description:
      'End-to-end WooCommerce builds: payment gateways, product/catalog architecture, checkout flows.',
  },
  {
    icon: CalendarClock,
    title: 'PWA & Booking Systems',
    description:
      'Installable web apps and real-time booking engines for hospitality, sailing, and services.',
  },
];
