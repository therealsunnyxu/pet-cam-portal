import { useState } from "react";
import { NavLink } from "react-router";
import PasswordResetForm from "../../forms/PasswordResetForm";
import PasswordResetHeader from "./PasswordResetHeader";

function PasswordResetRequestView() {
    const [success, setSuccess] = useState(false);

    function onSuccessfulSubmit() {
        setSuccess(true);
    }

    function onClickTryAgain() {
        setSuccess(false);
    }

    const backTo = "/login";

    function ConfirmationMessage() {
        return (
            <div className="h-full flex flex-col gap-4">
                <h2 className="text-xl">Password Reset<br />Request Submitted</h2>
                <p>
                    If your email address exists on file,
                    <br />
                    you will receive an email with a link to reset your password.
                </p>
                <a onClick={onClickTryAgain} className="font-normal!">
                    Didn't receive the email?<br />Click <u>here</u> to try again.
                </a>
                <br />
            </div>
        );
    }

    return (
        <main>
            <PasswordResetHeader backTo={backTo} cancelTo="/login">
                <h1 className="text-lg!">Password Reset</h1>
            </PasswordResetHeader>

            <section className="h-full flex flex-col gap-4">
                <div className="h-full flex flex-col gap-4">
                    <h2 className="text-xl">Forgot your password?</h2>
                    {!success ? (
                        <PasswordResetForm onSuccessfulSubmit={onSuccessfulSubmit} />
                    ) : (
                        <ConfirmationMessage />
                    )}
                </div>
                <NavLink to="/login" className="button">Back to Login</NavLink>
            </section>
        </main>
    );
}


export default PasswordResetRequestView;