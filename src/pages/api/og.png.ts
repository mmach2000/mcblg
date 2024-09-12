import type { APIRoute } from 'astro';
import { Resvg } from '@resvg/resvg-wasm';
import satori from 'satori';
import { fetch } from 'ofetch';
import { memoize } from 'moderndash';
import { SatoriGraph } from '@/components/react/SatoriGraph.tsx';

export const prerender = false;

const FONT_FILES: Record<string, string> = {
  inter600: 'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuGKYMZhrib2Bg-4.ttf',
  firaCode500: 'https://fonts.gstatic.com/s/firacode/v22/uU9eCBsR6Z2vfE9aq3bL0fxyUs4tcw4W_A9sFVfxN87gsj0.ttf',
  notoSansSC400: 'https://fonts.gstatic.com/s/notosanssc/v37/k3kCo84MPvpLmixcA63oeAL7Iqp5IZJF9bmaG9_FnYxNbPzS5HE.ttf',
  notoSansSC600: 'https://fonts.gstatic.com/s/notosanssc/v37/k3kCo84MPvpLmixcA63oeAL7Iqp5IZJF9bmaGwHCnYxNbPzS5HE.ttf',
};

const getFonts = memoize(async () => {
  const fonts = Promise.all(
    Object.entries(FONT_FILES).map(async ([key, value]) => {
      const response = await fetch(value);
      return [key, await response.arrayBuffer()] as [string, ArrayBuffer];
    }),
  );
  return Object.fromEntries(await fonts);
});

interface Props {
  height?: number;
  width?: number;
  title?: string;
  content?: string;
}

export async function renderSvg({ height = 630, width = 1200, title = '', content = '' }: Props) {
  const { inter600, firaCode500, notoSansSC400, notoSansSC600 } = await getFonts();

  return satori(
    SatoriGraph({ title, content }),
    {
      fonts: [
        { name: 'Inter', data: inter600, style: 'normal' },
        { name: 'Fira Code', data: firaCode500, style: 'normal' },
        { name: 'Noto Sans SC', data: notoSansSC400, style: 'normal', weight: 400 },
        { name: 'Noto Sans SC', data: notoSansSC600, style: 'normal', weight: 600 },
      ],
      height,
      width,
    },
  );
}

export const GET: APIRoute = async ({ request }) => {
  const params = new URL(request.url).searchParams;

  const height = Number(params.get('height') ?? 630);
  const width = Number(params.get('width') ?? 1200);
  const title = params.get('title') ?? '';
  const content = params.get('content') ?? '';

  const svg = await renderSvg({ height, width, title, content });
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: width } }).render().asPng();

  return new Response(png, { headers: {
    'Content-Type': 'image/png',
    'Cache-Control': `public, max-age=${60 * 60 * 24 * 10}`,
  } });
};
