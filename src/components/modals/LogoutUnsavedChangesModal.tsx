import { type PropsWithChildren, useEffect, useRef } from "react";
import LogoutButton from "../buttons/LogoutButton";

interface LogoutUnsavedChangesModalProps {
    onClosed?: (...args: any[]) => any
}

function LogoutUnsavedChangesModal(props: PropsWithChildren<LogoutUnsavedChangesModalProps>) {
    const { onClosed, children } = props;
    const dialogRef = useRef<HTMLDialogElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        dialogRef.current?.showModal();
    }, [dialogRef]);

    function triggerOnClosed() {
        if (typeof onClosed !== "function") {
            return;
        }
        onClosed();
    }
    function handleGoBack() {
        dialogRef.current?.close();
        triggerOnClosed();
    };

    // Close dialog when clicking outside the card
    function handleDialogClick(e: React.MouseEvent<HTMLDialogElement, MouseEvent>) {
        if (e.target === dialogRef.current) {
            dialogRef.current?.close();
            triggerOnClosed();
        }
    };

    return (
        <dialog
            ref={dialogRef}
            className=""
            onClick={handleDialogClick}
        >
            <div
                ref={cardRef}
                className="card bg-neutral-800 rounded-2xl flex flex-col gap-4 items-center"
            >
                {children}
                <div className="flex gap-4">
                    <button type="button" onClick={handleGoBack}>Go back</button>
                    <LogoutButton />
                </div>
            </div>
        </dialog>
    );
}

export default LogoutUnsavedChangesModal