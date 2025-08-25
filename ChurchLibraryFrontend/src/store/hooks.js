import { useDispatch, useSelector } from "react-redux";
import { store } from "./index";

// Typed versions of useDispatch and useSelector
export const useAppDispatch = useDispatch;
export const useAppSelector = useSelector;

// Custom hook for getting the store state
export const useStore = () => store.getState();

// Custom hook for dispatching actions
export const useAppStore = () => ({
  getState: store.getState,
  dispatch: store.dispatch,
});

// Re-export store and persistor for direct access when needed
export { store, persistor } from "./index";
