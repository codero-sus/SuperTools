import React from 'react';
import * as Icons from 'lucide-react';

interface DynamicIconProps {
  name: string;
  className?: string;
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({ name, className = 'w-5 h-5' }) => {
  // @ts-expect-error dynamic indexing into Lucide icons
  const Component = Icons[name] || Icons.Wrench || Icons.Box;
  return <Component className={className} />;
};
