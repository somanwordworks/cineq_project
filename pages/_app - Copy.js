// pages/_app.js
import '../styles/globals.css';
import DisclaimerModal from '../components/DisclaimerModal';
import { useState, useEffect } from 'react';
import Router from 'next/router';
import CameraLoader from '../components/CameraLoader';

// ✅ Import GA utilities
import ReactGA from "react-ga4";

export default function App({ Component, pageProps }) {
    const [pageLoading, setPageLoading] = useState(false);

    // --------------------------
    // 🔥 Google Analytics Setup
    // --------------------------
    useEffect(() => {
        // Initialize GA4
        ReactGA.initialize("G-Q2HSWGJTDD");

        // Track first page load
        ReactGA.send({
            hitType: "pageview",
            page: window.location.pathname
        });

        // Track route changes
        const handleRouteChange = (url) => {
            ReactGA.send({
                hitType: "pageview",
                page: url
            });
        };

        Router.events.on("routeChangeComplete", handleRouteChange);

        return () => {
            Router.events.off("routeChangeComplete", handleRouteChange);
        };
    }, []);


    // -----------------------------------
    // 🔄 PAGE LOADER LOGIC (YOUR CODE)
    // -----------------------------------
    useEffect(() => {
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

    // -----------------------------------
    // 🔒 SECURITY BLOCK (YOUR CODE)
    // -----------------------------------
    useEffect(() => {
        const disableContext = (e) => e.preventDefault();
        document.addEventListener("contextmenu", disableContext);

        const disableSelect = (e) => e.preventDefault();
        document.addEventListener("selectstart", disableSelect);
        document.addEventListener("copy", disableSelect);

        const disableKeys = (e) => {
            if (
                e.keyCode === 123 ||
                (e.ctrlKey && e.shiftKey && e.keyCode === 73) ||
                (e.ctrlKey && e.shiftKey && e.keyCode === 67) ||
                (e.ctrlKey && e.shiftKey && e.keyCode === 74) ||
                (e.ctrlKey && e.keyCode === 85)
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

    // -----------------------------------
    // ✔ FINAL RENDER (Your original UI)
    // -----------------------------------
    return (
        <>
            {pageLoading && <CameraLoader />}
            <DisclaimerModal />
            <Component {...pageProps} />
        </>
    );
}
