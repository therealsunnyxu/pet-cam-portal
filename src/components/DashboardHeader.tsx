import { NavLink } from "react-router";


function DashboardHeader() {
    return (
        <header className="bg-neutral-900 w-screen">
            <nav className="flex flex-col h-full items-end justify-center">
                <ul className="flex gap-4 p-4">
                    <li><NavLink to="/dashboard">Dashboard</NavLink></li>
                    <li><NavLink to="/dashboard/account">Account</NavLink></li>
                </ul>
            </nav>
        </header >
    );
}

export default DashboardHeader;