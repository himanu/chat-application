import { createContext, useState } from "react";
import LoadingSvg from "../Components/Loader/Loading";

export const LoaderContext = createContext();

export const LoaderContextProvider = ({children}) => {
    const [loader, toggleLoader] = useState(true);
    return (
        <LoaderContext.Provider value={{toggleLoader, loader}}>
            {children}
            {loader && (
                    <LoadingSvg />
            )}
        </LoaderContext.Provider>
    )
}