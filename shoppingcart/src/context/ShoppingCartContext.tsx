import { createContext, ReactNode, useContext, useEffect, useState } from "react"
import { ShoppingCart } from "../components/ShoppingCart"
import { useLocalStorage } from "../hooks/useLocalStorage"

type ShoppingCartProviderProps = {
    children: ReactNode
}
type CartItem = {
    id: number
    quantity: number
}

type post = {
    id: number
    price: number
    name: string
    imgUrl: string


}

type ShoppingCartContext = {
    openCart: () => void
    closeCart: () => void
    getItemQuantity: (id: number) => number
    increaseCartQuantity: (id: number) => void
    decreaseCartQuantity: (id: number) => void
    removeFromCart: (id: number) => void
    cartQuantity: number
    cartItems: CartItem[]
    post: post[]
}

const ShoppingCartContext = createContext({} as ShoppingCartContext)

export function useShoppingCart() {
    return useContext(ShoppingCartContext)
}

export function ShoppingCartProvider({ children }: ShoppingCartProviderProps) {
    const [cartItems, setCartItems] = useLocalStorage<CartItem[]>("shopping-cart", [])
    const [isOpen, setIsOpen] = useState(false)
    const [post, setPost] = useState([])

    const unsplashApiKey = 'I9hJaF3mj3SKwKAp0ed5KV_ZTgc4SC28K6CYxgf-kdQ';


    const cartQuantity = cartItems.reduce(
        (quantity, item) => item.quantity + quantity,
        0
    )

    const openCart = () => setIsOpen(true)
    const closeCart = () => setIsOpen(false)

    useEffect(() => {
        fetchPosts();
    }, [])
    const fetchPosts = async () => {
        //
        // const res = await fetch(`https://jsonplaceholder.typicode.com/posts`);
        /* const res = await fetch(`https://api.unsplash.com/photos/random&count=3&client_id=${unsplashApiKey}`);
        console.log(res)
         const posts = await res.json();
         setPost(posts) 
         console.log(post)*/



        fetch(`https://api.unsplash.com/photos/random?count=10&client_id=I9hJaF3mj3SKwKAp0ed5KV_ZTgc4SC28K6CYxgf-kdQ`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json(); // Parse the response as JSON
            })
            .then(data => {
                //console.log(data); // Log the actual data
                // setPost(data)
                const items = data.map((item, index) => ({
                    id: index + 1,
                    name: `Product ${index + 1}`,
                    price: (Math.random() * 100).toFixed(2), // Random price
                    imageUrl: item.urls.regular, // Unsplash image URL
                }));
                console.log(items)
                setPost(items)

            })
            .catch(error => {
                console.error('Error:', error); // Handle errors
            });


    }



    function getItemQuantity(id: number) {
        return cartItems.find(item => item.id === id)?.quantity || 0
    }

    function increaseCartQuantity(id: number) {
        setCartItems(currItems => {
            if (currItems.find(item => item.id === id) == null) {
                return [...currItems, { id, quantity: 1 }]
            }
            else {
                return currItems.map(item => {
                    if (item.id === id) {
                        return { ...item, quantity: item.quantity + 1 }
                    }
                    else {
                        return item
                    }
                })
            }

        })
    }

    function decreaseCartQuantity(id: number) {
        setCartItems(currItems => {
            if (currItems.find(item => item.id === id)?.quantity === 1) {
                return currItems.filter(item => item.id !== id)
            }
            else {
                return currItems.map(item => {
                    if (item.id === id) {
                        return { ...item, quantity: item.quantity - 1 }
                    }
                    else {
                        return item
                    }
                })
            }

        })
    }

    function removeFromCart(id: number) {
        setCartItems(currItems => {
            return currItems.filter(item => item.id !== id)
        }
        )
    }

    return (

        <>


            <ShoppingCartContext.Provider value={{
                getItemQuantity,
                increaseCartQuantity,
                decreaseCartQuantity,
                removeFromCart,
                openCart,
                closeCart,
                cartQuantity,
                cartItems,
                post
            }}>
                {children}
                <ShoppingCart isOpen={isOpen} />
            </ShoppingCartContext.Provider>

        </>)
}