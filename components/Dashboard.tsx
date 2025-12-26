'use client';

import { useWidgetStore } from "@/stores/widgetStore";
import { WidgetRenderer } from "./WidgetRenderer";
import { useLayoutStore } from "@/stores/layoutStore";
import { Widget } from "@/types/widget";

export function Dashboard({onEditWidget,}:{
    onEditWidget:(widget:Widget)=>void;
}){
    const widgetMap=useWidgetStore((s)=>s.widgets);
    const widgetIds=Object.keys(widgetMap);
    const {order}=useLayoutStore();
    
    if(widgetIds.length==0) {
      return (
        <div className="text-center py-12 px-4" style={{ color: 'var(--text)' }}>
          <p className="text-base sm:text-lg opacity-60">No widgets added yet</p>
        </div>
      );
    }

    const finalOrder =
    order.length > 0
      ? order.filter((id) => widgetMap[id])
      : widgetIds;
      
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
        > 
        {finalOrder.map((id)=>(
            <WidgetRenderer key={id} id={id} onEdit={onEditWidget} />
        ))}
        </div>
    )
}
