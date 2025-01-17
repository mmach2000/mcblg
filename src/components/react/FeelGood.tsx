import { getRating10, setRating10 } from '@/utils/supabase/feel-good.ts';
import { QueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { Rate } from 'tdesign-react';

const CLIENT = new QueryClient();

function Rate10({ value, onChange }: { value?: number; onChange: (value: number) => void }) {
  return (
    <div>
      <Rate
        allowHalf
        value={(value ?? 0) / 2}
        onChange={value => onChange(value * 2)}
      />
    </div>
  );
}

export function FeelGood({ pageSlug }: { pageSlug: string }) {
  const { data: response, isLoading } = useQuery({
    queryKey: ['feel-good-get', pageSlug],
    queryFn: async () => getRating10(pageSlug),
  }, CLIENT);

  const { mutate } = useMutation({
    mutationFn: async (rating: number) => setRating10(pageSlug, rating),
    onMutate: (variables) => {
      CLIENT.setQueryData(['feel-good-get', pageSlug], { data: { rating10: variables } });
    },
  }, CLIENT);

  return (
    !isLoading
    && (
      <>
        <h3>
          {
            typeof response?.data?.rating10 === 'number'
              ? '已评分'
              : '给这篇文章打个分吧'
          }
        </h3>
        <div flex="~ row justify-center">
          <Rate10 value={response?.data?.rating10} onChange={mutate} />
        </div>
      </>
    )
  );
}
