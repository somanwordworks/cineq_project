import '../styles/globals.css';
import DisclaimerModal from '../components/DisclaimerModal';

export default function App({ Component, pageProps }) {
  return (
    <>
      <DisclaimerModal />
      <Component {...pageProps} />
    </>
  );
}
