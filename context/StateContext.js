import React, {createContext, useContext, useState, useEffect} from 'react'
import { toast } from 'react-hot-toast'

const Context = createContext();

export const StateContext = ({children}) => {
    const [showCart, setShowCart] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState();
    const [totalQuantities, setTotalQuantities] = useState();
    const [qty, setQty] = useState(1);

    //add to cart
    const onAdd = (product, quantity) => {
        //check if product exists in the cart, then increase the qty
        const checkProductInCart = cartItems.find((item) => item._id === product._id);
        if(checkProductInCart) {
            //set new price
            setTotalPrice((prevTotalPrice) => prevTotalPrice + product.price * quantity);
            
            //set new qty
            setTotalQuantities((prevTotalQuanties) => prevTotalQuanties + quantity);

            const updatedCartItems = cartItems.map((cartProduct) => {
                if(cartProduct._id === product._id) return {
                    ...cartProduct,
                    quantity: cartProduct.quantity + quantity
                }
            })

            setCartItems(updatedCartItems);
        }
        else {
            //else, add the product to cart
            product.quantity = quantity;

            setCartItems([...cartItems, { ...product}]);
        }
        toast.success(`${qty} ${product.name} added to the cart.`);
    }

    //increase qty
    const incQty = () => {
        setQty((prevQty) => prevQty + 1);
    }


    //decrease qty
    const decQty = () => {
        setQty((prevQty) => {
            if(prevQty -1 < 1) return 1;
            return prevQty - 1;
        });
    }

    return (
        <Context.Provider 
            value={{
                showCart, 
                cartItems, 
                totalPrice, 
                totalQuantities,
                qty,
                incQty,
                decQty,
                onAdd
            }}>
            {children}
        </Context.Provider>
    )
}

export const useStateContext = () => {
    return useContext(Context)
}