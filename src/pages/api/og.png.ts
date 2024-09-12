import type { APIRoute } from 'astro';
import { Resvg } from '@resvg/resvg-js';
import satori from 'satori';
import { fetch } from 'ofetch';
import { memoize } from 'moderndash';
import { SatoriGraph } from '@/components/react/SatoriGraph.tsx';

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

export const GET: APIRoute = async ({ request }) => {
  const params = new URL(request.url).searchParams;

  console.log(request);

  const height = Number(params.get('height') ?? 630);
  const width = Number(params.get('width') ?? 1200);
  const title = params.get('title') ?? '';
  const content = params.get('content') ?? '';

  const { inter600, firaCode500, notoSansSC400, notoSansSC600 } = await getFonts();

  const svgString = await satori(
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

  const svgImage = new Resvg(svgString, { fitTo: { mode: 'width', value: width } });

  return new Response(svgImage.render().asPng(), { headers: { 'Content-Type': 'image/png' } });
};
