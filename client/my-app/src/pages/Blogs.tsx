import axios from 'axios';
import {useEffect, useState} from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify';
import Hole from '../components/hole';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
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
    if(blog === null){
        return <Hole/>
    }
    return (
        <div className='relative bg-[#11192D] min-h-[100vh] overflow-x-hidden w-full min-w-[320px] p-8'>
            <div className='bg-[#1e8296] absolute top-[4rem] -z-5 left-[-35rem] h-[15.25rem] w-[15.25rem] rounded-full blur-[10rem] sm:w-[68.75rem]'></div>
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
    )
}

export default Blogs