import { useState } from "react"
import { useShoppingCart } from "../context/ShoppingCartContext"
import { formatCurrency } from "../utilities/formatCurrency"
import { Button, Card } from 'react-bootstrap'

type StoreItemProps = {
    id: number
    name: string
    price: number
    imageUrl: string
}
export function StoreItem({ id, name, price, imageUrl }: StoreItemProps) {
    const {
        getItemQuantity,
        increaseCartQuantity,
        decreaseCartQuantity,
        removeFromCart,
        post
    } = useShoppingCart()

    let limit = 3
    let count = 0

    const [rating, setRating] = useState();
    const quantity = getItemQuantity(id)
    const handleClick = (count) => {
        setRating(count + 1);
       }


    return (
        <>

            <Card className="h-100">
                <Card.Img
                    variant="top"
                    //  src={postitem.urls.small} 
                    src={imageUrl}
                    height="200px"
                    style={{ objectFit: "cover" }}
                />
                <Card.Body className="d-flex flex-column">
                    <Card.Title className="d-flex justify-content-between align-items-baseline mb-4">
                        <span className="fs-2">{name}</span>
                        {[...Array(limit)].map((_, count) => (
                            <span key={count}
                                onClick={() => handleClick(count)}>
                                {count < rating ? "★" : "☆"}
                            </span>
                        ))}

                        <span className="ms-2 text-muted">{formatCurrency(price)}</span>
                    </Card.Title>
                    <div className="mt-auto">
                        {quantity === 0 ? (<Button className="w-100" onClick={() => increaseCartQuantity(id)}>+ Add to Cart</Button>)
                            : <div className="d-flex align-items-center flex-column"
                                style={{ gap: ".5rem" }}>
                                <div className="d-flex align-items-center
                            justify-content-center"
                                    style={{ gap: ".5rem" }}>
                                    <Button onClick={() => decreaseCartQuantity(id)}>-</Button>
                                    <div>
                                        <span className="fs-3">{quantity}</span> in cart
                                    </div>
                                    <Button onClick={() => increaseCartQuantity(id)}>+</Button>
                                </div>
                                <div>
                                    <Button variant="danger" size="sm" onClick={() => decreaseCartQuantity(id)}>Remove</Button>
                                </div>
                            </div>}
                    </div>

                </Card.Body>
            </Card>

        </>
    )


}