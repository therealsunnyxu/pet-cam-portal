import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router";
import SITE_URL from "../../site";
import { CSRFHeaders } from "./CSRFHeaders";
import FieldErrors from "./FieldErrors/FieldErrors";

function LoginForm() {
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [usernameErrored, setUsernameErrored] = useState(false);
    const [passwordErrored, setPasswordErrored] = useState(false);
    const navigate = useNavigate();

    async function handleSubmit(event: FormEvent) {
        // Check form validity
        if (!event || typeof event.preventDefault !== "function" || !("target" in event)) {
            setErrorMsg("Invalid event object");
            return;
        }
        event.preventDefault();
        if (event.target instanceof HTMLFormElement === false) {
            setErrorMsg("Invalid form object");
            return;
        }
        const formData: FormData = new FormData(event.target);
        const usernameField: FormDataEntryValue | null = formData.get("username");
        const passwordField: FormDataEntryValue | null = formData.get("username");
        if ((usernameField == null) || (passwordField == null)) {
            setErrorMsg("Invalid form object");
            return;
        }

        // Check field validity
        const username = usernameField.toString();
        const password = passwordField.toString();
        setUsernameErrored(username.length < 1)
        setPasswordErrored(password.length < 1)
        if ((username.length < 1) && (password.length < 1)) {
            setErrorMsg("Missing username and password field");
            return;
        } else if (username.length < 1) {
            setErrorMsg("Missing username field");
            return;
        } else if (password.length < 1) {
            setErrorMsg("Missing password field");
            return;
        }

        let res = await fetch(`${SITE_URL}/auth/login`, {
            method: 'POST',
            body: formData,
            credentials: "include",
            headers: new CSRFHeaders()
        });

        if (res.status < 400) {
            // success
            setErrorMsg("");
            setUsernameErrored(false);
            setPasswordErrored(false);
            setSuccessMsg("Successfully logged in. Redirecting...");
            navigate("/dashboard");
            return;
        }

        setSuccessMsg("");

        if (res.status >= 500) {
            setErrorMsg("Sorry, server is not responding. Please try again in 5 minutes.");
            return;
        }

        setErrorMsg("Invalid credentials");
        setUsernameErrored(true);
        setPasswordErrored(true);
    }

    return (
        <form id="loginForm" method="POST" onSubmit={handleSubmit} aria-label="Login form">
            <fieldset>
                <label htmlFor="username">Username</label>
                <input type="text" id="username" name="username" aria-label="Username" />
            </fieldset>
            <fieldset>
                <label htmlFor="password">Password</label>
                <input type="password" id="password" name="password" aria-label="Password" />
            </fieldset>
            <button aria-label="Log in to your account">Log In</button>
            <FieldErrors errors={errorMsg} />
            <output name="success" aria-label="Success message">
                {successMsg}
            </output>
        </form>
    );
}

export default LoginForm;