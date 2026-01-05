

///components/LegalModal.jsx//

import React, { useEffect } from "react";

export default function LegalModal({ open, setOpen }) {
    // Prevent background scroll when modal is open
    useEffect(() => {
        if (open) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "auto";
    }, [open]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[9999] p-2 animate-fadeIn">

            {/* RESPONSIVE MODAL WRAPPER */}
            <div className="
        bg-[#111] 
        text-gray-300 
        rounded-xl 
        w-full 
        max-w-2xl 
        max-h-[92vh] 
        overflow-y-auto 
        p-4 md:p-6 
        relative 
        border border-gray-700 
        shadow-xl
      ">

                {/* Close Button (mobile-friendly) */}
                <button
                    onClick={() => setOpen(false)}
                    className="
            absolute 
            top-3 right-3 
            text-gray-300 
            text-3xl 
            font-bold 
            hover:text-white 
            active:scale-90 
            transition
          "
                    style={{ padding: "8px" }}  // extra tap target
                >
                    ×
                </button>

                {/* Title */}
                <h2 className="text-lg md:text-xl font-bold mb-4 text-yellow-400 tracking-wide text-center md:text-left">
                    CINEQ – Terms, Privacy & Policies
                </h2>

                {/* CONTENT (scrollable) */}
                <div className="text-[13px] md:text-sm leading-relaxed space-y-4 pb-10 md:pb-0">

                    {/* ——————— TERMS OF SERVICE ——————— */}
                    <h3 className="text-base text-yellow-400 font-semibold">1. Terms of Service</h3>

                    <p><strong>1.1 Acceptance of Terms</strong><br />
                        By using <strong>CINEQ</strong>, you agree to these Terms.</p>

                    <p><strong>1.2 Allowed Use</strong><br />
                        • No copying content<br />
                        • No scraping<br />
                        • No hacking<br />
                        • No abusive comments<br />
                        • No malware/spam
                    </p>

                    <p><strong>1.3 User Content</strong><br />
                        You grant CINEQ a non-exclusive license to display your submitted content.
                    </p>

                    <p><strong>1.4 Intellectual Property</strong><br />
                        All content belongs to CINEQ.</p>

                    <p><strong>1.5 External Links</strong><br />
                        We are not responsible for external sites.</p>

                    <p><strong>1.6 No Warranty</strong><br />
                        CINEQ is provided “as is”.</p>

                    <p><strong>1.7 Liability Limits</strong><br />
                        We are not liable for damages.</p>

                    <p><strong>1.8 Termination</strong><br />
                        Access may be restricted if rules are violated.</p>


                    {/* ——————— PRIVACY POLICY ——————— */}
                    <h3 className="text-base text-yellow-400 font-semibold">2. Privacy Policy</h3>

                    <p><strong>2.1 What We Collect</strong><br />
                        a) You provide: name, email, comments<br />
                        b) Auto-collected: IP, device, analytics<br />
                        c) Cookies: for personalization
                    </p>

                    <p><strong>2.2 How We Use It</strong><br />
                        • Improve service<br />
                        • Personalize content<br />
                        • Analytics<br />
                        • Prevent abuse<br />
                        We NEVER sell data.
                    </p>

                    <p><strong>2.3 Sharing</strong><br />
                        Only with hosting/analytics or if legally required.</p>

                    <p><strong>2.4 Security</strong><br />
                        HTTPS + secure hosting.</p>

                    <p><strong>2.5 Third-party Content</strong><br />
                        YouTube/social embeds follow their policy.</p>

                    <p><strong>2.6 Your Rights</strong><br />
                        Request: access, deletion, opt-out.<br />
                        Email: <strong>privacy@cineq.in</strong>
                    </p>

                    <p><strong>2.7 Children</strong><br />
                        Not for users under 13.</p>

                    <p><strong>2.8 Updates</strong><br />
                        Policy may change.</p>


                    {/* ——————— GUIDELINES ——————— */}
                    <h3 className="text-base text-yellow-400 font-semibold">3. Community Guidelines</h3>
                    <p>
                        • No hate speech<br />
                        • No harassment<br />
                        • No piracy links<br />
                        • No misinformation<br />
                        • No spam<br />
                        • No copyrighted uploads
                    </p>


                    {/* ——————— DISCLAIMER ——————— */}
                    <h3 className="text-base text-yellow-400 font-semibold">4. Disclaimer</h3>
                    <p>
                        CINEQ content is opinion-based.
                        We do not guarantee absolute accuracy of:
                        <br />• Box office numbers
                        <br />• Cast/crew information
                        <br />• Rumours or gossip
                        <br />• Ratings or interpretations
                    </p>


                    {/* ——————— CONTACT ——————— */}
                    <h3 className="text-base text-yellow-400 font-semibold">5. Contact</h3>
                    <p>
                        contact@dnvarc.com<br />
                        
                    </p>
                </div>

                {/* Bottom Close Button */}
                <div className="mt-6 text-center md:mt-4">
                    <button
                        onClick={() => setOpen(false)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-2 rounded-md font-semibold transition w-full md:w-auto"
                    >
                        Close
                    </button>
                </div>

            </div>
        </div>
    );
}
