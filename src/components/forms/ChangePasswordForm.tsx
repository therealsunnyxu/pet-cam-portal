import { type FormEvent, useEffect, useRef, useState } from "react";
import SITE_URL from "../../site";
import { CSRFHeaders } from "./CSRFHeaders";
import FieldErrors from "./FieldErrors";

function ChangePasswordForm(props: {
    onUnsavedChanges?: (hasUnsavedData: boolean) => void
}) {
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [newPassword1Errored, setNewPassword1Errored] = useState(false);
    const [newPassword2Errored, setNewPassword2Errored] = useState(false);

    // Track the values of the fields
    const [newPassword1, setNewPassword1] = useState("");
    const [newPassword2, setNewPassword2] = useState("");

    // Track last unsaved state to avoid duplicate calls
    const lastUnsavedState = useRef<boolean | null>(null);

    // Effect to call onUnsavedChanges when the total length changes from 0 <-> >0
    useEffect(() => {
        if (typeof props.onUnsavedChanges !== "function") return;
        const totalLength = newPassword1.length + newPassword2.length;
        const hasUnsaved = totalLength > 0;
        if (lastUnsavedState.current !== hasUnsaved) {
            props.onUnsavedChanges(hasUnsaved);
            lastUnsavedState.current = hasUnsaved;
        }
    }, [newPassword1, newPassword2, props]);

    async function handleSubmit(event: FormEvent) {
        if (!event || typeof event.preventDefault !== "function" || !("target" in event)) {
            setErrorMsg("Invalid event object");
            return;
        }
        event.preventDefault();

        // Check if the user is logged in
        try {
            let isLoggedInRes = await fetch(`${SITE_URL}/api/auth/check`, {
                method: 'POST',
                credentials: "include",
                headers: new CSRFHeaders()
            });
            if (isLoggedInRes.status >= 300) {
                setErrorMsg("Not logged in")
                return;
            }
        } catch {
            setErrorMsg("Not logged in")
            return;
        }

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

        if (newPassword1 === newPassword2) {
            setErrorMsg("New password cannot be the same as old password");
            setNewPassword1Errored(false);
            setNewPassword2Errored(true);
            return
        }

        let res: Response;

        try {
            res = await fetch(`${SITE_URL}/api/auth/user/password`, {
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
            setSuccessMsg("Successfully changed password");
            setNewPassword1("");
            setNewPassword2("");
            return;
        }

        setSuccessMsg("");

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

    return (
        <form method="POST" onSubmit={handleSubmit} aria-label="Change password">
            <fieldset>
                <label htmlFor="new_password1">Old Password</label>
                <input
                    type="password"
                    id="new_password1"
                    name="new_password1"
                    aria-label="Old password"
                    value={newPassword1}
                    onChange={e => setNewPassword1(e.target.value)}
                    className={`border-1 rounded-md ${newPassword1Errored ? "border-red-600!" : ""}`}
                />
            </fieldset>
            <fieldset>
                <label htmlFor="new_password2">New Password</label>
                <input
                    type="password"
                    id="new_password2"
                    name="new_password2"
                    aria-label="New password"
                    value={newPassword2}
                    onChange={e => setNewPassword2(e.target.value)}
                    className={`border-1 rounded-md ${newPassword2Errored ? "border-red-600!" : ""}`}
                />
            </fieldset>
            <button aria-label="Submit password change">Submit</button>
            <FieldErrors errors={errorMsg} />
            <output name="success" aria-label="Success message">
                {successMsg}
            </output>
        </form>
    );
}

export default ChangePasswordForm;