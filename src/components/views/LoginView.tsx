import { useEffect } from "react";
import { useNavigate } from "react-router";
import SITE_URL from "../../site";
import { CSRFHeaders } from "../forms/CSRFHeaders";
import LoginForm from "../forms/LoginForm";

function LoginView() {
    const navigate = useNavigate();
    useEffect(() => {
        async function autoLogin() {
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
                navigate("/dashboard");
            } catch {
                navigate("/login");
            }
        }

        autoLogin();
    }, []);
    return (
        <main>
            <section>
                <h2 className="text-xl">Log In</h2>
                <LoginForm />
            </section>
        </main>
    );
}

export default LoginView;