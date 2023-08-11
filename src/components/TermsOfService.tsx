import { useState } from 'react';
import { Modal, Divider, Button, Tooltip } from 'antd';
import { useBottomScrollListener } from 'react-bottom-scroll-listener';
import Terms from './pages/Terms';

export default function TermsOfService(props: { setAgreedToTerms: React.Dispatch<React.SetStateAction<boolean>> }) {
  const { setAgreedToTerms } = props;

  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [scrolledDown, setScrolledDown] = useState<boolean>();
  const [agreed, setAgreed] = useState<boolean>(false);

  const scrollRef = useBottomScrollListener<HTMLDivElement>(() => setScrolledDown(true), { offset: 750 });

  return (
    <>
      <a rel="noreferrer" href={'#'} onClick={() => setIsOpen(true)}>
        terms and conditions
      </a>
      <Modal title="Terms of Service" open={isOpen} onCancel={() => setIsOpen(false)} footer={null}>
        <div id="terms-doc" ref={scrollRef} style={{ height: '50vh', overflow: 'scroll', margin: '2vw' }}>
          <Terms />
        </div>
        <Divider />
        <Button onClick={() => setIsOpen(false)}>Cancel</Button>
        <Tooltip title={!scrolledDown && !agreed ? 'Please read the entire terms of service before agreeing.' : null}>
          <Button
            style={{ marginLeft: '1rem', backgroundColor: 'var(--primary)', color: 'black' }}
            disabled={!scrolledDown}
            onClick={() => {
              if (!agreed) {
                setAgreedToTerms(true);
                setAgreed(true);
                setTimeout(() => {
                  setIsOpen(false);
                }, 500);
              }
            }}
          >
            {agreed ? 'Agreed ✔' : 'I agree'}
          </Button>
        </Tooltip>
      </Modal>
    </>
  );
}
