import Cart from "./components/Cart/Cart";
import Layout from "./components/Layout/Layout";
import Products from "./components/Shop/Products";
import { useDispatch, useSelector } from "react-redux";
import { Fragment, useEffect } from "react";
import { uiActions } from "./store/ui-slice";
import Notification from "./components/UI/Notification";

let isInitial = true;

function App() {
  const dispatch = useDispatch();

  const showCart = useSelector((state) => state.ui.cartIsVisible);
  const cart = useSelector((state) => state.cart.items);
  const notification = useSelector(state => state.ui.notification)

  useEffect(() => {
    const sendCartData = async () => {
      dispatch(
        uiActions.showNotification({
          status: "pending",
          title: "Sending...",
          message: "Sending cart data!",
        })
      );
      const response = await fetch(
        "https://react-http-custome-hooks-expl-default-rtdb.firebaseio.com/cart.json",
        {
          method: "PUT",
          body: JSON.stringify(cart),
        }
      );

      if (!response.ok) {
        console.log(response);
        throw new Error("Sending cart data failed.");
      }
      dispatch(
        uiActions.showNotification({
          status: 'success',
            title: 'Success!',
            message: 'Sent cart data successfully!',
        })
  
      );
    };

    // Stop the initial rendering of sendCartData()
    // because on the first rendering it sends a empty cart.
    if (isInitial) {
      isInitial = false;
      return;
    }

    sendCartData().catch((error) => {
      dispatch(
        uiActions.showNotification({
          status: 'error',
          title: 'Error!',
          message: 'Sending cart data failed!',
        })
      );
    });
  }, [cart, dispatch]);
  return (
    <Fragment>
      {notification && <Notification status={ notification.status} title={notification.title} message={notification.message} />}
      <Layout>
      {showCart && <Cart />}
      <Products />
    </Layout>
    </Fragment>
    
  );
}

export default App;
