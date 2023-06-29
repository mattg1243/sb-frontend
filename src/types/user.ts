export interface ILinkedSocials {
  twitter: string;
  instagram: string;
  youtube: string;
  spotify: string;
  appleMusic: string;
  soundcloud: string;
}

export type User = {
  _id: string;
  artistName: string;
  avatar: string;
  bio: string;
  socialLink: string;
  creditsAcquired: number;
  creditsToSpend: number;
  email: string;
  fname: string;
  lname: string;
  subTier: number;
  totalCreditsAcquired: number;
  uploadedBeats: Array<string>;
  verified: boolean;
  created_at: string;
  updated_at: string;
};
