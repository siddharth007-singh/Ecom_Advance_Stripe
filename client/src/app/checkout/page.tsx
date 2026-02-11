"use client";

import React from 'react'
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import CheckoutSuspense from './checkoutSkeleton'


type Props = {}

const CheckoutPage = (props: Props) => {

  const options = {
    clientId:"AfuPjh9ur9K8K-EWC2iIZZyWMlKJveEpBRhgwAN0EPX9vOee2_fTnh0_CKEF6p9yvU5YW2XHSaI7WohR",
  };

  return (
    <PayPalScriptProvider options={options}>
      <CheckoutSuspense />
    </PayPalScriptProvider>
  )
}

export default CheckoutPage