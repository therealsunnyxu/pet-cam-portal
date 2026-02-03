import { Close, KeyboardArrowLeft } from "@mui/icons-material";
import { NavLink } from "react-router";

function PasswordResetHeader(props: { backTo: string, cancelTo: string, children?: React.ReactNode }) {
    const { backTo, cancelTo, children } = props;
    return (
        <header className="bg-neutral-900 w-screen flex justify-between items-center">
            <NavLink to={backTo} className="mx-4"><KeyboardArrowLeft /></NavLink>
            {children}
            <NavLink to={cancelTo} className="mx-4"><Close /></NavLink>
        </header>
    );
}

export default PasswordResetHeader;