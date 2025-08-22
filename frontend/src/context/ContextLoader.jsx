import { createContext,useState,useContext } from "react";

const Loader=createContext();

export const LoaderProvider=({children})=>{
    const [loadCount,setLoadCount]=useState(0)

    const startloading=()=>setLoadCount(prev=>prev+1)
    const stoploading=()=>setLoadCount(prev=>Math.max(prev-1,0))


return (
    <Loader.Provider value={{startloading,stoploading,isLoading:loadCount>0}}>
        {children}
    </Loader.Provider>
)
}

export const useloader=()=>useContext(Loader)