import { type FormEvent, useState } from "react";
import SITE_URL from "../../site";
import { CSRFHeaders } from "./CSRFHeaders";
import FieldErrors from "./FieldErrors/FieldErrors";

function ChangeEmailForm() {
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [oldEmailErrored, setOldEmailErrored] = useState(false);
    const [newEmailErrored, setNewEmailErrored] = useState(false);

    async function handleSubmit(event: FormEvent) {
        if (!event || typeof event.preventDefault !== "function" || !("target" in event)) {
            setErrorMsg("Invalid event object");
            return;
        }
        event.preventDefault();

        // Check if the user is logged in
        let isLoggedInRes = await fetch(`${SITE_URL}/auth/check`, {
            method: 'POST',
            credentials: "include",
            headers: new CSRFHeaders()
        });
        if (isLoggedInRes.status >= 300) {
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
        const oldEmailField: FormDataEntryValue | null = formData.get("old_email");
        const newEmailField: FormDataEntryValue | null = formData.get("new_email");
        if ((oldEmailField == null) || (newEmailField == null)) {
            setErrorMsg("Invalid form object");
            return;
        }

        // Check field validity
        const oldEmail = oldEmailField.toString().trim();
        const newEmail = newEmailField.toString().trim();
        setOldEmailErrored(oldEmail.length < 1);
        setNewEmailErrored(newEmail.length < 1);

        if ((oldEmail.length < 1) && (newEmail.length < 1)) {
            setErrorMsg("Missing both email fields");
            return;
        } else if (oldEmail.length < 1) {
            setErrorMsg("Missing old email field");
            return;
        } else if (newEmail.length < 1) {
            setErrorMsg("Missing new email field");
            return;
        }

        if (oldEmail === newEmail) {
            setErrorMsg("New email cannot be the same as old email");
            setOldEmailErrored(false);
            setNewEmailErrored(true);
            return;
        }

        let res = await fetch(`${SITE_URL}/auth/user/email`, {
            method: 'POST',
            body: formData,
            credentials: "include",
            headers: new CSRFHeaders()
        });

        if (res.status < 400) {
            // success
            setErrorMsg("");
            setOldEmailErrored(false);
            setNewEmailErrored(false);
            setSuccessMsg("Successfully changed email");
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
            setErrorMsg("Invalid or missing emails");
            setOldEmailErrored(true);
            setNewEmailErrored(true);
        }

        if (contentType.includes("text/")) {
            setErrorMsg(await res.text());
            return;
        }

        // Assumed to be a JSON
        const json = await res.json();
        setErrorMsg(json);
        setOldEmailErrored(Object.keys(json).includes("old_email"));
        setNewEmailErrored(Object.keys(json).includes("new_email"));
    }

    return (
        <form method="POST" onSubmit={handleSubmit} aria-label="Change email">
            <fieldset>
                <label htmlFor="old_email">Old Email</label>
                <input type="email" id="old_email" name="old_email" aria-label="Old email" />
            </fieldset>
            <fieldset>
                <label htmlFor="new_email">New Email</label>
                <input type="email" id="new_email" name="new_email" aria-label="New email" />
            </fieldset>
            <button aria-label="Submit email change">Submit</button>
            <FieldErrors errors={errorMsg} />
            <output name="success" aria-label="Success message">
                {successMsg}
            </output>
        </form>
    );
}

export default ChangeEmailForm;