/*
 *
 * Cart actions
 *
 */

import { push } from 'connected-react-router';
import { success } from 'react-notification-system-redux';
import axios from 'axios';

import {
  HANDLE_CART,
  ADD_TO_CART,
  USER_CART_SET,
  CART_ITEM_QANTITY_CHANGE,
  REMOVE_FROM_CART,
  HANDLE_CART_TOTAL,
  SET_CART_ID,
  CLEAR_CART
} from './constants';

import {
  SET_PRODUCT_SHOP_FORM_ERRORS,
  RESET_PRODUCT_SHOP
} from '../Product/constants';

import handleError from '../../utils/error';
import { allFieldsValidation } from '../../utils/validation';
import { toggleCart } from '../Navigation/actions';

// Handle Add To Cart
export const handleAddToCart = product => {
  return async (dispatch, getState) => {
    product.quantity = Number(getState().product.productShopData.quantity);
    product.totalPrice = product.quantity * product.price;
    product.totalPrice = parseFloat(product.totalPrice.toFixed(2));
    const inventory = getState().product.storeProduct.inventory;

    const isProductAvailableCart =await getState().cart.cartItems.find(item=>item._id===product._id)
    const result = isProductAvailableCart ? calculatePurchaseQuantity(inventory) - isProductAvailableCart.quantity : calculatePurchaseQuantity(inventory);

    if(result===0){
      return dispatch({ type: SET_PRODUCT_SHOP_FORM_ERRORS, payload: {quantity: ['Max quantity already added on cart.']} });
    }

    const rules = {
      quantity: `min:1|max:${result}`
    };

    const { isValid, errors } = allFieldsValidation(product, rules, {
      'min.quantity': 'Quantity must be at least 1.',
      'max.quantity': `Quantity may not be greater than ${result}.`
    });

    if (!isValid) {
      return dispatch({ type: SET_PRODUCT_SHOP_FORM_ERRORS, payload: errors });
    }else{
      // dispatch({
      //   type: RESET_PRODUCT_SHOP
      // });
      dispatch({
        type: ADD_TO_CART,
        payload: product
      });
      dispatch(calculateCartTotal());
      dispatch(toggleCart());
      dispatch(push('/shop'))
      dispatch(cartStoreInUser());
    }
  };
};

export const handleCartItemCountChange = (product,quantity) => {
  return async (dispatch, getState) => {
    product = {...product,quantity:quantity,totalPrice:product.price*quantity}
    dispatch({
      type: CART_ITEM_QANTITY_CHANGE,
      payload: product
    });
    dispatch(calculateCartTotal());
    // dispatch(cartStoreInUser());
  };
};

// Handle Remove From Cart
export const handleRemoveFromCart = product => {
  return (dispatch, getState) => {
    dispatch({
      type: REMOVE_FROM_CART,
      payload: product
    });
    dispatch(calculateCartTotal());
    dispatch(cartStoreInUser());
    // dispatch(toggleCart());
  };
};

export const calculateCartTotal = () => {
  return (dispatch, getState) => {
    const cartItems = getState().cart.cartItems;

    let total = 0;

    cartItems.map(item => {
      total += item.price * item.quantity;
    });

    total = parseFloat(total.toFixed(2));

    dispatch({
      type: HANDLE_CART_TOTAL,
      payload: total
    });
  };
};

// set cart store from cookie
export const handleCart = () => {
  const cart = {
    cartItems: JSON.parse(localStorage.getItem('cart_items')),
    itemsInCart: JSON.parse(localStorage.getItem('items_in_cart')),
    cartTotal: localStorage.getItem('cart_total'),
    cartId: localStorage.getItem('cart_id')
  };

  return (dispatch, getState) => {
    if (cart.cartItems != undefined || cart.itemsInCart != undefined) {
      dispatch({
        type: HANDLE_CART,
        payload: cart
      });
    }
  };
};

export const handleCheckout = () => {
  return (dispatch, getState) => {
    const successfulOptions = {
      title: `Please Login to proceed to checkout`,
      position: 'tr',
      autoDismiss: 1
    };

    dispatch(toggleCart());
    dispatch(push('/login'));
    dispatch(success(successfulOptions));
  };
};

export const MoveToCheckout = () => {
  return (dispatch, getState) => {
    dispatch(toggleCart());
    dispatch(push('/checkout'));
  };
};

// Continue shopping use case
export const handleShopping = (isCartToggle = true) => {
  return (dispatch, getState) => {
    dispatch(push('/shop'));
    if(isCartToggle){
      dispatch(toggleCart());
    }
  };
};

// create cart id api
export const getCartId = () => {
  return async (dispatch, getState) => {
    try {
      const cartId = localStorage.getItem('cart_id');
      const cartItems = getState().cart.cartItems;
      const products = getCartItems(cartItems);

      // create cart id if there is no one
      if (!cartId) {
        const response = await axios.post(`/api/cart/add`, { products });

        dispatch(setCartId(response.data.cartId));
      }
    } catch (error) {
      handleError(error, dispatch);
    }
  };
};

//store cart in db in user table
export const cartStoreInUser = () => {
  return async (dispatch, getState) => {
    try {
      if(getState().authentication.authenticated){
        const cartItems = getState().cart.cartItems;
        const products = cartItems;
        await axios.post(`/api/cart/userCartAdd`, { products });
      }
    } catch (error) {
      handleError(error, dispatch);
    }
  };
};

//on login cart bind with current cart
export const userCartBind = () => {
  return async (dispatch, getState) => {
    try {
      const response = await axios.get(`/api/user`);
      const cartItems = getState().cart.cartItems;

      const ids = new Set(cartItems.map(d => d._id));
      const newCart = [...cartItems, ...response.data.user.cartItems.filter(d => !ids.has(d._id))];  

      dispatch({
        type: USER_CART_SET,
        payload: newCart 
      });
      dispatch(cartStoreInUser());
    } catch (error) {
      handleError(error, dispatch);
    }
  };
};

export const setCartId = cartId => {
  return (dispatch, getState) => {
    dispatch({
      type: SET_CART_ID,
      payload: cartId
    });
  };
};

export const clearCart = () => {
  return (dispatch, getState) => {
    localStorage.removeItem('cart_items');
    localStorage.removeItem('items_in_cart');
    localStorage.removeItem('cart_total');
    localStorage.removeItem('cart_id');

    dispatch({
      type: CLEAR_CART
    });
    dispatch(cartStoreInUser());
  };
};

const getCartItems = cartItems => {
  const newCartItems = [];
  cartItems.map(item => {
    const newItem = {};
    newItem.quantity = item.quantity;
    newItem.price = item.price;
    newItem.taxable = item.taxable;
    newItem.product = item._id;
    newCartItems.push(newItem);
  });

  return newCartItems;
};

const calculatePurchaseQuantity = inventory => {
  return parseInt(inventory / 2);
  // if (inventory <= 25) {
  //   return 1;
  // } else if (inventory > 25 && inventory <= 100) {
  //   return 5;
  // } else if (inventory > 100 && inventory < 500) {
  //   return 25;
  // } else {
  //   return 50;
  // }
};
