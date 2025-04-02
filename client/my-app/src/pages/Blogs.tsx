import axios from 'axios';
import {useEffect, useState} from 'react'
import { useParams } from 'react-router-dom'
import Hole from '../components/hole';
import MiniHole from '../components/MiniHole';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { Bot, WandSparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Watermark } from 'antd';
import '../index.css'
interface BlogContent {
    title?: string;
    content: string;
    imageUrl?: string;
}

interface Problem {
  problemName: string;
  problemLink: string;
  hints: string[];
}

interface Blog {
  topic: string;
  title: string;
  code?: string;
  content: BlogContent[];
  problems?: Problem[];
}
  
const Blogs = () => {
    const {slug} = useParams();
    const nodeBase = `https://codeassist-q2nt.onrender.com/blogs/fetch`
    const [blog, setBlog] = useState<Blog | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [doubt, setDoubt] = useState('');
    const [output, setOutput] = useState('');
    useEffect(()=>{
        (async()=>{
            try{
                let response = await axios.get(`${nodeBase}/${slug}`);
                setBlog(response.data.data);
            } catch(err){
                console.log(err);
            }
        })()
    }, []);
    const askDoubt = async()=>{
        try{
            let blogContent = '';
            setLoading(true);
            blog?.content.forEach((bb)=>{
                if(bb?.content === null) return;
                blogContent += bb?.content
            })
            let response = await axios.post(`https://codeassist-q2nt.onrender.com/blogs/askEcho`, {blogContent, doubt});
            setOutput(response.data.data);
            setLoading(false);
        } catch(err){

        }
    }
    if(blog === null){
        return <Hole/>
    }
    return (
        <Watermark content={"CodeAssist"}>
            <div className='relative card-sharp min-h-[100vh] overflow-x-hidden w-full min-w-[320px] p-8'>
                {/* <div className='bg-[#1e8296] absolute top-[4rem] -z-5 left-[-35rem] h-[15.25rem] w-[15.25rem] rounded-full blur-[10rem] sm:w-[68.75rem]'></div> */}
                <div className='relative z-10'>
                    <div className='bg-gradient-to-b from-[#8d8d8e] to-[#e9e6e6] inline-block text-transparent bg-clip-text text-6xl font-bold'>{blog.title}</div>
                    <div className='my-8 w-[85%] min-w-[320px] mx-auto'>{
                        blog.content.map((para, ind)=>{
                            return <div key = {ind}>
                                {
                                    para.title &&
                                    <div className='text-2xl py-2 text-slate-200 font-semibold'>{para.title}</div>
                                }
                                {
                                    para.imageUrl && <div className='rounded-md'><img src={para.imageUrl} className='rounded-md w-[250px] md:w-[500px]'/></div>
                                }
                                {
                                    para.content && 
                                    <div className='text-slate-300 py-2 md:translate-x-10'>✅ {para?.content}</div>
                                }
                            </div>
                        })    
                    }</div>
                    <div className='py-2 px-4 rounded-lg my-8 w-[85%] min-w-[320px] mx-auto p-4 flex flex-col items-start justify-between gap-4'>
                        <div className='text-2xl py-2 text-gray-100 font-semibold flex flex-row items-center gap-2'>Having Doubts? Ask <div className="bg-[#319dce]/30 px-4 py-1 rounded-full text-white font-semibold cursor-pointer gap-2 flex flex-row items-center"> <Bot/> Echo</div></div>
                        <div className='w-full items-start'>
                            {
                                loading && 
                                <div>
                                    <MiniHole/>
                                </div>
                            }
                            {
                                !loading && output !== '' && <ReactMarkdown>{output}</ReactMarkdown>
                            }
                        </div>
                        <div className='flex flex-row items-center gap-2 w-full'>
                            <input
                                className='p-2 w-full text-white bg-transparent backdrop-blur-md rounded-md border focus:outline-none'
                                type='text'
                                placeholder='Type your doubt here✨✨'
                                value={doubt}
                                onChange={(e) => setDoubt(e.target.value)}
                            ></input>
                            <button
                                className='bg-white py-[10px] px-[25px] rounded-md cursor-pointer text-black w-[120px]'
                                onClick={async()=>{
                                    await askDoubt()
                                }}
                            >
                                <span className='flex flex-row items-center justify-center gap-4 text-md'>Try Out <WandSparkles/></span>
                            </button>
                        </div>
                    </div>
                    {
                        blog.code &&
                        <div className='my-8 w-[85%] min-w-[320px] mx-auto'>
                            <div className='text-2xl py-2 text-slate-200 font-semibold'>Sample Template</div>
                            <div className="mt-2 text-sm">
                                <SyntaxHighlighter 
                                    language="cpp" 
                                    style={vscDarkPlus}
                                    customStyle={{
                                        background: 'transparent',
                                        margin: 0,
                                        border: 'none',
                                        overflowX: 'auto',
                                        fontSize: '0.875rem',
                                        whiteSpace: 'pre-wrap',
                                        wordWrap: 'break-word',
                                        minHeight: '10rem',
                                    }}
                                    codeTagProps={{ style: { fontFamily: 'Fira Code, monospace' } }}
                                    PreTag="div"
                                >
                                    {blog.code}
                                </SyntaxHighlighter>
                            </div>
                        </div>
                    }
                    <div className='my-8 w-[85%] min-w-[320px] mx-auto'>{
                        blog.problems && 
                        <div>
                            {
                                blog.problems.map((para, ind)=>{
                                    return <div key = {ind} className=''>
                                        {
                                            para.problemName &&
                                            <div className='py-2 text-sky-500 underline font-semibold'>
                                            <a href={para.problemLink} target='_blank'>✅ {para.problemName}</a></div>
                                        }
                                        <div className='text-slate-300 py-2 md:translate-x-10'>{para.hints.map((hint, ind)=>{
                                            return <div key={ind} className='py-2'>
                                                📌  {hint}
                                            </div>
                                        })}</div>
                                    </div>
                                })    
                            }
                        </div>
                    }</div>
                </div>
            </div>
        </Watermark>
    )
}

export default Blogs