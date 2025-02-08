import { useState, useEffect } from 'react';
import { Modal } from 'antd';
import { Canvas } from '@react-three/fiber';
import { Activity, ArrowRight } from 'lucide-react';
import * as Tooltip from "@radix-ui/react-tooltip";
import SpaceWarp from './spaceWrap';
import StarField from './starField';
import NebulaMist from './NebulaMist';
import SpiralGalaxy from './spiral';
import { ConfigProvider } from 'antd';

const darkTheme = {
  token: {
    colorBgElevated: 'black',
    colorText: 'white',
  },
};
const lightTheme = {
  token: {
    colorBgElevated: 'white',
    colorText: 'black',
  },
};

const useCircadianTheme = () => {
  const [theme, setTheme] = useState(() => {
    const hour = new Date().getHours();
    return hour >= 6 && hour < 18 ? lightTheme : darkTheme;
  });

  return theme;
};

const Focus = () => {
  const modetype = [0, 1, 2]
  const hour = new Date().getHours();
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [audio] = useState(new Audio('/music/suspense-slow.mp3')); 
  const [mode, setMode] = useState<number>(modetype[hour%3]);
  const increment = ()=>{
    setMode((mode+1)%3);
  } 
 
  useEffect(() => {
    if (open) {
      audio.loop = true; 
      audio.play();
    } else {
      audio.pause();
      audio.currentTime = 0; 
    }

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [open, audio]);

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    setOpen(false);
    setConfirmLoading(false);
  };

  const handleCancel = () => {
    console.log('Clicked cancel button');
    setOpen(false);
  };
  

  return (
    <>
      <Tooltip.Provider>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <button onClick={showModal}>
              <Activity />
            </button>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content className="TooltipContent" sideOffset={5}>
              <div className='opacity-100'>
                Focus Mode
              </div>
              <Tooltip.Arrow className="TooltipArrow" />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>
      <ConfigProvider theme={darkTheme}>
        <Modal
          title="Focus Mode"
          open={open}
          onOk={handleOk}
          confirmLoading={confirmLoading}
          onCancel={handleCancel}
          width="100%"
          style={{ 
            top: 0, 
            padding: 0, 
            maxWidth: '100vw', 
            position: 'relative',
          }}
          bodyStyle={{ height: '90vh', overflow: 'hidden' }}
          footer={null}
        >
          <Canvas camera={{ position: [0, 0, 5] }}>
            {
                mode === 0 &&
                <SpaceWarp />
            }
            {
                mode === 1 &&
                <NebulaMist />
            }
            {
                mode === 2 &&
                <SpiralGalaxy />
            }
          </Canvas>
            <div style={{
                position: 'absolute',
                bottom: '20px',
                right: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                padding: '10px',
                borderRadius: '50%',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
            }}
            onClick={increment}
            >
                <ArrowRight size={24} />
            </div>
        </Modal>
      </ConfigProvider>
    </>
  );
}

export default Focus;
