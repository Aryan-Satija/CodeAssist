import {useEffect, useState, Dispatch, SetStateAction} from "react";
import * as Tooltip from "@radix-ui/react-tooltip";
import { CopyPlus, Bot, BookOpenText, PencilRuler, LogOut, RefreshCcwDot, Swords  } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import POTD from "./potd";
import Roadmap from "./roadmap";
import Focus from "./focus";
import axios from "axios";
import { toast } from "react-toastify";
import "../index.css";
import Read from "./read";
interface props{
    setChat : Dispatch<SetStateAction<{text: string, sender: string}[]>>,
    setMode: Dispatch<SetStateAction<number>>,
    setText: Dispatch<SetStateAction<string>>,
    setPlaceholder: Dispatch<SetStateAction<string>>,
    setSession: Dispatch<SetStateAction<Boolean>>
};
const Header = ({setChat, setMode, setText, setPlaceholder, setSession}: props) => {
    const base = 'https://codeassist-1-4r2r.onrender.com' 
    const navigate = useNavigate();
    const [notplay, setPlay] = useState(false);
    const [user, setUser] = useState<null | {
        lc_username: string,
        cf_username: string,
        lc_rating: number,
        cf_rating: number,
        problemsSolved: number,
        step: number,
        debugging: number,
        memory: number,
        reasoning: number,
        email: string,
        lastPlayed: string
    }>(null);
    const [rating, setRating] = useState<number | null>(null);
    useEffect(()=>{
        const storedUser = localStorage.getItem('user');
        if(storedUser != null){
            try{
                setUser(JSON.parse(storedUser));
            } catch(err){
                console.log(err);
            }
        }
    }, []);
    useEffect(()=>{
      if(user === null) return;
      (async()=>{
        try{
          const response = await axios.post(`${base}/echo/predict`, {
            "lc": user.lc_rating,
            "cf": user.cf_rating,
            "mem": user.memory,
            "rsn": user.reasoning,
            "dbg": user.debugging,
            "pbm": user.problemsSolved
          })
          setRating(response.data.score);
        } catch(err){

        }
      })();
    }, [user]);
    useEffect(()=>{
        setPlay(isDisabled());
    }, [user]);
    const isDisabled = ()=>{
      if(user === null) return false;
      const lastDate = new Date(user.lastPlayed);
      const currentDate = new Date();
      const oneDayMillis = 24*60*60*1000;
      if(currentDate.getTime() - lastDate.getTime() <= oneDayMillis) return true;
      return false
    }
  return (
    <div
      className="w-full flex flex-row items-center justify-between pb-2 px-2 md:px-16"
      style={{ boxShadow: "0 5px 10px rgba(0, 0, 0, 0.3)" }}
    >
      {/* header */}
      <div className="flex flex-row items-center gap-6 text-md text-white font-semibold cursor-pointer">
        <div className="hover:scale-125 duration-200">
          <Tooltip.Provider>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <button
                  onClick={() => {
                    localStorage.clear();
                    navigate("/login");
                  }}
                >
                  <LogOut />
                </button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content className="TooltipContent" sideOffset={5}>
                  <div className="opacity-100">LogOut</div>
                  <Tooltip.Arrow className="TooltipArrow" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>
        </div>
        <div className="hidden sm:block hover:scale-125 duration-200">
          <Tooltip.Provider>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <button
                  onClick={() => {
                    setChat([]);
                    setMode(0);
                    setText("");
                    setPlaceholder("");
                    setSession(false);
                  }}
                >
                  <CopyPlus />
                </button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content className="TooltipContent" sideOffset={5}>
                  <div className="opacity-100">New Chat</div>
                  <Tooltip.Arrow className="TooltipArrow" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>
        </div>
        <div className="hidden sm:block hover:scale-125 duration-200">
          <Tooltip.Provider>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <button onClick={() => {navigate('?games=true')}} disabled={notplay}>
                  <PencilRuler />
                </button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content className="TooltipContent" sideOffset={5}>
                  <div className="opacity-100 flex flex-col items-center justify-center">
                    <p>Mini Games</p> 
                    {
                      notplay &&
                      <p>Come Back Tomorrow</p>
                    }
                  </div>
                  <Tooltip.Arrow className="TooltipArrow" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>
        </div>
        <div className="hidden md:block hover:scale-125 duration-200">
            <Read rating={rating} step={user ? user.step : 0}/>
        </div>
        <div className="hidden md:block hover:scale-125 duration-200">
          <Tooltip.Provider>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <button onClick={async() => {
                  if(user === null) return;
                  const id = toast.loading("Please Wait");
                  try{
                    const response = await axios.post(`https://codeassist-q2nt.onrender.com/auth/sync`, {
                      lc_username: user.lc_username,
                      cf_username: user.cf_username,
                      email: user.email
                    }) 
                    setUser((prevUser) => {
                      if (!prevUser) return null; 
                    
                      return {
                        ...prevUser,
                        lc_rating: response.data.lc_rating,
                        cf_rating: response.data.cf_rating,
                        problemsSolved: response.data.problems_solved,
                      };
                    });
                    
                    
                    localStorage.setItem("user", JSON.stringify(user));
                    toast.update(id, {render: "Task successful", type: "success", isLoading: false, autoClose: 3000});
                  } catch(err){
                    toast.update(id, {render: "Something went wrong", type: "error", isLoading: false, autoClose: 3000});
                  }
                }} className="hover:animate-spin ">
                  <RefreshCcwDot />
                </button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content className="TooltipContent" sideOffset={5}>
                  <div className="opacity-100">Sync Rating</div>
                  <Tooltip.Arrow className="TooltipArrow" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>
        </div>
        <div className="hidden sm:block hover:scale-125 duration-200">
          <Roadmap rating={rating} />
        </div>
        <div className="hidden sm:block hover:scale-125 duration-200">
          <POTD
            rating={rating}
            step={user ? user.step : 0}
            email={user ? user.email : ""}
          />
        </div>
        <div className="hidden md:block hover:scale-125 duration-200">
          <Tooltip.Provider>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <button onClick={async() => {
                 
                }} className="hover:animate-spin ">
                  <Swords/>
                </button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content className="TooltipContent" sideOffset={5}>
                  <div className="opacity-100">Self Duels</div>
                  <Tooltip.Arrow className="TooltipArrow" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>
        </div>
        <div className="hidden md:block hover:scale-125 duration-200 horizontal-shake">
          <Focus/>
        </div>
        <div className="hidden md:block">
          {
            user &&
            <Tooltip.Provider>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <div className="border-2 px-2 rounded-md cursor-pointer">
                  {rating ? rating.toFixed(0) : "Calculating..."}
                </div>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content className="TooltipContent" sideOffset={5}>
                  <div className="opacity-100">Rating</div>
                  <Tooltip.Arrow className="TooltipArrow" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>
          }
        </div>
        <div className="text-[#67c2ec] hidden bg-[#319dce]/30 px-4 py-2 rounded-full font-semibold cursor-pointer lg:flex flex-row items-center gap-2">
            {
              user ? user.memory : 0
            }
        </div>
        <div className="text-[#67c2ec] hidden bg-[#319dce]/30 px-4 py-2 rounded-full font-semibold cursor-pointer lg:flex flex-row items-center gap-2">
            {
              user ? user.reasoning : 0
            }
        </div>
        <div className="text-[#67c2ec] hidden bg-[#319dce]/30 px-4 py-2 rounded-full font-semibold cursor-pointer lg:flex flex-row items-center gap-2">
            {
              user ? user.debugging : 0
            }
        </div>
      </div>
      <div className="text-[#67c2ec] bg-[#319dce]/30 px-4 py-1 rounded-full font-semibold cursor-pointer flex flex-row items-center gap-2">
        <div className="text-white">
          <Bot />
        </div>
        Echo
      </div>
    </div>
  );
};

export default Header;
