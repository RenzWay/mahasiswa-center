import {SidebarMenuItem} from "@/components/ui/sidebar";
import {Button} from "@/components/ui/button";
import {EllipsisVertical, LogOut, Moon, Sun} from "lucide-react";
import ModelFirestore from "@/model/model";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {useRouter} from "next/navigation";

const model = new ModelFirestore();

export function DropdownFooterSidebar({theme, setTheme, toggleTheme, user}) {
    const router = useRouter();
    const handleLogout = async () => {
        try {
            await model.logout();
            router.push("/auth/register");
        } catch (e) {
            console.error("Error logging out:", e);
        }
    };

    return (
        <SidebarMenuItem>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="w-full flex items-center justify-between hover:bg-accent rounded-md transition"
                    >
                        <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                                <AvatarImage
                                    src={user?.photoURL || "/default-avatar.png"}
                                    alt={user?.displayName || "User Avatar"}
                                />
                                <AvatarFallback>
                                    {user?.displayName
                                        ? user.displayName[0].toUpperCase()
                                        : "?"}
                                </AvatarFallback>
                            </Avatar>
                            <div className="text-left">
                                <span className="text-sm font-medium leading-tight">
                                    {user?.displayName || "User"}
                                </span>
                                <p title={user?.email} className="text-xs text-muted-foreground truncate max-w-[130px]">
                                    {user?.email}
                                </p>
                            </div>
                        </div>

                        {/* ikon titik tiga di kanan */}
                        <EllipsisVertical className="h-4 w-4 opacity-60 group-hover:opacity-100 transition"/>
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-56" align="start" side="top">
                    <DropdownMenuLabel>Account Settings</DropdownMenuLabel>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem onClick={toggleTheme}>
                        {theme === "light" ? (
                            <>
                                <Sun className="mr-2 h-4 w-4"/> Dark Mode
                            </>
                        ) : (
                            <>
                                <Moon className="mr-2 h-4 w-4"/> Light Mode
                            </>
                        )}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4"/> Logout
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </SidebarMenuItem>
    );
}
