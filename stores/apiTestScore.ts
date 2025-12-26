import { create } from "zustand";

interface ApiTestStore {
    loading: boolean;
    error?:string;
    response?:any;

    testApi: (url: string)=>Promise<void>;
    reset: ()=>void;
}


export const useApiTestStore=create<ApiTestStore>((set)=>({

    loading: false,
    testApi: async(url)=>{
        set({loading:true, error: undefined, response: undefined});

        try{
            const res=await fetch(url);

            if(!res.ok){
                throw new Error(`API failed with status ${res.status}`);
            }

            const json=await res.json();
            set({response: json, loading: false});
        }
        catch(err: any){
            set({error: err.message, loading: false});
        }
    },

    reset: ()=>set({loading: false, error: undefined, response: undefined}),
}))