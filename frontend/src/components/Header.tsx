import { Link } from "@heroui/react";
import { ThemeSwitch } from "./ThemeSwitch";


export default function AppBar() {
    return (

        <nav className="w-full shrink-0 border-b border-divider bg-surface px-8 py-3">
            <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="grid w-6 place-items-center">
                        <a
                            href="https://www.example.com"
                            rel="noreferrer"
                            target="_blank"
                        >
                            <img alt="Logo" src="logo.png" />
                        </a>
                    </div>

                    <div className="leading-tight">
                        <div className="text-sm font-semibold">Map of schools in BW</div>
                        <div className="text-xs text-gray-500">
                            by Corin
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <ThemeSwitch />
                </div>
            </div>
        </nav>
    );
}