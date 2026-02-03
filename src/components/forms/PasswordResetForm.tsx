import { type FormEvent, useState } from "react";
import SITE_URL from "../../site";
import { CSRFHeaders } from "./CSRFHeaders";
import FieldErrors from "./FieldErrors";

function PasswordResetForm(props: { onSuccessfulSubmit?: () => void } = {}) {
    const [errorMsg, setErrorMsg] = useState("");
    const [emailErrored, setEmailErrored] = useState(false);

    async function handleSubmit(event: FormEvent) {
        if (!event || typeof event.preventDefault !== "function" || !("target" in event)) {
            setErrorMsg("Invalid event object");
            return;
        }
        event.preventDefault();
        if (event.target instanceof HTMLFormElement === false) {
            setErrorMsg("Invalid form object");
            return;
        }
        const form: HTMLFormElement = event.target;
        const formData: FormData = new FormData(form);
        const emailField = formData.get("email");
        if (emailField == null || emailField.toString().length < 1) {
            setEmailErrored(true);
            setErrorMsg("Email cannot be blank");
            return;
        }

        let res: Response;
        try {
            res = await fetch(`${SITE_URL}/api/auth/password/reset`, {
                method: 'POST',
                body: formData,
                credentials: "include",
                headers: new CSRFHeaders()
            });

            if (typeof props.onSuccessfulSubmit === "function") {
                props.onSuccessfulSubmit();
            }
        } catch {
            setErrorMsg("Authentication server is down. Please try again in 5 minutes.");
            return;
        }



        if (res.status < 400) {
            // success
            setErrorMsg("");
            setEmailErrored(false);
            // no redirecting to a separate page because it's a state of the reset request page, not a separate page
            return;
        }
        if (res.status >= 500) {
            setErrorMsg("Sorry, server is not responding. Please try again in 5 minutes.");
            return;
        }
        if (res.status == 429) {
            setErrorMsg("Sorry, server is overloaded. Please try again in 5 minutes.");
            return;
        }
        setErrorMsg("Invalid email format");
        setEmailErrored(true);
    }

    return (
        <form id="passwordResetForm" method="POST" onSubmit={handleSubmit} aria-label="Password reset form">
            <p>
                To reset your password, enter the email address associated with your account.
            </p>
            <fieldset>
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" aria-label="Email" className={`border-1 rounded-md ${emailErrored ? "border-red-600!" : ""}`} />
            </fieldset>
            <button aria-label="Submit password reset request">Submit</button>
            <FieldErrors errors={errorMsg} />
        </form>
    );
}

export default PasswordResetForm;