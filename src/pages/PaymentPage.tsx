import { useSearchParams } from 'react-router-dom';
import PaymentForm from '../components/PaymentForm';

const PaymentPage = () => {
  const [searchParams] = useSearchParams();
  const priceId = searchParams.get('priceId');
  const planName = searchParams.get('plan');

  return (
    <div className="min-h-screen">
      <PaymentForm
        priceId={priceId || undefined}
        planName={planName || undefined}
      />
    </div>
  );
};

export default PaymentPage;