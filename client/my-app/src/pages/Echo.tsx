import { useState } from 'react'
import { useLocation } from 'react-router-dom';
import Header from '../components/header';
import Chat from '../components/chat';
import Query from '../components/query';
import EchoGames from './EchoGames';
import { Modal } from "antd";
import { MonitorPlay } from 'lucide-react';
import "../index.css";
const Echo = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const play = queryParams.get('games');
    
    const [mode, setMode] = useState<number>(0);
    const [platform, setPlatform] = useState<number>(0);
    const [chat, setChat] = useState<{text: string, sender: string}[]>([]);
    const [session, setSession] = useState<Boolean>(false);
    const [text, setText] = useState<string>("");
    const [placeholder, setPlaceholder] = useState<string>("");
    const [isLoading, setIsloading] = useState<Boolean>(false);
    const [loading, setLoading] = useState<number>(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    if(play === 'true'){
        return <EchoGames/>
    }

    const showModal = () => {
      setIsModalOpen(true);
    };
  
    const handleOk = () => {
      setIsModalOpen(false);
    };
  
    const handleCancel = () => {
      setIsModalOpen(false);
    };
    return (
    <div className='relative card-sharp h-[100vh] overflow-x-hidden w-full min-w-[320px]'>
        {/* <div className='bg-[#1e8296] absolute top-[4rem] -z-5 left-[-35rem] h-[15.25rem] w-[15.25rem] rounded-full blur-[10rem] sm:w-[68.75rem]'></div> */}
        <div className='py-4 w-full flex flex-col items-center justify-between h-[100vh]'>
            <Header setChat={setChat} setMode={setMode} setSession={setSession} setPlaceholder={setPlaceholder} setText={setText}/>
            <Chat isLoading={isLoading} loading={loading} chat={chat}/>
            <div className={chat.length === 0  ? 'w-full lg:w-[1240px] -translate-y-80' : 'w-full' }>
                {
                    chat.length === 0 &&
                    <div className='flex flex-col items-center justify-center gap-4 my-8'>
                        <div className='text-xl font-bold'>Hello there, superstar! 🌟</div>
                        <div className='text-xl font-bold text-center'>
                            I’m Echo, your learning companion on this exciting journey! You’ve been doing an amazing job so far, and I’m super proud of you!
                        </div>
                        <div className='text-md text-center flex flex-row items-center justify-center gap-4'>
                            <div>New here?</div>
                            <div>
                                <button className="cursor-pointer bg-blue-100 flex flex-row items-center justify-center gap-2 px-4 py-2 rounded-md text-[#0e444e]" onClick={showModal}>Watch <MonitorPlay/></button>
                            </div>
                        </div>
                        <Modal title="Watch Video" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} centered>
                            <iframe 
                                width="100%" 
                                height="315" 
                                src="https://www.youtube.com/embed/g8lHmDbcde8" 
                                title="YouTube video player" 
                                frameBorder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen
                            ></iframe>
                        </Modal>
                    </div>
                }
                <Query setSession={setSession} setChat={setChat} setMode={setMode} setText={setText} setPlaceholder={setPlaceholder} setPlatform={setPlatform} mode={mode} platform={platform} session={session} text={text} placeholder={placeholder} setIsloading={setIsloading} setLoading={setLoading}/>
            </div>
        </div>
    </div>
  )
}

export default Echo