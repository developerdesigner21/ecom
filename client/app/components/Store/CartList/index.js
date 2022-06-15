/**
 *
 * CartList
 *
 */

import React from 'react';

import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'reactstrap';

import Button from '../../Common/Button';
import Input from '../../Common/Input';

const CartList = props => {
  const { cartItems, handleRemoveFromCart, handleCartItemCountChange } = props;

  const handleProductClick = () => {
    props.toggleCart();
  };

  return (
    <div className='cart-list'>
      {cartItems.map((item, index) => (
        <div key={index} className='item-box'>
          <div className='item-details'>
            <Container>
              <Row className='mb-2 align-items-center'>
                <Col xs='10' className='pr-0'>
                  <div className='d-flex align-items-center'>
                    <img
                      className='item-image mr-2'
                      src={`${
                        item.imageUrl
                          ? item.imageUrl
                          : '/images/placeholder-image.png'
                      }`}
                    />

                    <Link
                      to={`/product/${item.slug}`}
                      className='item-link one-line-ellipsis'
                      onClick={handleProductClick}
                    >
                      <h1 className='item-name one-line-ellipsis'>
                        {item.name}
                      </h1>
                    </Link>
                  </div>
                </Col>
                <Col xs='2' className='text-right'>
                  <Button
                    borderless
                    variant='empty'
                    ariaLabel={`remove ${item.name} from cart`}
                    icon={<i className='icon-trash' aria-hidden='true' />}
                    onClick={() => handleRemoveFromCart(item)}
                  />
                </Col>
              </Row>
              <Row className='mb-2 align-items-center'>
                <Col xs='9'>
                  <p className='item-label'>Price per unit</p>
                </Col>
                <Col xs='3' className='text-right'>
                  <p className='value price'>{` $${item?.price}`}</p>
                </Col>
              </Row>
              <Row className='mb-2 align-items-center'>
                <Col xs='6'>
                  <p className='item-label'>quantity</p>
                </Col>
                <Col xs='6' className='text-right d-flex justify-content-end'>
                    <Input
                        type={'qantity'}
                        name={'quantity'}
                        disabled={true}
                        decimals={false}
                        min={1}
                        max={item.inventory/2}
                        placeholder={'Product Quantity'}
                        value={item.quantity}
                        onInputChange={(name, value) => {
                          handleCartItemCountChange(item,value)
                        }}
                      />
                </Col>
              </Row>
            </Container>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CartList;
