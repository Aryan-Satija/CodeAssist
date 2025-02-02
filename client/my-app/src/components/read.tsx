import {useState} from 'react';
import * as Tooltip from "@radix-ui/react-tooltip";
import { BookOpenText } from 'lucide-react';
import { Timeline, Carousel, Modal } from 'antd';
import axios from 'axios';
interface timelineObj{
  children: String
}
const Read = ({rating} : {rating: Number | null}) => {
      const [open, setOpen] = useState(false);
      const [confirmLoading, setConfirmLoading] = useState(false);
      const [timeline, setTimeline] = useState<timelineObj[]>([]);
      const nodeBase = 'https://codeassist-q2nt.onrender.com';
      console.log(timeline)
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
      const roadMap = async()=>{
        try{
            console.log("pls wait");
            const response = await axios.post(`${nodeBase}/roadmap/roadmap`, {
                lc_rating: rating
            });
            setTimeline(response.data.data.map((top : String) => {
                return {
                    children: top
                }
            }));
            setOpen(true);
        } catch(err){
            console.log(err);
        }
      }
  return (
    <>
        <Tooltip.Provider>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <button onClick={() => {
                  if(rating === null) return;
                  setOpen(true)
                  roadMap();
                }}>
                  <BookOpenText />
                </button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content className="TooltipContent" sideOffset={5}>
                  <div className="opacity-100">Read</div>
                  <Tooltip.Arrow className="TooltipArrow" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>
        <Modal
            title="Read Blogs"
            open={open}
            onOk={handleOk}
            confirmLoading={confirmLoading}
            onCancel={handleCancel} 
        >
            <div>
                <p className='mt-12'>
                  <Timeline
                    items={timeline.map(item => ({
                      children: <a href={`/blogs/${item.children}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">{item.children}</a>
                    }))}
                  />
                </p>
                <div className='text-xl font-bold text-slate-700'>Other Blogs</div>
                <Carousel arrows infinite={false} className='bg-[#2c3849] opacity-95 text-slate-950 h-full flex flex-col items-center justify-center px-6'>
                    
                    <div
                        className="text-[#ffffff] bg-[#ffffff]/30 border-[1px] border-[#ffffff] py-2 my-2 px-4 rounded-lg shadow flex flex-col items-center justify-center"
                    >
                        <div className="pb-2">Combinatorics (Math)</div>
                        <div>
                          If there are m ways to do job 1 and n ways to do job 2, then the total number of ways to do job 1 and then job 2 is ...
                        </div>
                        <div>
                            {<img src={"https://res.cloudinary.com/dinouvzsz/image/upload/v1737522421/Combinatorics-new_bgxizm.png"} className='size-40 opacity-70 rounded-md'/>}
                        </div>
                        <div className="text-blue-400 hover:text-blue-600 duration-200 underline cursor-pointer">
                        <a href={`/blogs/combinatorics`} target="_blank">
                            Click Here...
                        </a>
                        </div>
                    </div>
                    <div
                        className="text-[#ffffff] bg-[#ffffff]/30 border-[1px] border-[#ffffff] py-2 my-2 px-4 rounded-lg shadow flex flex-col items-center justify-center"
                    >
                        <div className="pb-2">Sliding Window (Two Heaps Strategy)</div>
                        <div>
                          Sliding Window can be used to find number of subarrays having at least k distinct numbers. Use variable size ...
                        </div>
                        <div>
                            {<img src={"https://res.cloudinary.com/dinouvzsz/image/upload/v1737536239/2-heap-strategy-removebg_chzxwx.png"} className='size-40 opacity-70 rounded-md'/>}
                        </div>
                        <div className="text-blue-400 hover:text-blue-600 duration-200 underline cursor-pointer">
                        <a href={`/blogs/sliding-window-two-heaps`} target="_blank">
                            Click Here...
                        </a>
                        </div>
                    </div>
                    <div
                        className="text-[#ffffff] bg-[#ffffff]/30 border-[1px] border-[#ffffff] py-2 my-2 px-4 rounded-lg shadow flex flex-col items-center justify-center"
                    >
                        <div className="pb-2">Geometry</div>
                        <div>
                          Area of the quadrilateral with the points: (x1, y1), (x2, y2), (x3, y3), (x4, y4) will be (((x3 - x1)*(y4 - y2)) - ((x4 - x2)*(y3 - y1)))/2...
                        </div>
                        <div>
                            {<img src={"https://res.cloudinary.com/dinouvzsz/image/upload/v1738505721/image-removebg-preview_sjfh9h.png"} className='size-40 opacity-70 rounded-md'/>}
                        </div>
                        <div className="text-blue-400 hover:text-blue-600 duration-200 underline cursor-pointer">
                        <a href={`/blogs/geometry`} target="_blank">
                            Click Here...
                        </a>
                        </div>
                    </div>
                    <div
                        className="text-[#ffffff] bg-[#ffffff]/30 border-[1px] border-[#ffffff] py-2 my-2 px-4 rounded-lg shadow flex flex-col items-center justify-center"
                    >
                        <div className="pb-2">Sliding Window (Monotonic queue strategy)</div>
                        <div>
                          A monotonic Queue is a data structure the elements from the front to the end is strictly either increasing or decreasing....
                        </div>
                        <div>
                            {<img src={"https://res.cloudinary.com/dinouvzsz/image/upload/v1737735836/monotonic_queue-removebg-preview_xbsiyz.png"} className='size-40 opacity-70 rounded-md'/>}
                        </div>
                        <div className="text-blue-400 hover:text-blue-600 duration-200 underline cursor-pointer">
                        <a href={`/blogs/sliding-window-monotonic-queue`} target="_blank">
                            Click Here...
                        </a>
                        </div>
                    </div>
                </Carousel>
            </div>
        </Modal>
    </>
  )
}

export default Read