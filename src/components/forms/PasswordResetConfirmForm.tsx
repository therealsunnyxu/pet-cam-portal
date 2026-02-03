import { type FormEvent, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router";
import SITE_URL from "../../site";
import { CSRFHeaders } from "./CSRFHeaders";
import FieldErrors from "./FieldErrors";

function PasswordResetConfirmForm(props: { uidb64?: string, redirectTo: string }) {
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [newPassword1Errored, setNewPassword1Errored] = useState(false);
    const [newPassword2Errored, setNewPassword2Errored] = useState(false);
    const [newPassword1, setNewPassword1] = useState("");
    const [newPassword2, setNewPassword2] = useState("");
    const [isSuccessful, setIsSuccessful] = useState(false);
    const navigate = useNavigate();
    

    useEffect(() => {
    }, []);

    async function handleSubmit(event: FormEvent) {
        if (!event || typeof event.preventDefault !== "function" || !("target" in event)) {
            setErrorMsg("Invalid event object");
            return;
        }
        event.preventDefault();

        // Check form validity
        if (event.target instanceof HTMLFormElement === false) {
            setErrorMsg("Invalid form object");
            return;
        }
        const form: HTMLFormElement = event.target;
        const formData: FormData = new FormData(form);
        const newPassword1Field: FormDataEntryValue | null = formData.get("new_password1");
        const newPassword2Field: FormDataEntryValue | null = formData.get("new_password2");
        if ((newPassword1Field == null) || (newPassword2Field == null)) {
            setErrorMsg("Invalid form object");
            return;
        }

        // Check field validity
        const newPassword1 = newPassword1Field.toString().trim();
        const newPassword2 = newPassword2Field.toString().trim();
        setNewPassword1Errored(newPassword1.length < 1);
        setNewPassword2Errored(newPassword2.length < 1);

        if ((newPassword1.length < 1) && (newPassword2.length < 1)) {
            setErrorMsg("Missing both password fields");
            return;
        } else if (newPassword1.length < 1) {
            setErrorMsg("Missing new password field");
            return;
        } else if (newPassword2.length < 1) {
            setErrorMsg("Missing password confirmation field");
            return;
        }

        if (newPassword1 !== newPassword2) {
            setErrorMsg("Passwords do not match");
            setNewPassword1Errored(true);
            setNewPassword2Errored(true);
            return
        }

        let res: Response;

        try {
            res = await fetch(`${SITE_URL}/api/auth/password/reset/confirm/${props.uidb64}/set-password/`, {
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
            setNewPassword1Errored(false);
            setNewPassword2Errored(false);

            // Display success message with "Redirecting in 5..." and start countdown
            let countdown = 5;
            setSuccessMsg(`Successfully changed password. Redirecting in ${countdown}...`);
            setNewPassword1("");
            setNewPassword2("");
            setIsSuccessful(true);
            const intervalId = setInterval(() => {
                countdown -= 1;
                if (countdown > 0) {
                    setSuccessMsg(`Successfully changed password. Redirecting in ${countdown}...`);
                } else {
                    clearInterval(intervalId);
                    navigate(props.redirectTo);
                }
            }, 1000);
            return;
        }

        setSuccessMsg("");
        setIsSuccessful(false);

        if (res.status >= 500) {
            setErrorMsg("Sorry, server is not responding. Please try again in 5 minutes.");
            return;
        }

        if (res.status == 429) {
            setErrorMsg("Sorry, server is overloaded. Please try again in 5 minutes.");
            return;
        }

        const contentTypeHeader = res.headers.get("Content-Type");
        const contentType = contentTypeHeader === null ? "" : contentTypeHeader.toString()
        if (contentType.length < 1
            || !(
                contentType.includes("text/") || contentType.includes("application/json")
            )
        ) {
            setErrorMsg("Invalid or missing passwords");
            setNewPassword1Errored(true);
            setNewPassword2Errored(true);
        }

        if (contentType.includes("text/")) {
            setErrorMsg(await res.text());
            return;
        }

        // Assumed to be a JSON
        const json = await res.json();
        setErrorMsg(json);
        setNewPassword1Errored(Object.keys(json).includes("new_password1"));
        setNewPassword2Errored(Object.keys(json).includes("new_password2"));
    }

    return isSuccessful ? (<p>
        {successMsg}
    </p>) : (
        <form method="POST" onSubmit={handleSubmit} aria-label="Change password">
            <fieldset>
                <label htmlFor="new_password1">New Password</label>
                <input
                    type="password"
                    id="new_password1"
                    name="new_password1"
                    aria-label="New password"
                    value={newPassword1}
                    onChange={e => setNewPassword1(e.target.value)}
                    className={`border-1 rounded-md ${newPassword1Errored ? "border-red-600!" : ""}`}
                />
            </fieldset>
            <fieldset>
                <label htmlFor="new_password2">Confirm Password</label>
                <input
                    type="password"
                    id="new_password2"
                    name="new_password2"
                    aria-label="Confirm password"
                    value={newPassword2}
                    onChange={e => setNewPassword2(e.target.value)}
                    className={`border-1 rounded-md ${newPassword2Errored ? "border-red-600!" : ""}`}
                />
            </fieldset>
            <button aria-label="Submit password reset" className="bg-blue-900!">Submit</button>
            <FieldErrors errors={errorMsg} />
            <output name="success" aria-label="Success message">
                {successMsg}
            </output>
            <NavLink to="/login" className="button">Cancel</NavLink>
        </form>
    );
}

export default PasswordResetConfirmForm;