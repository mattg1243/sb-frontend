export type Beat = {
  _id: string;
  artistId: string;
  artistName: string;
  artworkKey: string | null;
  audioKey: string;
  description: string | null;
  genreTags: Array<string>;
  otherTags: Array<string> | null;
  key: string;
  majorOrMinor: 'major' | 'minor';
  flatOrSharp: 'flat' | 'sharp' | '';
  licensed: boolean;
  tempo: number;
  title: string;
  created_at: string | Date;
  updated_at: string | Date;
};
