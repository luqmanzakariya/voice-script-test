import PaymentDetailPage from "@/components/page/payments/detail";
import { getPaymentByUserServer } from "@/service/server/payment";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

const PaymentByUser = async ({ params }: Props) => {
  const { id } = await params;
  const paymentDetail = await getPaymentByUserServer(id);

  return <PaymentDetailPage paymentDetail={paymentDetail} />;
};

export default PaymentByUser;
