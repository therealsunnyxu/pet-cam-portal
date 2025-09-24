import { useEffect, useRef, type PropsWithChildren, type ReactElement } from "react";

interface UnsavedChangesModalProps {
    onClosed?: (...args: any[]) => any;
    goAheadButton: ReactElement;
}

function UnsavedChangesModal(props: PropsWithChildren<UnsavedChangesModalProps>) {
    const { onClosed, children, goAheadButton } = props;
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
                    <button type="button" onClick={handleGoBack} className="bg-blue-800!">Go back</button>
                    {goAheadButton}
                </div>
            </div>
        </dialog>
    );
}

export default UnsavedChangesModal