import React, {createContext, useContext, useState, useEffect} from 'react'
import { toast } from 'react-hot-toast'

const Context = createContext();

export const StateContext = ({children}) => {
    const [showCart, setShowCart] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalQuantities, setTotalQuantities] = useState(0);
    const [qty, setQty] = useState(1);

    let foundProduct;
    let index;

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
            setTotalPrice((prevTotalPrice) => prevTotalPrice + product.price * quantity);
            setTotalQuantities(totalQuantities + quantity);
            setCartItems([...cartItems, { ...product}]);
        }
        toast.success(`${qty} ${product.name} added to the cart.`);
    }

    //remove from cart
    const onRemove = (product) => {
        foundProduct = cartItems.find((item) => item._id === product._id);
        const newCartItems = cartItems.filter((item) => item._id !== product._id);
        setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price * foundProduct.quantity);
        setTotalQuantities((prevTotalQuanties) => prevTotalQuanties - foundProduct.quantity);
        setCartItems(newCartItems);
    }

    //edit items in the mini cart
    const toggleCartItemQuantity = (id, value) => {
        //get the product & index that needs update
        foundProduct = cartItems.find((item) => item._id === id)
        index = cartItems.findIndex((product) => product._id === id)

        //remove the foundproduct from cart
        const newCartItems = cartItems.filter((item) => item._id !== id);
        //inc -> increase qty
        if(value === 'inc') {
            setCartItems([...newCartItems, { ...foundProduct, quantity: foundProduct.quantity + 1 }]);
            setTotalPrice((prevTotalPrice) => prevTotalPrice + foundProduct.price);
            setTotalQuantities((prevTotalQuanties) => prevTotalQuanties + 1);
        }
        //dec -> decrease qty
        else if(value === 'dec') {
            if(foundProduct.quantity > 1) {
                setCartItems([...newCartItems, { ...foundProduct, quantity: foundProduct.quantity - 1 }]);
                setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price);
                setTotalQuantities((prevTotalQuanties) => prevTotalQuanties - 1);
            }
        }
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
                onAdd,
                setShowCart,
                toggleCartItemQuantity,
                onRemove
            }}>
            {children}
        </Context.Provider>
    )
}

export const useStateContext = () => {
    return useContext(Context)
}