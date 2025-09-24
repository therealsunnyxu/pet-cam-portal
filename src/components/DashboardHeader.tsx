import { NavLink } from "react-router";
import { SiteLinks } from "./views/SiteLinks";

function DashboardHeader(props: {
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
                                <NavLink to={path} onClick={() => handleLinkClick(path, label)} className="select-none">
                                    {label}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </header >
    );
}

export default DashboardHeader;