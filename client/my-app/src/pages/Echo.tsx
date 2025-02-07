import { useState } from 'react'
import { useLocation } from 'react-router-dom';
import Header from '../components/header';
import Chat from '../components/chat';
import Query from '../components/query';
import EchoGames from './EchoGames';
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
    if(play === 'true'){
        return <EchoGames/>
    }
    return (
    <div className='relative card-sharp h-[100vh] overflow-x-hidden w-full min-w-[320px]'>
        {/* <div className='bg-[#1e8296] absolute top-[4rem] -z-5 left-[-35rem] h-[15.25rem] w-[15.25rem] rounded-full blur-[10rem] sm:w-[68.75rem]'></div> */}
        <div className='py-4 w-full flex flex-col items-center justify-between h-[100vh]'>
            <Header setChat={setChat} setMode={setMode} setSession={setSession} setPlaceholder={setPlaceholder} setText={setText}/>
            <Chat isLoading={isLoading} loading={loading} chat={chat}/>
            <Query setSession={setSession} setChat={setChat} setMode={setMode} setText={setText} setPlaceholder={setPlaceholder} setPlatform={setPlatform} mode={mode} platform={platform} session={session} text={text} placeholder={placeholder} setIsloading={setIsloading} setLoading={setLoading}/>
        </div>
    </div>
  )
}

export default Echo