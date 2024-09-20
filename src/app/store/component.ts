import { create } from "zustand";
// import Asset from "../models/Asset";

type ComponentState = {
	component: any | null;
	select: (component: any | null) => void;
};

const useComponent = create<ComponentState>((set) => ({
	component: null,
	select: (component: any | null) => set(() => ({ component })),
}));

export default useComponent;
