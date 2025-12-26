import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LayoutStore {
  order: string[];

  // called when a new widget is added
  appendWidget: (id: string) => void;

  // called during drag & drop
  moveWidget: (draggedId: string, targetId: string) => void;

  //to remove widget layout
  removeFromLayout: (id: string)=> void;

}

export const useLayoutStore = create<LayoutStore>()(
  persist(
    (set, get) => ({
      order: [],

      appendWidget: (id) => {
        const order = get().order;
        if (!order.includes(id)) {
          set({ order: [...order, id] });
        }
      },

      moveWidget: (draggedId, targetId) => {
        const order = [...get().order];

        if (draggedId === targetId) return;

        const fromIndex = order.indexOf(draggedId);
        const toIndex = order.indexOf(targetId);

        if (fromIndex === -1 || toIndex === -1) return;

        order.splice(fromIndex, 1);
        order.splice(toIndex, 0, draggedId);

        set({ order });
      },

      removeFromLayout: (id: string) =>
        set((state) => ({
          order: state.order.filter((x) => x !== id),
        }))      
    }),
    
    {
      name: "finboard-layout",
    }
  )
);
