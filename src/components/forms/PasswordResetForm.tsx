import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router";
import SITE_URL from "../../site";
import { CSRFHeaders } from "./CSRFHeaders";
import FieldErrors from "./FieldErrors";

function PasswordResetForm() {
    const [errorMsg, setErrorMsg] = useState("");
    const [emailErrored, setEmailErrored] = useState(false);
    const navigate = useNavigate();

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
        setEmailErrored(formData.get("email") == null);
        if (emailErrored) {
            setErrorMsg("Invalid email format");
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
        } catch {
            setErrorMsg("Authentication server is down. Please try again in 5 minutes.");
            return;
        }

        if (res.status < 400) {
            // success
            setErrorMsg("");
            setEmailErrored(false);
            navigate("/reset-password/submitted");
            return;
        }
        if (res.status >= 500) {
            setErrorMsg("Sorry, server is not responding. Please try again in 5 minutes.");
            return;
        }
        if (res.status == 429) {
            setErrorMsg("Sorry, server is overloadWed. Please try again in 5 minutes.");
            return;
        }
        setErrorMsg("Invalid email format");
        setEmailErrored(true);
    }

    return (
        <form id="passwordResetForm" method="POST" onSubmit={handleSubmit} aria-label="Password reset form">
            <fieldset>
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" aria-label="Email" />
            </fieldset>
            <button aria-label="Submit password reset request">Submit</button>
            <FieldErrors errors={errorMsg} />
        </form>
    );
}

export default PasswordResetForm;