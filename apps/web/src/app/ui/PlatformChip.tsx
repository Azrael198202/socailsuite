'use client';
import { cx } from '@/app/lib/platforms';
import React from 'react';

export default function PlatformChip({
  name,
  Icon,
  colorClass,
  active = false,
  asButton = false,
  ...rest
}: {
  name: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  colorClass: string;             // 如 'bg-red-500'
  active?: boolean;
  asButton?: boolean;
} & React.ComponentProps<'div'> & React.ComponentProps<'button'>) {
  const Cmp: any = asButton ? 'button' : 'div';
  return (
    <Cmp
      className={cx(
        'inline-flex h-9 items-center gap-2 rounded-xl border px-3 text-xs leading-none bg-white',
        active ? 'border-gray-200 shadow-[inset_0_0_0_2px_rgba(17,24,39,1)]' : 'border-gray-200'
      )}
      {...rest}
    >
      <span className={cx('inline-block h-3.5 w-3.5 rounded shrink-0 align-middle', colorClass)} />
      <Icon className="h-4 w-4 shrink-0 align-middle" />
      <span className="align-middle ">{name}</span>
    </Cmp>
  );
}
