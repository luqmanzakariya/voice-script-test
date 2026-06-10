import PaymentPage from "@/components/page/payments";
import { getPaymentServer } from "@/service/server/payment";

const Payment = async () => {
  const payments = await getPaymentServer();

  return <PaymentPage payments={payments} />;
};

export default Payment;
