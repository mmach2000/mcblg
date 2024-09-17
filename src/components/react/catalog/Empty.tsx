import type { IllustrationNoContent } from '@douyinfe/semi-illustrations';
import type { CSSProperties, ReactNode } from 'react';
import { Typography } from 'tdesign-react';

interface EmptyProps {
  title: ReactNode;
  description?: ReactNode;
  image: typeof IllustrationNoContent;
  darkModeImage?: typeof IllustrationNoContent;
  palette: [string, string];
  className?: string;
}

export function Empty({ title, description, image: Image, darkModeImage: DarkModeImage, palette, className }: EmptyProps) {
  const style = { '--semi-color-primary-light-default': palette[0], '--semi-color-primary': palette[1] } as CSSProperties;

  const imageFragment = (
    typeof DarkModeImage === 'function'
      ? (
          <>
            <Image style={style} className="block dark:hidden" />
            <DarkModeImage style={style} className="hidden dark:block" />
          </>
        )
      : <Image style={style} />
  );

  return (
    <div flex="~ col items-center" className={className}>
      {imageFragment}
      <Typography.Title level="h4">{title}</Typography.Title>
      {
        Boolean(description) && <>{description}</>
      }
    </div>
  );
}
