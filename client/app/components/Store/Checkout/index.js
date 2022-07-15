/**
 *
 * Checkout
 *
 */

import React from 'react';

import Button from '../../Common/Button';

const Checkout = props => {
  const { authenticated, handleShopping, handleCheckout, placeOrder,isCheckoutPage,MoveToCheckout } = props;

  return (
    <div className='easy-checkout'>
      <div className='checkout-actions'>
        <Button
          variant='primary'
          text='Continue shopping'
          onClick={() => handleShopping()}
        />
        {authenticated ? isCheckoutPage ? (
          <Button
            variant='primary'
            text='Place order'
            onClick={() => placeOrder()}
          />
        ) :
        (
          <Button
            variant='primary'
            text='Proceed To Checkout'
            onClick={() => MoveToCheckout()}
          />
        )
         : (
          <Button
            variant='primary'
            text='Proceed To Checkout'
            onClick={() => handleCheckout()}
          />
        )}
      </div>
    </div>
  );
};

export default Checkout;
