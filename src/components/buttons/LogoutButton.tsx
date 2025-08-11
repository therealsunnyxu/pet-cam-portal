import { useNavigate } from "react-router";
import SITE_URL from "../../site";
import { CSRFHeaders } from "../forms/CSRFHeaders";

function LogoutButton(props: {
    logoutHandler?: (...args: any[]) => any
}) {
    const navigate = useNavigate();

    async function defaultLogoutHandler() {
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

    return (<button onClick={typeof props.logoutHandler === "function" ? props.logoutHandler : defaultLogoutHandler}
        className="bg-red-700! hover:border-white!"
        aria-label="Log out">Log Out</button>);
}

export default LogoutButton;