import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nexora Neural HQ',
  description: 'Futuristic AI headquarters visualization',
};

export default function NeuralHQLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
