/*
 *
 * Checkout
 *
 */

import React from "react";

import { connect } from "react-redux";
import { Row, Col } from "reactstrap";

import actions from "../../actions";

import Input from "../../components/Common/Input";
import Button from "../../components/Common/Button";
import LoadingIndicator from "../../components/Common/LoadingIndicator";
import CartList from "../../components/Store/CartList";
import CartSummary from "../../components/Store/CartSummary";
import Checkout from "../../components/Store/Checkout";
import { Collapse } from "reactstrap";

class CheckoutPage extends React.PureComponent {
  render() {
    const {
      cartItems,
      cartTotal,
      authenticated,
      toggleCart,
      handleRemoveFromCart,
      handleCartItemCountChange,
      handleShopping,
      handleCheckout,
      placeOrder,
    } = this.props;

    this.state = {
      isAddressOpen: true,
      isPaymentOpen: false,
    };

    return (
      <div className="sell">
        {/* {isLoading && <LoadingIndicator />} */}
        <h2>checkout</h2>
        <hr />
        {cartItems.length == 0 ? (
          <Col xs="12" className="order-2 order-md-1 text-md-center mb-3">
            <div className="agreement-banner-text">
              {/* <h3>Would you like to sell your products on MERN Store!</h3> */}
              <h4>Your shopping cart is empty</h4>
              <Button
                variant="primary"
                text="Continue shopping"
                onClick={() => handleShopping(false)}
              />
            </div>
          </Col>
        ) : (
          <Row>
            <Col xs="12" md="6" className="order-2 order-md-1">
              <div class="accordion" id="accordionExample">
                <div class="card">
                  <div
                    class="card-header"
                    id="headingOne"
                    onClick={() => {
                      console.log("dsadsda", this.state.isAddressOpen);
                      //   this.state.isAddressOpen=!this.state.isAddressOpen
                      this.setState({ isAddressOpen: false });
                    }}
                  >
                    <h3 class="mb-0">Address </h3>
                  </div>
                  <Collapse isOpen={this.state.isAddressOpen}>
                    <div class="card-body">
                      <div class="form-check">
                        <input
                          class="form-check-input"
                          type="radio"
                          name="flexRadioDefault"
                          id="flexRadioDefault1"
                        />
                        <label class="form-check-label" for="flexRadioDefault1">
                          12,abc apoartment,katatr,sursw-13545,india
                        </label>
                      </div>
                      <div class="form-check">
                        <input
                          class="form-check-input"
                          type="radio"
                          name="flexRadioDefault"
                          id="flexRadioDefault2"
                          checked
                        />
                        <label class="form-check-label" for="flexRadioDefault2">
                          Default checked radio
                        </label>
                      </div>
                    </div>
                  </Collapse>
                </div>
                <div class="card">
                  <div class="card-header" id="headingOne">
                    <h5 class="mb-0">payment</h5>
                  </div>
                  <Collapse isOpen={this.state.isPaymentOpen}>
                    <div class="card-body">
                      fdsfdfdf SET_ORDERS_LOADINGdas dashboardd sad
                    </div>
                  </Collapse>
                </div>
              </div>
              <Checkout
                handleShopping={handleShopping}
                handleCheckout={handleCheckout}
                placeOrder={placeOrder}
                authenticated={authenticated}
                isCheckoutPage={true}
              />
            </Col>
            <Col xs="12" md="6" className="order-1 order-md-2">
              <div className="cart">
                <div className="cart-body">
                  <CartList
                    toggleCart={toggleCart}
                    cartItems={cartItems}
                    handleRemoveFromCart={handleRemoveFromCart}
                    handleCartItemCountChange={handleCartItemCountChange}
                  />
                </div>
                <div className="cart-checkout">
                  <CartSummary cartTotal={cartTotal} />
                  <Checkout
                    handleShopping={handleShopping}
                    handleCheckout={handleCheckout}
                    placeOrder={placeOrder}
                    authenticated={authenticated}
                    isCheckoutPage={true}
                  />
                </div>
              </div>
            </Col>
          </Row>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    cartItems: state.cart.cartItems,
    cartTotal: state.cart.cartTotal,
    authenticated: state.authentication.authenticated,
  };
};

export default connect(mapStateToProps, actions)(CheckoutPage);
