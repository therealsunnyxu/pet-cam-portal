import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { useEffect, useRef, useState, type PropsWithChildren } from "react";
import { NavLink, useLocation, useNavigate, type Location } from "react-router";
import SITE_URL from "../../site";
import LogoutButton from "../buttons/LogoutButton";
import ChangeEmailForm from "../forms/ChangeEmailForm";
import ChangePasswordForm from "../forms/ChangePasswordForm";
import { CSRFHeaders } from "../../csrf";
import UnsavedChangesModal from "../modals/UnsavedChangesModal";
import { SiteLinks } from "./SiteLinks";

function AccountHeader(props: {
    onLinkClicked?: (link: string, label: string) => any;
}) {
    const { onLinkClicked } = props;

    function handleLinkClick(link: string, label: string) {
        if (typeof onLinkClicked === "function") {
            onLinkClicked(link, label);
        }
    }

    return (
        <header className="bg-neutral-900 w-screen flex justify-center items-center">
            <div className="flex h-full items-center justify-between w-full max-w-2xl">
                <NavLink to="/dashboard" className="h-12 flex items-center justify-center text-2xl mx-4 whitespace-nowrap">Pet Cam</NavLink>
                <nav className="flex flex-col h-full items-end justify-center">
                    <ul className="flex gap-4 p-4">
                        {Object.entries(SiteLinks).map(([path, label]) => (
                            <li key={path}>
                                <a onClick={() => handleLinkClick(path, label)} className="select-none">
                                    {label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </header >
    );
}

interface AccountDropdownProps {
    ariaLabel?: string;
    className?: string;
    forLabel?: string;
}

function AccountDropdown(props: PropsWithChildren<AccountDropdownProps>) {
    const { ariaLabel, className, children, forLabel } = props;
    const [isClosed, setClosed] = useState(true);
    return (
        <div aria-label={ariaLabel} className={className}>
            <div aria-label="Open/Close Dropdown"
                onClick={() => { setClosed(!isClosed) }}
                className="flex w-full grow align-middle justify-between select-none"
            >
                <h3 className="font-medium">{forLabel}</h3>{isClosed ? <KeyboardArrowDown /> : <KeyboardArrowUp />}
            </div>
            <div className={`${isClosed ? "hidden" : ""}`}>
                {children}
            </div>
        </div>
    )
}

function AccountView() {
    const navigate = useNavigate();
    const location: Location = useLocation();

    const emailUnsavedRef = useRef(false);
    const passwordUnsavedRef = useRef(false);

    // Modal state: { component: ReactNode, open: boolean }
    const [modal, setModal] = useState<{ component: React.ReactNode, open: boolean }>({
        component: null,
        open: false
    });

    const [emailUnsavedChanges, setEmailUnsavedChanges] = useState(false);
    const [passwordUnsavedChanges, setPasswordUnsavedChanges] = useState(false);

    function hasUnsavedChanges() {
        return emailUnsavedRef.current || passwordUnsavedRef.current;
    }

    useEffect(() => {
        async function checkLogin() {
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
                    <UnsavedChangesModal goAheadButton={<LogoutButton />} onClosed={() => { setModal({ component: null, open: false }) }}>
                        <p>
                            You have unsaved changes for:
                        </p>
                        <ul className="list-disc text-left">
                            {emailUnsavedChanges ? <li>Email</li> : <></>}
                            {passwordUnsavedChanges ? <li>Password</li> : <></>}
                        </ul>
                        <p>Are you sure you want to log out?</p>
                    </UnsavedChangesModal>
                ),
                open: true
            });
            return;
        }

        try {
            await fetch(`${SITE_URL}/api/auth/logout`, {
                method: 'POST',
                credentials: "include",
                headers: new CSRFHeaders()
            });
        } catch {
            // do nothing
        }

        navigate("/");
    }

    async function navigateAwayHandler(link: string, label: string) {
        if (location.pathname === link) {
            return;
        }

        if (!hasUnsavedChanges()) {
            navigate("/dashboard");
            return;
        }

        setModal({
            component: (
                <UnsavedChangesModal goAheadButton={<button type="button" onClick={async () => navigate(link)}>Go to {label}</button>} onClosed={() => { setModal({ component: null, open: false }) }}>
                    <p>
                        You have unsaved changes for:
                    </p>
                    <ul className="list-disc text-left">
                        {emailUnsavedChanges ? <li>Email</li> : <></>}
                        {passwordUnsavedChanges ? <li>Password</li> : <></>}
                    </ul>
                    <p>Are you sure you want to navigate {typeof (label) === "string" ? `to ${label}?` : "away?"}</p>
                </UnsavedChangesModal>
            ),
            open: true
        });
        return;
    }

    // TODO: make the forms dropdown style
    return (
        <main>
            <AccountHeader onLinkClicked={navigateAwayHandler} />
            <section className="h-full flex flex-col align-middle justify-start">
                <h2 className="text-xl">Account</h2>
                {modal.open && modal.component}
                <AccountDropdown
                    ariaLabel="Dropdown for Change Email Form"
                    forLabel={`Change Email ${emailUnsavedChanges ? "*" : ""}`}
                    className="w-[288px] border-neutral-200 dark:border-neutral-500 border-1 rounded-2xl p-4 flex flex-col gap-4"
                >
                    <ChangeEmailForm
                        onUnsavedChanges={(hasUnsaved: boolean) => {
                            emailUnsavedRef.current = hasUnsaved;
                            setEmailUnsavedChanges(hasUnsaved)
                        }}
                    />
                </AccountDropdown>
                <AccountDropdown
                    ariaLabel="Dropdown for Change Password Form"
                    forLabel={`Change Password ${passwordUnsavedChanges ? "*" : ""}`}
                    className="w-[288px] border-neutral-200 dark:border-neutral-500 border-1 rounded-2xl p-4 flex flex-col gap-4"
                >
                    <ChangePasswordForm
                        onUnsavedChanges={(hasUnsaved: boolean) => {
                            passwordUnsavedRef.current = hasUnsaved;
                            setPasswordUnsavedChanges(hasUnsaved)
                        }}
                    />
                </AccountDropdown>


                <LogoutButton logoutHandler={logoutHandler} className="mt-auto" />

            </section>
        </main>
    )
}

export default AccountView;