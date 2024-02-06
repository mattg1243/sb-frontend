import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SearchInput() {
  const [query, setQuery] = useState<string>();

  const navigate = useNavigate();

  const handleSearch = () => {
    navigate(`/app/search?query=${query}`);
  };

  return (
    <Input
      type="text"
      style={{
        borderRadius: '40px',
        width: window.location.pathname == '/' ? '20vw' : '14vw',
      }}
      placeholder="Search"
      suffix={<SearchOutlined onClick={handleSearch} />}
      onChange={(e) => {
        setQuery(e.target.value);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          handleSearch();
        }
      }}
    />
  );
}
