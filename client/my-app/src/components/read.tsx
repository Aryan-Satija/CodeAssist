import {useState} from 'react';
import * as Tooltip from "@radix-ui/react-tooltip";
import { BookOpenText } from 'lucide-react';
import { Timeline, Carousel, Modal } from 'antd';
import axios from 'axios';
interface timelineObj{
  children: String
}
const Read = ({rating, step} : {rating: Number | null, step: number}) => {
      const [open, setOpen] = useState(false);
      const [confirmLoading, setConfirmLoading] = useState(false);
      const [timeline, setTimeline] = useState<timelineObj[]>([]);
      const [active, setActive] = useState<number>(0);
      const [videos, setVideos] = useState<{
        title: string,
        thumbnail: string,
        url: string,
        channelTitle: string
      }[]>([]);
      const nodeBase = 'https://codeassist-q2nt.onrender.com';
      const showModal = () => {
        setOpen(true);
      };
      const handleOk = () => {
        setOpen(false);
        setConfirmLoading(false);
      };
    
      const handleCancel = () => {
        
        setOpen(false);
      };
      const roadMap = async()=>{
        try{
            const response = await axios.post(`${nodeBase}/roadmap/roadmap`, {
                lc_rating: rating
            });
            setTimeline(response.data.data.map((top : String) => {
                return {
                    children: top
                }
            }));
            const videosResponse = await axios.post(`${nodeBase}/blogs/visual`, {
              tags: [response.data.data[step], 'dsa']
            });
            console.log(videosResponse);
            setVideos(videosResponse.data.videos);
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
            title="Study"
            open={open}
            onOk={handleOk}
            confirmLoading={confirmLoading}
            onCancel={handleCancel} 
        >
            <div>
            <div className='flex flex-row items-center gap-2 border-[1px] border-sky-600 bg-sky-400/40 py-2 px-4 w-[8.2rem] rounded-full relative'>
              <div
                className={`absolute top-1 left-1 w-1/2 h-[80%] bg-sky-600/80 rounded-full transition-all duration-300 ${active === 1 ? "translate-x-[3.5rem]" : ""}`}
              ></div>
              <span
                className={`z-10 flex-1 text-center cursor-pointer ${active === 0 ? "text-white font-bold" : "text-sky-800"}`}
                onClick={() => setActive(0)}
              >
                Read
              </span>
              <span
                className={`z-10 flex-1 text-center cursor-pointer ${active === 1 ? "text-white font-bold" : "text-sky-800"}`}
                onClick={() => setActive(1)}
              >
                Watch
              </span>
            </div>
              {
                active === 0 && 
                <>
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
                </>
              }
              {
                active === 1 &&
                <>
                  <Carousel arrows infinite={false} className='bg-[#2c3849] opacity-95 text-slate-950 h-full flex flex-col items-center justify-center px-6 mt-4'>
                        {
                          videos.map((video, id)=>{
                            return <div key={id} className="text-[#ffffff] bg-[#ffffff]/30 border-[1px] border-[#ffffff] py-2 my-2 px-4 rounded-lg shadow flex flex-col items-center justify-center">
                                <div className="pb-2">{video.title}</div>
                                <div>By {video.channelTitle}</div>
                                <div>
                                  {<img src={video.thumbnail} className='size-40 opacity-70 rounded-md w-full'/>}
                                </div>
                                <div className="text-blue-400 hover:text-blue-600 duration-200 underline cursor-pointer">
                                  <a href={video.url} target="_blank">
                                      Click Here...
                                  </a>
                                </div>
                            </div>
                          })
                        }
                  </Carousel>
                </>
              }
              </div>
        </Modal>
    </>
  )
}

export default Read