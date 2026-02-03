import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router";
import SITE_URL from "../../../site";
import { CSRFHeaders } from "../../forms/CSRFHeaders";
import PasswordResetConfirmForm from "../../forms/PasswordResetConfirmForm";

enum ParamStatus {
    INVALID = "invalid",
    VALID = "valid",
    FETCH_ERROR = "fetch_error"
}

function PasswordResetConfirmView() {
    const params = useParams();
    const uidb64 = params.uidb64;
    const token = params.token;
    const [paramStatus, setParamStatus] = useState<ParamStatus | null>(null);

    useEffect(() => {
        async function checkParams() {
            if (
                uidb64 === undefined ||
                token === undefined ||
                uidb64 === null ||
                token === null ||
                (typeof uidb64 === "string" && uidb64.trim().length < 1) ||
                (typeof token === "string" && token.trim().length < 1)
            ) {
                setParamStatus(ParamStatus.INVALID);
                return;
            }

            if (typeof window !== "undefined" && window.history && window.location) {
                const pathWithoutParams = window.location.pathname
                    .replace(/\/reset-password\/[^/]+\/[^/]+$/, "/reset-password");
                window.history.replaceState({}, "", pathWithoutParams + window.location.search + window.location.hash);
            }

            let checkValidityRes: Response;
            try {
                checkValidityRes = await fetch(`${SITE_URL}/api/auth/password/reset/confirm/${uidb64}/${token}`, {
                    method: 'POST',
                    credentials: "include",
                    headers: new CSRFHeaders()
                });
            } catch {
                setParamStatus(ParamStatus.FETCH_ERROR);
                return;
            }

            if (checkValidityRes.status >= 300) {
                setParamStatus(ParamStatus.INVALID);
                return;
            }

            setParamStatus(ParamStatus.VALID);
        }
        checkParams();
    }, [uidb64, token]);


    if (paramStatus === ParamStatus.INVALID) {
        return (
            <main>
                <header className="bg-neutral-900 w-screen flex justify-between items-center">
                    <NavLink to="/login" className="h-12 flex items-center justify-center text-2xl mx-4 whitespace-nowrap">Pet Cam</NavLink>
                </header>
                <section className="h-full flex flex-col gap-4">
                    <h2>Invalid Reset Request</h2>
                    <p>This password reset request has either expired or been used.</p>
                    <NavLink to="/reset-password" className="font-normal!">Still need to reset your password?<br />Click <u>here</u> to try again.</NavLink>
                    <NavLink to="/login" className="button">Back to Login</NavLink>
                </section>
            </main>
        );
    } else if (paramStatus === ParamStatus.FETCH_ERROR) {
        return (
            <main>
                <header className="bg-neutral-900 w-screen flex justify-between items-center">
                    <NavLink to="/login" className="h-12 flex items-center justify-center text-2xl mx-4 whitespace-nowrap">Pet Cam</NavLink>
                </header>
                <section className="h-full flex flex-col gap-4">
                    <h2>Authentication Server Down</h2>
                    <p>Sorry, the authentication server is temporarily down. Please wait 5 minutes, then</p>
                    <NavLink to="/reset-password" className="font-normal!">Click <u>here</u> to try again.</NavLink>
                    <NavLink to="/login" className="button">Back to Login</NavLink>
                </section>
            </main>
        );
    } else if (paramStatus === ParamStatus.VALID) {
        return (
            <main>
                <header className="bg-neutral-900 w-screen flex justify-between items-center">
                    <NavLink to="/login" className="h-12 flex items-center justify-center text-2xl mx-4 whitespace-nowrap">Pet Cam</NavLink>
                </header>
                <section className="h-full flex flex-col gap-4">
                    <h2>Reset Password</h2>
                    <PasswordResetConfirmForm uidb64={uidb64} redirectTo={"/login"}/>
                </section>
            </main>
        );
    }
}

export default PasswordResetConfirmView;