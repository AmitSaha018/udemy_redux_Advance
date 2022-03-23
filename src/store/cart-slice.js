import { createSlice } from "@reduxjs/toolkit";
import { uiActions } from './ui-slice'

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    totalQuantity: 0,
  },
  reducers: {
    addItemToCart(state, action) {
      const newItem = action.payload;
      const existingItem = state.items.find((item) => item.id === newItem.id);
      if (!existingItem) {
        state.items.push({
          id: newItem.id,
          price: newItem.price,
          quantity: 1,
          totalPrice: newItem.price,
          name: newItem.title,
        });
      } else {
          existingItem.quantity++;
          existingItem.totalPrice = existingItem.totalPrice + newItem.price;
          }
          state.totalQuantity++;
    },
      removeItemFromCart(state, action) {
          const id = action.payload;

          const existingItem = state.items.find(item => item.id === id);

          if (existingItem.quantity === 1) {
              state.items = state.items.filter((item) => item.id !== id);
          } else {
              existingItem.quantity--;
              existingItem.totalPrice = existingItem.totalPrice - existingItem.price;
          }
          state.totalQuantity--;
    },
  },
});

export const sendCartData = (cart) => {
  return async(dispatch) => {
    dispatch(
      uiActions.showNotification({
        status: "pending",
        title: "Sending...",
        message: "Sending cart data!",
      })
    );
    const sendRequest = async() => {
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
    }

    sendRequest().catch(error => {
      dispatch(
        uiActions.showNotification({
          status: 'error',
          title: 'Error!',
          message: 'Sending cart data failed!',
        })
      );
    })
    
  };
}

export const cartActions = cartSlice.actions;


export default cartSlice;