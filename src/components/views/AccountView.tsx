import { useEffect } from "react";
import { useNavigate } from "react-router";
import SITE_URL from "../../site";
import ChangeEmailForm from "../forms/ChangeEmailForm";
import ChangePasswordForm from "../forms/ChangePasswordForm";
import { CSRFHeaders } from "../forms/CSRFHeaders";

function AccountView() {
    const navigate = useNavigate();
    useEffect(() => {
        async function checkLogin() {
            try {
                let isLoggedInRes = await fetch(`${SITE_URL}/auth/check`, {
                    method: 'POST',
                    credentials: "include",
                    headers: new CSRFHeaders()
                });
                if (isLoggedInRes.status >= 300) {
                    navigate("/login");
                    return;
                }
            } catch {
                navigate("/login");
            }
        }

        checkLogin();
    }, []);

    async function logoutHandler() {
        try {
            await fetch(`${SITE_URL}/auth/logout`, {
                method: 'POST',
                credentials: "include",
                headers: new CSRFHeaders()
            });
        } catch {
            // do nothing
        }
        navigate("/");
    }

    return (
        <section>
            <ChangeEmailForm />
            <ChangePasswordForm />
            <button onClick={logoutHandler}>Log Out</button>
        </section>
    )
}

export default AccountView;