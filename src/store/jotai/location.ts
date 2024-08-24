import { atomWithLocation } from 'jotai-location';

export const QUERY_STRING_OPTION = { arrayFormat: 'separator' as const, arrayFormatSeparator: '|' as const };

export const locationAtom = atomWithLocation({ replace: true });
