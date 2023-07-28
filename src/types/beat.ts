export type Beat = {
  _id: string;
  artistId: string;
  artistName: string;
  artworkKey: string | null;
  audioKey: string;
  description: string | null;
  likesCount: number;
  streamsCount: number;
  downloadCount: number;
  genreTags: Array<string>;
  otherTags: Array<string> | null;
  key: string;
  hasStems: boolean;
  majorOrMinor: 'major' | 'minor';
  flatOrSharp: 'flat' | 'sharp' | '';
  licensed: boolean;
  tempo: number;
  title: string;
  created_at: string | Date;
  updated_at: string | Date;
};

export const Keys = [
  'A',
  'A♯',
  'A♭',
  'B',
  'B♭',
  'C',
  'C#',
  'D',
  'D♭',
  'D♯',
  'E',
  'E♭',
  'F',
  'F♯',
  'G',
  'G♭',
  'G#',
] as const;

export type Key = (typeof Keys)[number];
