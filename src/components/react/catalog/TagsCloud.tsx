import { excludeAtom, includeAtom } from '@/store/jotai/catalog-page.ts';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { useAtom } from 'jotai/index';
import { Button, CheckTag } from 'tdesign-react';

export function TagsCloud({ tags }: { tags: string[] }) {
  const [parent] = useAutoAnimate();
  const [include, setInclude] = useAtom(includeAtom);
  const [exclude, setExclude] = useAtom(excludeAtom);

  function propsFactory(tag: string) {
    if (include.includes(tag)) {
      return {
        theme: 'success' as const,
        icon: <span i-lucide:filter mr-2 />,
        onClick: () => {
          // include -> exclude
          setInclude(include.filter(t => t !== tag));
          setExclude([tag, ...exclude]);
        },
      };
    } else if (exclude.includes(tag)) {
      return {
        theme: 'danger' as const,
        icon: <span i-lucide:filter-x mr-2 />,
        onClick: () => {
          // exclude -> default
          setExclude(exclude.filter(t => t !== tag));
        },
      };
    } else {
      return {
        theme: 'default' as const,
        icon: <span i-lucide:tag mr-2 />,
        onClick: () => {
          // default -> include
          setInclude([tag, ...include]);
        },
      };
    }
  }

  return (
    <div flex="~ gap-2 wrap 1" ref={parent}>
      {tags.map(tag => (
        <CheckTag key={tag} {...propsFactory(tag)}>
          <span font-mono mb="[-2px]">
            {tag}
          </span>
        </CheckTag>
      ))}
      {(include.length > 0 || exclude.length > 0) && (
        <Button
          size="small"
          theme="default"
          variant="outline"
          onClick={() => {
            setInclude([]);
            setExclude([]);
          }}
          icon={<span i-lucide:refresh-ccw mr-2 />}
        >
          <span font-mono mb="[-2px]">
            重置筛选
          </span>
        </Button>
      )}
    </div>
  );
}
