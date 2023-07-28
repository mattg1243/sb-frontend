import { Dropdown, Button, MenuProps } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { Dispatch, SetStateAction } from 'react';
import styles from './SearchFilter.module.css';

export type SearchFilterOptions = 'Users' | 'Beats' | 'All';

interface ISearchFilterProps {
  currentSearchFilter: SearchFilterOptions;
  setCurrentSearchFilter: Dispatch<SetStateAction<SearchFilterOptions>>;
}

export default function SearchFilter(props: ISearchFilterProps) {
  const { currentSearchFilter, setCurrentSearchFilter } = props;

  const filterMenuOptions: MenuProps['items'] = [
    {
      key: 'Beats',
      label: (
        <Button
          type="ghost"
          style={{ color: 'white' }}
          onClick={() => {
            if (currentSearchFilter !== 'Beats') {
              setCurrentSearchFilter('Beats');
            }
          }}
          id="rec-opt"
        >
          Beats
        </Button>
      ),
    },
    {
      key: 'Users',
      label: (
        <Button
          type="ghost"
          style={{ color: 'white' }}
          onClick={() => {
            if (currentSearchFilter !== 'Users') {
              setCurrentSearchFilter('Users');
            }
          }}
          id="fol-opt"
        >
          Users
        </Button>
      ),
    },
    {
      key: 'All',
      label: (
        <Button
          type="ghost"
          style={{ color: 'white' }}
          onClick={() => {
            if (currentSearchFilter !== 'All') {
              setCurrentSearchFilter('All');
            }
          }}
          id="fol-opt"
        >
          All
        </Button>
      ),
    },
  ];

  return (
    <Dropdown menu={{ items: filterMenuOptions }}>
      <Button className={styles['filter-btn']}>
        {currentSearchFilter}
        <DownOutlined />
      </Button>
    </Dropdown>
  );
}
