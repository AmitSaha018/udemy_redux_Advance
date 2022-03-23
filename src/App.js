import Cart from './components/Cart/Cart';
import Layout from './components/Layout/Layout';
import Products from './components/Shop/Products';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

let isInitial = true;

function App() {

  const showCart = useSelector(state => state.ui.cartIsVisible);
  const cart = useSelector(state => state.cart.items);

  useEffect(() => {
    const sendCartData = async () => {
      const response = await fetch('https://react-http-custome-hooks-expl-default-rtdb.firebaseio.com/cart.json', {
        method: 'PUT',
        body: JSON.stringify(cart)
      });

      if (!response.ok) {
        throw new Error('Sending cart data failed.');
      }
    };

    // Stop the initial rendering of sendCartData()
    // because on the first rendering it sends a empty cart.
    if (isInitial) {
      isInitial = false;
      return;
    }

    sendCartData().catch(error => console.log(error));
    
  }, [cart]);
  return (
    <Layout>
      {showCart && <Cart />}
      <Products />
    </Layout>
  );
}

export default App;
