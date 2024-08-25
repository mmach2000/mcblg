import logo from '../../../public/logo-square-96.png?base64';

declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    tw?: string;
  }
}

export function SatoriGraph({ title, content }: { title: string; content: string }) {
  return (
    <div tw="flex flex-col h-full w-full bg-white" lang="zh-CN">
      <div tw="flex items-center px-6 py-8 bg-[#F3F7F9] border" style={{ borderBottom: '1px solid #E7EFF2' }}>
        <span tw="text-12 font-bold text-[#003653]" style={{ fontFamily: 'Inter, \'Noto Sans SC\'' }}>
          {title}
        </span>
      </div>
      <div
        tw="flex flex-1 px-10 text-8 overflow-hidden wrap text-transparent bg-clip-text"
        style={{
          fontFamily: 'Noto Sans SC',
          backgroundClip: 'text',
          backgroundImage: 'linear-gradient(180deg, #121a1c, #121a1c 80%, #fff 95%, #fff)',
          borderBottom: '1px solid #E7EFF2',
        }}
      >
        <p>{content}</p>
      </div>
      <div tw="flex items-center p-6 bg-[#F3F7F9]">
        <h3 tw="text-[#0073AA]" style={{ fontFamily: 'Fira Code' }}>
          mcblg.pages.dev
        </h3>
        <img src={logo} alt="logo" tw="ml-auto h-14 w-14" />
      </div>
    </div>
  );
}
