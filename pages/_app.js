// pages/_app.js
import '../styles/globals.css';
import DisclaimerModal from '../components/DisclaimerModal';
import { useState, useEffect } from 'react';
import Router from 'next/router';
import CameraLoader from '../components/CameraLoader';

export default function App({ Component, pageProps }) {
    const [pageLoading, setPageLoading] = useState(false);

    useEffect(() => {
        // show loader on route start
        const start = () => setPageLoading(true);
        const end = () => setPageLoading(false);

        Router.events.on('routeChangeStart', start);
        Router.events.on('routeChangeComplete', end);
        Router.events.on('routeChangeError', end);

        return () => {
            Router.events.off('routeChangeStart', start);
            Router.events.off('routeChangeComplete', end);
            Router.events.off('routeChangeError', end);
        };
    }, []);

    return (
        <>
            {/* FULL SCREEN CAMERA LOADER */}
            {pageLoading && <CameraLoader />}

            {/* Your Existing Disclaimer Modal */}
            <DisclaimerModal />

            {/* Actual Page */}
            <Component {...pageProps} />
        </>
    );
}
