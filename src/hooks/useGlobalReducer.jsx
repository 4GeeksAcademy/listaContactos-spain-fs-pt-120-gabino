import { useContext, useReducer, createContext } from "react";
import storeReducer, { initialStore, getActions } from "../store" 
import PropTypes from "prop-types"; 

const StoreContext = createContext()

export function StoreProvider({ children }) {
    const [store, dispatch] = useReducer(storeReducer, initialStore())
    
    
    const actions = getActions(dispatch, store);

    
    return <StoreContext.Provider value={{ store, dispatch, actions }}>
        {children}
    </StoreContext.Provider>
}

StoreProvider.propTypes = {
    children: PropTypes.node.isRequired
};

// Accedo al estado
export default function useGlobalReducer() {
    const { store, dispatch, actions } = useContext(StoreContext)
    return { store, dispatch, actions };
}