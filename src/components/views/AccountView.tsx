import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import SITE_URL from "../../site";
import LogoutButton from "../buttons/LogoutButton";
import DashboardHeader from "../DashboardHeader";
import ChangeEmailForm from "../forms/ChangeEmailForm";
import ChangePasswordForm from "../forms/ChangePasswordForm";
import { CSRFHeaders } from "../forms/CSRFHeaders";
import LogoutUnsavedChangesModal from "../modals/LogoutUnsavedChangesModal";

function AccountView() {
    const navigate = useNavigate();

    const emailUnsavedRef = useRef(false);
    const passwordUnsavedRef = useRef(false);

    // Modal state: { component: ReactNode, open: boolean }
    const [modal, setModal] = useState<{ component: React.ReactNode, open: boolean }>({
        component: null,
        open: false
    });

    function hasUnsavedChanges() {
        return emailUnsavedRef.current || passwordUnsavedRef.current;
    }

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
    }, [navigate]);

    async function logoutHandler() {
        if (hasUnsavedChanges()) {
            setModal({
                component: (
                    <LogoutUnsavedChangesModal onClosed={() => { setModal({ component: null, open: false }) }}>
                        <p>You have unsaved changes. Are you sure you want to log out?</p>
                    </LogoutUnsavedChangesModal>
                ),
                open: true
            });
            return;
        }

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
        <main>
            <DashboardHeader />
            <section>
                <h2 className="text-xl">Account</h2>
                {modal.open && modal.component}
                <ChangeEmailForm
                    onUnsavedChanges={(hasUnsaved: boolean) => {
                        emailUnsavedRef.current = hasUnsaved;
                    }}
                />
                <ChangePasswordForm
                    onUnsavedChanges={(hasUnsaved: boolean) => {
                        passwordUnsavedRef.current = hasUnsaved;
                    }}
                />
                <LogoutButton logoutHandler={logoutHandler} />
            </section>
        </main>
    )
}

export default AccountView;