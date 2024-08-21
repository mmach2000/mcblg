import { atomWithLocation } from 'jotai-location';

export const SERIALIZATION_OPTION = { arrayFormat: 'separator' as const, arrayFormatSeparator: '|' as const };

export const locationAtom = atomWithLocation();
