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

    // 🔒 Security block (added without touching your code)
    useEffect(() => {
        // Disable right-click
        const disableContext = (e) => e.preventDefault();
        document.addEventListener("contextmenu", disableContext);

        // Disable text selection
        const disableSelect = (e) => e.preventDefault();
        document.addEventListener("selectstart", disableSelect);
        document.addEventListener("copy", disableSelect);

        // Disable inspect element shortcuts
        const disableKeys = (e) => {
            if (
                e.keyCode === 123 || // F12
                (e.ctrlKey && e.shiftKey && e.keyCode === 73) || // Ctrl+Shift+I
                (e.ctrlKey && e.shiftKey && e.keyCode === 67) || // Ctrl+Shift+C
                (e.ctrlKey && e.shiftKey && e.keyCode === 74) || // Ctrl+Shift+J
                (e.ctrlKey && e.keyCode === 85) // Ctrl+U
            ) {
                e.preventDefault();
                return false;
            }
        };
        document.addEventListener("keydown", disableKeys);

        return () => {
            document.removeEventListener("contextmenu", disableContext);
            document.removeEventListener("selectstart", disableSelect);
            document.removeEventListener("copy", disableSelect);
            document.removeEventListener("keydown", disableKeys);
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
