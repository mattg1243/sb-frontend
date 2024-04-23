import { Helmet } from 'react-helmet-async';

interface IBeatMetadataProps {
  title: string;
  artistName: string;
  imgSrc: string;
  url: string;
}

export function BeatMetadata(props: IBeatMetadataProps) {
  const { title, artistName, imgSrc, url } = props;

  return (
    <Helmet>
      <title>
        {title} by {artistName}
      </title>
      <meta property="og:title" content={title} />
      <meta property="og:description" content="Get this beat at sweatshopbeats.com!" />
      <meta property="og:image" content={imgSrc} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="music.song" />
    </Helmet>
  );
}

interface IUserMetadata {
  artistName: string;
  imgSrc: string;
  url: string;
}

export function UserMetadata(props: IUserMetadata) {
  const { artistName, imgSrc, url } = props;

  return (
    <Helmet>
      <title>{artistName} on Sweatshop Beats</title>
      <meta property="og:title" content={`${artistName} on Sweatshop Beats`} />
      <meta property="og:image" content={imgSrc} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="profile" />
    </Helmet>
  );
}
