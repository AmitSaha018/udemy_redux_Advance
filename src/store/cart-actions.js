import { cartActions } from "./cart-slice";
import { uiActions } from "./ui-slice";

export const fetchCartData = () => {
  return async(dispatch) => {
    const fetchData = async () => {
      const response = await fetch(
        "https://react-http-custome-hooks-expl-default-rtdb.firebaseio.com/cart.json"
      );

      if (!response.ok) {
        throw new Error("Fetching cart failed!");
      }
      const data = await response.json();
      return data;
    };
    const cartData = await fetchData().catch((error) => {
      dispatch(
        uiActions.showNotification({
          status: "error",
          title: "Error!",
          message: "Fetching cart data failed!",
        })
      );
    });
    console.log(cartData);

    dispatch(
      cartActions.replaceCart({
        items: cartData.items || [], // If no cart data is found provide a empty array
        // so that it doesnot become undefined
        totalQuantity: cartData.totalQuantity,
      })
    );
  };
};

export const sendCartData = (cart) => {
  console.log(cart);
  return async (dispatch) => {
    dispatch(
      uiActions.showNotification({
        status: "pending",
        title: "Sending...",
        message: "Sending cart data!",
      })
    );
    const sendRequest = async () => {
      const response = await fetch(
        "https://react-http-custome-hooks-expl-default-rtdb.firebaseio.com/cart.json",
        {
          method: "PUT",
          body: JSON.stringify({
            items: cart.items,
            totalQuantity: cart.totalQuantity,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Sending cart data failed.");
      }
      dispatch(
        uiActions.showNotification({
          status: "success",
          title: "Success!",
          message: "Sent cart data successfully!",
        })
      );
    };

    sendRequest().catch((error) => {
      dispatch(
        uiActions.showNotification({
          status: "error",
          title: "Error!",
          message: "Sending cart data failed!",
        })
      );
    });
  };
};
