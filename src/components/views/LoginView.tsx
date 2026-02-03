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
                let isLoggedInRes = await fetch(`${SITE_URL}/api/auth/check`, {
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
            <header className="bg-neutral-900 w-screen flex justify-center items-center">
                <h1 className="h-12! flex items-center justify-center text-2xl! mx-4 whitespace-nowrap">Pet Cam</h1>
            </header>
            <section>
                <h2 className="text-xl">Log In</h2>
                <LoginForm />
            </section>
        </main >
    );
}

export default LoginView;