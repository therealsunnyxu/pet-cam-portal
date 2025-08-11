import { useEffect } from "react";
import { useNavigate } from "react-router";
import SITE_URL from "../../site";
import { CSRFHeaders } from "../forms/CSRFHeaders";

function IndexView() {
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
                navigate("/dashboard");
            } catch {
                navigate("/login");
            }
        }

        checkLogin();
    }, []);
    return (<></>);
}

export default IndexView;