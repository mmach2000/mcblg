// noinspection JSUnusedGlobalSymbols

declare module 'my-virtual-tags' {
  const tagToPageInfos: import('./index').TagToPageInfos;
  export default tagToPageInfos;
}

declare module 'my-virtual-page-info' {
  const routeToPageInfo: import('./index').RouteToPageInfo;
  export default routeToPageInfo;
}
