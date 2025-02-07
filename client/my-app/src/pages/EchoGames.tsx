import React from 'react'
import { Avatar } from 'antd';
import { Bot as Target, SendHorizontal } from 'lucide-react';
import {UserOutlined} from '@ant-design/icons'
import { useState, useEffect, useRef } from 'react';
import {toast} from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
type Question = {
    question: string;
    options: string[];
    answer: string;
};
const EchoGames = () => {
    const base = `https://codeassist-q2nt.onrender.com`
    const navigate = useNavigate();
    const [chat, setChat] = useState<{text: string, sender: string}[]>([]);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [grid, setGrid] = useState<string[]>([]);
    const [isLoading, setIsloading] = useState<Boolean>(false);
    const [loading, setLoading] = useState(0);
    const [dbg, setDbg] = useState<{question: string, options: string[], answer: string, code: string[]}[]>([])
    const [session, setSession] = useState<Boolean>(false);
    const [options, setOptions] = useState<String[]>([]);
    const [selectedOption, setSelectedOption] = useState<number>(-1);
    const [language, setLanguage] = useState<String>("");
    const [answered, setAnswered] = useState<number>(1);
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const [_mem, set_Mem] = useState<number>(0);
    const [_dbg, set_Dbg] = useState<number>(0);
    const [_rsn, set_Rsn] = useState<number>(0);
    useEffect(()=>{
        if(scrollRef.current){
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [chat]);
    useEffect(()=>{
        setChat((prev)=>{
            return  [ 
                        {
                            "sender": "echo",
                            "text": "Hello there, superstar! 🌟 I’m Echo, your learning companion on this exciting journey! You’ve been doing an amazing job so far, and I’m super proud of you!🎉"
                        },
                        {
                            "sender": "echo",
                            "text": " Today, I’ve got something special lined up for you—mini-games! 🎮✨."
                        },
                        {
                            "sender": "echo",
                            "text": "These games are designed to test and strengthen three super important skills:  Your reasoning 🧠,  Your focus 🎯 and  Your retention 🔑"
                        },
                        {
                            "sender": "echo",
                            "text": "question||Shall we start the session?"
                        },
                    ]
        })
        setOptions(["Hell yeah", "Fall Back"]);
        setSession(false);
        setSelectedOption(-1);
    }, [])
    function generateRandomQuestions(grid: string[]): Question[] {
        const questions: Question[] = [];
    
        for (let i = 0; i < 4; i++) {
            const randomCell = Math.floor(Math.random() * 16); 
            const row = Math.floor(randomCell / 4) + 1; 
            const col = (randomCell % 4) + 1; 
    
            const correctAnswer = grid[randomCell];
            const randomOptions = Array(3)
                .fill(null)
                .map(() => grid[Math.floor(Math.random() * 16)]);
            
            const options = [...new Set([...randomOptions, correctAnswer])].slice(0, 4); 
            options.sort(() => Math.random() - 0.5); 
            questions.push({
                question: `What was in cell ${row}x${col}?`,
                options: options,
                answer: correctAnswer
            });
        }
    
        return questions;
    }
    console.log(_mem, _dbg, _rsn);
    const sendMessage = async()=>{
        if(selectedOption === -1){
            toast.info('Select an option', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            return;
        }
        setChat((prev)=>{
            return [...prev, {
                "sender": "user",
                "text": `${options[selectedOption]}`
            }]
        })
        if(session === false){
            if(selectedOption === 0){
                setOptions([]);
                setSession(true);
                setIsloading(true);
                setLoading(0);
                const response = await axios.get(`${base}/games/gridGame`,  {
                    onDownloadProgress: (progressEvent) => {
                      if(progressEvent.progress == undefined) return;
                      const percentCompleted = (progressEvent.progress * 100);
                      setLoading(percentCompleted);
                    },
                });
                setChat((prev)=>{
                    return [...prev,
                        {
                            "sender": "echo",
                            "text": "question||You will be shown a grid for 30 seconds. Try to commit it in your memory."
                        },
                        {
                            "sender": "echo",
                            "text": "gridgame"
                        },
                    ]
                })
                setGrid(response.data.grid);
                
                
                const questions =  generateRandomQuestions([...response.data.grid]);
                
                questions.push({
                    question: `Was this present in the grid ${response.data.randomInstance}`,
                    options: ["Yes", "No"],
                    answer: grid.includes(response.data.randomInstance) ? "Yes" : "No",
                });
                setTimeout(() => {
                    setGrid(Array(16).fill("X")); 
                    setChat((prev)=>{
                        return [...prev,
                            {
                                "sender": "echo",
                                "text": `gridquestion-0`
                            }
                        ]
                    });
                    setOptions(questions[0].options);
                }, 30000);

                setQuestions(questions);
                setIsloading(false);
                setLoading(100);
                setSelectedOption(-1);
            }
            else{
                navigate('/echo')
            }
        }
        else if(answered <= 5){
            let qid = answered-1;
            if(questions[qid].answer === options[selectedOption]){
                setChat((prev)=>{
                    return [...prev,
                        {
                            "sender": "echo",
                            "text": "Wohoo, That was correct! ✅✅✅✅"
                        },
                    ]
                })
                set_Mem(prev => prev + 1);
            }
            else{
                setChat((prev)=>{
                    return [...prev,
                        {
                            "sender": "echo",
                            "text": "That was close! ❌❌❌❌"
                        },
                    ]
                })
            }
            if(answered < 5){
                setChat((prev)=>{
                    return [...prev,
                        {
                            "sender": "echo",
                            "text": `gridquestion-${answered}`
                        }
                    ]
                })
                setOptions(questions[answered].options);
            }
            setAnswered(prev => prev+1);
            setSelectedOption(-1);
            if(answered === 5){
                setOptions([]);
                setIsloading(true);
                setLoading(0);
    
                const response = await axios.get(`${base}/games/riddles`,  {
                    onDownloadProgress: (progressEvent) => {
                      if(progressEvent.progress == undefined) return;
                      const percentCompleted = (progressEvent.progress * 100);
                      setLoading(percentCompleted);
                    },
                });
    
    
                setChat((prev)=>{
                    return [...prev,
                        {
                            "sender": "echo",
                            "text": "question||Time for a little fun! I've got a few tricky riddles up my sleeve. Dare to solve them? 😏."
                        }
                    ]
                })
                
                const riddles = response.data.questions;
                const newgridquestions = [...questions, ...riddles.map((riddle : Question)=>{
                    return {
                        question: riddle.question,
                        answer: riddle.answer,
                        options: riddle.options
                    }
                })];
                setQuestions(newgridquestions);

                
                
                setChat((prev)=>{
                    return [...prev,
                        {
                            "sender": "echo",
                            "text": "gridquestion-5"
                        }
                    ]
                })
                setOptions(newgridquestions[answered].options)
                setIsloading(false);
                setLoading(100);
                setSelectedOption(-1);
            }
        }
        else if(answered <= 10){
            let qid = answered-1;
            if(questions[qid].answer === options[selectedOption]){
                setChat((prev)=>{
                    return [...prev,
                        {
                            "sender": "echo",
                            "text": "Wohoo, That was correct! ✅✅✅✅"
                        },
                    ]
                })
                set_Rsn(prev => prev + 1);
            }
            else{
                setChat((prev)=>{
                    return [...prev,
                        {
                            "sender": "echo",
                            "text": "That was close! ❌❌❌❌"
                        },
                    ]
                })
            }
            if(answered < 10){
                setChat((prev)=>{
                    return [...prev,
                        {
                            "sender": "echo",
                            "text": `gridquestion-${answered}`
                        }
                    ]
                })
                setOptions(questions[answered].options);
            }
            else{
                setChat((prev) => {
                    return [...prev, {
                        "sender": "echo",
                        "text": "Language You Are Most Familiar With?"
                    }]
                })
                setOptions(["cpp", "java", "py"]);
            }
            setAnswered(prev => prev+1);
            setSelectedOption(-1);
        }
        else if(answered <= 15){
            if(language === ""){
                setLanguage(options[selectedOption]);
                const response = await axios.get(`${base}/games/debuggingQuestions/${options[selectedOption]}`,  {
                    onDownloadProgress: (progressEvent) => {
                      if(progressEvent.progress == undefined) return;
                      const percentCompleted = (progressEvent.progress * 100);
                      setLoading(percentCompleted);
                    },
                });
                setDbg(response.data.data);
                setChat((prev)=>{
                    return [...prev,
                        {
                            "sender": "echo",
                            "text": "question||Time to solve some debugging questions! Dare to solve them? 😏."
                        }
                    ]
                })
                setChat((prev)=>{
                    return [...prev,
                        {
                            "sender": "echo",
                            "text": "dbg-0"
                        }
                    ]
                })
                setOptions(response.data.data[0].options);
                setSelectedOption(-1);
            }
            else{
                let qid = answered-11;
                if(dbg[qid].answer === options[selectedOption]){
                    setChat((prev)=>{
                        return [...prev,
                            {
                                "sender": "echo",
                                "text": "Wohoo, That was correct! ✅✅✅✅"
                            },
                        ]
                    })
                    set_Dbg(prev => prev + 1);
                }
                else{
                    setChat((prev)=>{
                        return [...prev,
                            {
                                "sender": "echo",
                                "text": "That was close! ❌❌❌❌"
                            },
                        ]
                    })
                }
                if(answered < 15){
                    setChat((prev)=>{
                        return [...prev,
                            {
                                "sender": "echo",
                                "text": `dbg-${answered-10}`
                            }
                        ]
                    })
                    setOptions(dbg[answered-10].options);
                }
                else{
                    const userdata = localStorage.getItem("user");
                    if(!userdata){
                        navigate('/echo');
                        return;
                    }
                    const user = JSON.parse(userdata);
                    await axios.post("https://codeassist-q2nt.onrender.com/games/update", {
                        mem: _mem,
                        rsn: _rsn,
                        dbg: _dbg,
                        email: user.email
                    });
                    user.memory = _mem
                    user.debugging = _dbg
                    user.reasoning = _rsn
                    localStorage.setItem('user', JSON.stringify(user))
                    navigate('/echo');
                }
                setAnswered(prev => prev+1);
                setSelectedOption(-1);
            }
        }
        else{
            navigate('/echo');
        }
    }

    return (
        <div className='relative card-sharp h-[100vh] overflow-x-hidden w-full min-w-[320px]'>
            {/* <div className='bg-[#1e8296] absolute top-[4rem] -z-5 left-[-35rem] h-[15.25rem] w-[15.25rem] rounded-full blur-[10rem] sm:w-[68.75rem]'></div> */}
            <div className='py-4 w-full flex flex-col items-center justify-between h-full'>
                <div className='w-full flex flex-row items-center justify-around pb-2' style={{"boxShadow": "0 5px 10px rgba(0, 0, 0, 0.3)"}}>
                        {/* header */}
                        <div className='flex flex-row items-center gap-6 text-md text-white font-semibold cursor-pointer'>
                            <div>
                                
                            </div>
                        </div>
                        <div className='text-[#67c2ec] bg-[#319dce]/30 px-4 py-1 rounded-full font-semibold cursor-pointer flex flex-row items-center gap-2'>
                            <div className='text-white'><Target/></div>
                            Echo
                        </div>
                        <div className='flex flex-row items-center gap-2 text-lg text-white font-semibold cursor-pointer'>
                        
                        </div>
                </div>
                <div ref={scrollRef} className="w-full p-4 rounded-md overflow-y-auto custom-scrollbar h-full">
                    {/* Chat */}
                    <div className="w-full flex flex-col item-start gap-4 h-full">
                        {chat.map((item, index) => {
                        if (item.sender === "user") {
                            return (
                                <div
                                    key={index}
                                    className="self-end text-[#67c2ec] bg-[#319dce]/30 border-[1px] border-[#67c2ec] py-2 px-4 rounded-lg max-w-xs text-right shadow"
                                >
                                    {item.text}
                                </div>
                            );
                        }
                        else if(item.text.startsWith("question")){
                            return                             <div
                                key={index}
                                className="self-start text-[#fa864c] bg-[#fa864c]/30 border-[1px] border-[#fa864c] py-2 px-4 rounded-lg max-w-xs shadow"
                            >
                                {item.text.split('||')[1]}
                            </div>
                        }
                        else if(item.text.startsWith("gridgame")){
                            return <div className="self-start text-[#d2e3d5] bg-[#d2e3d5]/30 border-[1px] border-[#d2e3d5] py-2 px-4 rounded-lg max-w-xs shadow">
                                <div className="grid grid-cols-4 gap-4 p-4 bg-transparent rounded-lg shadow-lg">
                                    {
                                        grid.map((item, ind)=>{
                                            return <div key={ind} className="flex items-center justify-center p-4 text-white rounded">
                                                {item}
                                            </div>
                                        })
                                    }
                                </div>
                            </div>
                        }
                        else if(item.text.startsWith("gridquestion")){
                            const qid = parseInt(item.text.split('-')[1]);
                            return <div className="self-start text-[#fa864c] bg-[#fa864c]/30 border-[1px] border-[#fa864c] py-2 px-4 rounded-lg max-w-xs shadow">
                                {questions[qid].question}
                            </div>
                        }
                        else if(item.text.startsWith("dbg")){
                            const qid = parseInt(item.text.split('-')[1]);
                            return <div className="self-start text-[#fa864c] bg-[#fa864c]/30 border-[1px] border-[#fa864c] py-2 px-4 rounded-lg max-w-xs shadow">
                                <div>{dbg[qid].question}</div>
                                <div className="mt-2 text-sm">
                                    <SyntaxHighlighter 
                                        language="javascript" 
                                        style={vscDarkPlus}
                                        customStyle={{ 
                                            background: 'transparent',
                                            padding: 0,
                                            margin: 0,
                                            border: 'none',
                                            overflowX: 'hidden',
                                            fontSize: '0.875rem',
                                        }}
                                        codeTagProps={{ style: { fontFamily: 'Fira Code, monospace' } }}
                                        PreTag="div"
                                    >
                                        {dbg[qid].code.join('\n')}
                                    </SyntaxHighlighter>
                                </div>
                            </div>
                        }
                        return (
                            <div
                                key={index}
                                className="self-start text-[#67ec79] bg-[#67ec79]/30 border-[1px] border-[#67ec79] py-2 px-4 rounded-lg max-w-xs shadow"
                            >
                                {item.text}
                            </div>
                        );
                        })}
                        {
                            isLoading &&
                            <div className="self-start text-[#c8eacc] bg-[#c8eacc]/30 border-[1px] border-[#c8eacc] py-2 px-4 rounded-lg max-w-xs shadow">
                                Loading... ({loading}%)
                            </div>
                        }
                    </div>
                </div>
                <div className='px-8 flex flex-row items-center justify-between gap-2 mt-4 w-full'>
                    {/* footer */}
                    <div className='w-full flex flex-row items-center gap-4'>
                        <div className='w-full flex flex-row items-center justify-center gap-8'>
                            {
                                options.map((opt, ind)=>{
                                    if(selectedOption === ind){
                                        return <span key={ind} className="self-start cursor-pointer text-[#114d45] bg-[#67ecda]/80 border-[1px] border-[#67ecda] py-2 px-4 rounded-full max-w-xs shadow"
                                            onClick={()=>{
                                                setSelectedOption(ind)
                                            }}
                                        >{opt}</span>                                        
                                    }
                                    return <span key={ind} className="self-start cursor-pointer text-[#67ecda] bg-[#67ecda]/30 border-[1px] border-[#67ecda] py-2 px-4 rounded-full max-w-xs shadow"
                                        onClick={()=>{
                                            setSelectedOption(ind)
                                        }}
                                    >{opt}</span>
                                })
                            }
                        </div>
                        <div className='text-[#67c2ec] bg-[#319dce]/30 p-1 rounded-md cursor-pointer duration-200 hover:scale-95' onClick={sendMessage}>
                            <SendHorizontal/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EchoGames