import type { APIRoute } from 'astro';
import { Resvg } from '@resvg/resvg-js';
import satori from 'satori';
import { fetch } from 'ofetch';
import { memoize } from 'moderndash';
import { SatoriGraph } from '@/components/react/SatoriGraph.tsx';

const FONT_FILES: Record<string, Record<string, string>> = {
  Inter: {
    600: 'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuGKYMZhrib2Bg-4.ttf',
  },
  FiraCode: {
    500: 'https://fonts.gstatic.com/s/firacode/v22/uU9eCBsR6Z2vfE9aq3bL0fxyUs4tcw4W_A9sFVfxN87gsj0.ttf',
  },
  NotoSansSC: {
    400: 'https://fonts.gstatic.com/s/notosanssc/v37/k3kCo84MPvpLmixcA63oeAL7Iqp5IZJF9bmaG9_FnYxNbPzS5HE.ttf',
    600: 'https://fonts.gstatic.com/s/notosanssc/v37/k3kCo84MPvpLmixcA63oeAL7Iqp5IZJF9bmaGwHCnYxNbPzS5HE.ttf',
  },
};

const getFont = memoize(async (font: string, weight: string) => {
  const response = await fetch(FONT_FILES[font][weight]);
  return response.arrayBuffer();
});

export const GET: APIRoute = async ({ params }) => {
  const height = Number(params.height ?? 630);
  const width = Number(params.width ?? 1200);

  const firaCode = await getFont('FiraCode', '500');
  const inter = await getFont('Inter', '600');
  const notoSansSC400 = await getFont('NotoSansSC', '400');
  const notoSansSC600 = await getFont('NotoSansSC', '600');

  const svg = await satori(
    SatoriGraph({ title: params.title ?? '', content: params.title ?? '' }),
    {
      fonts: [
        { name: 'Inter', data: inter, style: 'normal' },
        { name: 'Fira Code', data: firaCode, style: 'normal' },
        { name: 'Noto Sans SC', data: notoSansSC400, style: 'normal', weight: 400 },
        { name: 'Noto Sans SC', data: notoSansSC600, style: 'normal', weight: 600 },
      ],
      height,
      width,
    },
  );

  const resvg = new Resvg(svg, {
    fitTo: {
      mode: 'width',
      value: width,
    },
  });

  const image = resvg.render();

  return new Response(image.asPng(), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
