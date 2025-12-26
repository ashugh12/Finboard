import {create} from 'zustand';
import { Widget } from '@/types/widget';
import { persist } from "zustand/middleware";

interface WidgetStore{
    widgets: Record<string, Widget>;
    addWidget: (widget: Widget)=>void;
    removeWidget: (id: string)=> void;
    updateWidget: (id: string, patch: Partial<Widget>)=>void;
}


export const useWidgetStore= create<WidgetStore>()(
    persist(
        (set)=>({
            widgets: {},
            addWidget: (widget)=>set((state)=>({
                widgets:{
                    ...state.widgets,
                    [widget.id]: widget,
                }
            })),
            removeWidget: (id)=>(
                set((state)=>{
                    const copy={...state.widgets};
                    delete copy[id];
                    return {widgets:copy};
                })
            ),
            updateWidget:(id, patch)=>
                set((state)=>{
                    const existing=state.widgets[id];
                    if(!existing) return state;


                    return {
                        widgets:{
                            ...state.widgets,
                            [id]:{
                                ...existing,
                                ...patch,
                            }
                        }
                    }
                }
            ),
    }),
    {
        name:"finboard-widgets",
    },
));