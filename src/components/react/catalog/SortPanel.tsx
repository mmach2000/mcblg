import {
  orderAtom,
  SORT_METHODS,
  SORT_NAMES,
  SORT_ORDERS,
  sortAtom,
  type SortMethod,
  type SortOrder,
} from '@/store/jotai/catalog-page.ts';
import { useAtom } from 'jotai/index';
import { Button, Dropdown } from 'tdesign-react';

export function SortPanel() {
  // const [sortOption, setSortOption] = useAtom(sortAtom);
  const [[sort], setSort] = useAtom(sortAtom);
  const [[order], setOrder] = useAtom(orderAtom);

  const options = SORT_METHODS.flatMap(key =>
    SORT_ORDERS.map(order => ({
      content: `${SORT_NAMES[key]}${SORT_NAMES[order]}`,
      value: { sort: key, order },
      divider: true,
    })));
  options.at(-1)!.divider = false;

  return (
    <Dropdown
      options={options}
      onClick={(data) => {
        const value = data.value as { sort: SortMethod; order: SortOrder };
        setSort([value.sort]);
        setOrder([value.order]);
      }}
    >
      <Button variant="outline" size="small">
        <span flex="~ items-center">
          {SORT_NAMES[sort]}
          {SORT_NAMES[order]}
          <span i-lucide:chevron-down ml-1 />
        </span>
      </Button>
    </Dropdown>
  );
}
