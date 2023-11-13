import { useState } from "react";
import { CartContext } from "./context";


export const CartContextProvider = ({ children }) => {
    
  const [isEmpty, setIsEmpty] = useState(true)
  const [role, setRole] =useState(null)



    return (
      <CartContext.Provider
        value={{ isEmpty, setIsEmpty, role, setRole }}
      >
        {children}
      </CartContext.Provider>
    );

}
