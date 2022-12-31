export const genreTags = [
  'Pop',
  'Rock',
  'Hip-Hop & Rap',
  'Country',
  'R&B',
  'Folk',
  'Jazz',
  'Heavy Metal',
  'EDM',
  'Soul',
  'Funk',
  'Reggae',
  'Disco',
  'Punk Rock',
  'Classical',
  'House',
  'Techno',
  'Indie',
  'Grunge',
  'Ambient',
  'Gospel',
  'Latin',
  'Grime',
  'Trap',
  'Psychedelic Rock',
]
// in option form for selector components
interface Option {
  label: string,
  value: string,
}

export const genreOptions: Option[] = genreTags.map((val) => ({ label: val, value: val }));