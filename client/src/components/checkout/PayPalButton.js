import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

function PayPalButton({ amount, onSuccess }) {
  return (
    <PayPalScriptProvider options={{ 
      "client-id": "your_client_id",
      currency: "USD" 
    }}>
      <PayPalButtons
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: amount.toString(),
                },
              },
            ],
          });
        }}
        onApprove={async (data, actions) => {
          const order = await actions.order.capture();
          onSuccess(order);
        }}
      />
    </PayPalScriptProvider>
  );
}

export default PayPalButton;