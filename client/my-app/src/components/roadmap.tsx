import React, { useState } from 'react';
import { Timeline, Modal } from 'antd';
import {Network} from 'lucide-react';
import * as Tooltip from "@radix-ui/react-tooltip";
import axios from 'axios';
import { MindMap, type MindMapOptions } from '@ant-design/graphs';

interface timelineObj{
  id: string,
  children: timelineObj[]
}

interface props {
  rating: Number | null
}

const Roadmap: React.FC<props> = ({rating}) => {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState('Content of the modal');
  const nodeBase = 'https://codeassist-q2nt.onrender.com';
  const [timeline, setTimeline] = useState<timelineObj[]>([]);
  const showModal = () => {
    setOpen(true);
  };
  const roadMap = async()=>{
    try{
        console.log("pls wait");
        const response = await axios.post(`${nodeBase}/roadmap/v2/roadmap`, {
            rating: rating
        });
        console.log(response);
        setTimeline(response.data.data);
        setOpen(true);
    } catch(err){
        console.log(err);
    }
}
  const handleOk = () => {
    setOpen(false);
    setConfirmLoading(false);
  };

  const handleCancel = () => {
    console.log('Clicked cancel button');
    setOpen(false);
  };
  const data = {
    id: "Roadmap",
    children: timeline
  }
  const options: MindMapOptions = {
    autoFit: 'view',
    data,
    width:1400,
    animation: true,
  };
  return (
    <>
      <Tooltip.Provider>
          <Tooltip.Root>
              <Tooltip.Trigger asChild>
                  <button onClick={roadMap} disabled={rating === null ? true: false}>
                      <Network />
                  </button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                  <Tooltip.Content className="TooltipContent" sideOffset={5}>
                      <div className='opacity-100'>
                          Roadmap
                      </div>
                      <Tooltip.Arrow className="TooltipArrow" />
                  </Tooltip.Content>
              </Tooltip.Portal>
          </Tooltip.Root>
      </Tooltip.Provider>
      <Modal
        title="Roadmap"
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
        bodyStyle={{ height: '84vh', overflow: 'hidden' }}
      >
        <>
          <MindMap {...options} type="boxed"/>
        </>
      </Modal>
    </>
  );
};

export default Roadmap;