import { SidebarMenuItem } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { EllipsisVertical, LogOut, Moon, Sun } from "lucide-react";
import ModelFirestore from "@/model/model";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

const model = new ModelFirestore();

export function DropdownFooterSidebar({ theme, setTheme, toggleTheme, user }) {
  const router = useRouter();
  const handleLogout = async () => {
    try {
      await model.logout();
      router.push("/");
      //   router.push("/auth/register");
    } catch (e) {
      console.error("Error logging out:", e);
    }
  };

  return (
    <SidebarMenuItem className="px-3 pb-3">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-auto w-full justify-between rounded-lg border border-slate-200 bg-slate-50 p-3 text-left transition-colors hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800"
          >
            <div className="flex min-w-0 items-center gap-3">
              <Avatar className="size-9 shrink-0 border border-slate-200 dark:border-slate-700">
                <AvatarImage
                  src={user?.photoURL || undefined}
                  alt={user?.displayName || "User Avatar"}
                />
                <AvatarFallback className="bg-slate-950 text-xs font-bold text-white dark:bg-white dark:text-slate-950">
                  {user?.displayName ? user.displayName[0].toUpperCase() : "?"}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 text-left">
                <span className="block truncate text-sm font-semibold leading-tight text-slate-900 dark:text-slate-50">
                  {user?.displayName || "User"}
                </span>
                <p
                  title={user?.email}
                  className="max-w-35 truncate text-xs text-slate-500 dark:text-slate-400"
                >
                  {user?.email || "No email"}
                </p>
              </div>
            </div>

            <EllipsisVertical className="size-4 shrink-0 text-slate-400 transition group-hover:text-slate-700 dark:text-slate-500 dark:group-hover:text-slate-200" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="w-60 rounded-lg border-slate-200 dark:border-slate-800"
          align="start"
          side="top"
        >
          <DropdownMenuLabel>Account Settings</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={toggleTheme}>
            {theme === "light" ? (
              <>
                <Sun className="mr-2 h-4 w-4" /> Dark Mode
              </>
            ) : (
              <>
                <Moon className="mr-2 h-4 w-4" /> Light Mode
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
}
