import { useState } from "react";
import { CartContext } from "./context";


export const CartContextProvider = ({ children }) => {
    
    const [isEmpty, setIsEmpty] = useState(true)



    return (
      <CartContext.Provider
        value={{ isEmpty, setIsEmpty }}
      >
        {children}
      </CartContext.Provider>
    );

}
