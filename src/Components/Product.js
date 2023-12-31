import { Link } from 'react-router-dom';
import { Button, Card } from 'react-bootstrap';
import { useContext } from 'react';
// import axios from 'axios';
import Rating from './Rating';
import { Store } from '../Store';
import supabase from '../supaBaseClient';


export default function Product(props) {
    const { product } = props;
    const { state, dispatch: ctxDispatch } = useContext(Store)
    const {
        cart: { cartItems },
    } = state

    const addToCartHandler = async (item) => {
        const existItem = cartItems.find((x) => x._id === product._id);
        const quantity = existItem ? existItem.quantity + 1 : 1;
        // const { data } = await axios.get(`/api/products/${item._id}`)
        const { data } = await supabase
            .from('products')
            .select()
            .eq('_id', item._id)
        if (data.countInStock < quantity) {
            window.alert('Sorry. Product is out of stock');
            return;
        }
        ctxDispatch({
            type: 'ADD_CART_ITEM',
            payload: {
                ...item,
                quantity: quantity,
            }
        })
    }

    return (
        <Card>
            <Link to={`/product/${product.slug}`}>
                <img src={product.image} className='card-img-top' alt={product.name} />
            </Link>
            <Card.Body>
                <Link to={`/product/${product.slug}`}>
                    <Card.Title>{product.name}</Card.Title>
                </Link>
                <Rating
                    rating={product.rating}
                    numReviews={product.numReviews}
                />
                <Card.Text>${product.price}</Card.Text>
                {product.countInStock === 0 ?
                    <Button
                        variant="danger"
                        disabled>
                        Out of Stock
                    </Button>
                    : (
                        <Button
                            variant="primary"
                            onClick={() => addToCartHandler(product)}
                        >
                            Add to Cart
                        </Button>
                    )
                }
            </Card.Body>
        </Card>
    )
}