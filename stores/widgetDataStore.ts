import {create} from "zustand";

export type DataStatus = "idle" | "loading" | "success" | "error"

interface WidgetDataState{
    status: DataStatus,
    data?: any;
    error?: string;
    lastFetchedAt?: number;
}

interface WidgetDataStore {
    dataMap: Record<string, WidgetDataState>;
    setData: (id: string, data: Partial<WidgetDataState>)=>void;
    clearData: (id: string)=>void;
}


export const useWidgetDataStore = create<WidgetDataStore>((set)=>({
    dataMap:{},

    setData: (id, data)=>(
        set((state)=>({
            dataMap:{
                ...state.dataMap,
                [id]:{
                    ...state.dataMap[id],
                    ...data,
                }
            }
        }))
    ),

    clearData: (id)=>(
        set((state)=>{
            const copy={...state.dataMap};
            delete copy[id];
            return {dataMap: copy};
        })
    )
}));