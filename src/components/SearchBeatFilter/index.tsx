import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { type Key, Keys } from '../../types';
import { genreOptions, genreTags } from '../../utils/genreTags';
import styles from './SearchBeatFilter.module.css';
import { Dropdown, Button, MenuProps, Space } from 'antd';
import { CloseOutlined, DownOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { searchFilters, searching, selectIsSearching } from '../../reducers/searchReducer';
import { RootState } from '../../store';

export type SearchBeatFilterOptions = {
  // need to find an efficient way to type this
  key?: Key;
  genre?: (typeof genreTags)[number];
};

interface ISearchBeatFilterProps {
  currentSearchBeatFilter: SearchBeatFilterOptions | null;
  setCurrentSearchBeatFilter: Dispatch<SetStateAction<SearchBeatFilterOptions | null>>;
}

export default function SearchBeatFilter(props: ISearchBeatFilterProps) {
  const { currentSearchBeatFilter, setCurrentSearchBeatFilter } = props;
  const [currentKey, setCurrentKey] = useState<Key | undefined>(currentSearchBeatFilter?.key);
  const [currentGenre, setCurrentGenre] = useState<(typeof genreTags)[number] | undefined>(
    currentSearchBeatFilter?.genre
  );

  const dispatch = useDispatch();

  const isSearchingState = useSelector((state: RootState) => selectIsSearching(state));

  useEffect(() => {
    if (!isSearchingState) {
      setCurrentGenre(undefined);
      setCurrentKey(undefined);
    }
  });

  const keyMenuOptions: MenuProps['items'] = Keys.map((keyStr) => {
    return {
      key: keyStr,
      label: (
        <Button
          type="ghost"
          style={{ color: 'white' }}
          onClick={() => {
            dispatch(searchFilters({ key: keyStr, genre: currentGenre }));
            if (!isSearchingState) {
              dispatch(searching(true));
            }
            setCurrentKey(keyStr);
          }}
        >
          {keyStr}
        </Button>
      ),
    };
  });

  const genreMenuOptions: MenuProps['items'] = genreTags.map((genre) => {
    return {
      key: genre,
      label: (
        <Button
          type="ghost"
          style={{ color: 'white' }}
          onClick={() => {
            dispatch(searchFilters({ key: currentKey, genre }));
            if (!isSearchingState) {
              dispatch(searching(true));
            }
            setCurrentGenre(genre);
          }}
        >
          {genre}
        </Button>
      ),
      style: { backgroundColor: currentSearchBeatFilter?.genre == genre ? 'var(--primary)' : 'black' },
    };
  });

  const filterMenuOptions: MenuProps['items'] = [
    {
      key: 'key',
      label: (
        <>
          {currentSearchBeatFilter?.key ? (
            <CloseOutlined
              style={{ color: 'white' }}
              onClick={() => {
                dispatch(searchFilters({ key: undefined, genre: currentSearchBeatFilter?.genre }));
              }}
            />
          ) : null}
          <Button type="ghost" style={{ color: 'white' }}>
            Key{currentSearchBeatFilter?.key ? `  -  ${currentSearchBeatFilter.key}` : null}
          </Button>
        </>
      ),
      children: keyMenuOptions,
    },
    {
      key: 'genre',
      label: (
        <>
          {currentSearchBeatFilter?.genre ? (
            <CloseOutlined
              style={{ color: 'white' }}
              onClick={() => {
                dispatch(searchFilters({ key: currentSearchBeatFilter.key, genre: undefined }));
              }}
            />
          ) : null}
          <Button type="ghost" style={{ color: 'white' }}>
            Genre{currentSearchBeatFilter?.genre ? `  -  ${currentSearchBeatFilter?.genre}` : null}
          </Button>
        </>
      ),
      children: genreMenuOptions,
    },
  ];

  const genreMenu: MenuProps = {
    items: genreMenuOptions,
    selectable: true,
    selectedKeys: !currentGenre ? [] : [currentGenre as string],
  };

  const keyMenu: MenuProps = {
    items: keyMenuOptions,
    selectable: true,
    selectedKeys: !currentKey ? [] : [currentKey as string],
  };

  return (
    <div className={styles.container}>
      <Dropdown menu={genreMenu} placement="bottomLeft">
        <Space>
          <Button type="ghost" className={styles['btn']}>
            <DownOutlined />
            {currentGenre ? currentGenre : 'Genre'}
          </Button>
        </Space>
      </Dropdown>
      <Dropdown menu={keyMenu} placement="bottomLeft">
        <Space>
          <Button className={styles['btn']}>
            <DownOutlined />
            {currentKey ? currentKey : 'Key'}
          </Button>
        </Space>
      </Dropdown>
      {/* <Dropdown menu={{ items: keyMenuOptions }}>
          <Button type="ghost">C♯</Button>
        </Dropdown>
        <Dropdown menu={{ items: genreMenuOptions }}>
          <Button type="ghost">Hip-Hop / Rap</Button>
        </Dropdown> */}
      {/* <Button type="ghost">Tempo</Button> */}
      {/* <Slider style={{ width: '60%', marginLeft: '30px', color: 'black', accentColor: 'black' }} /> */}
    </div>
  );
}
