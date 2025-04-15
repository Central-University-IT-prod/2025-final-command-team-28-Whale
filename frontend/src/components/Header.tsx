import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ModeToggle } from "@/components/mode-toggle";
import { Separator } from "@/components/ui/separator";
import { User } from "lucide-react";
import { useCookies } from "react-cookie";
import { useEffect } from "react";
import { useQuery, gql } from "@apollo/client";
import { Student } from "@/pages/StudentPage/types";
import { MentorProfileType } from "@/pages/MentorPage/types";
import WhaleIcon from "../assets/whale.svg";

const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    getCurrentUser {
      ... on StudentType {
        id
        username
      }
      ... on MentorType {
        id
        username
        expertise
      }
    }
  }
`;

type NavItem = {
  title: string;
  href: string;
  description?: string;
};

const navItems: NavItem[] = [
  {
    title: "Менторы",
    href: "/",
    description: "Наши опытные менторы",
  },
  // {
  //   title: "Панель управления",
  //   href: "/mentors/dashboard/1",
  //   description: "Наши опытные менторы",
  // },
];

const Header = () => {
  const [cookies, , removeCookie] = useCookies(["PROD_SESSION"]);
  const [open, setOpen] = useState(false);

  const [user, setUser] = useState<Student | MentorProfileType>();
  const [role, setRole] = useState<"student" | "mentor" | undefined>();

  const { refetch } = useQuery(GET_CURRENT_USER);

  useEffect(() => {
    refetch().then((data) => {
      if (data.data.getCurrentUser) {
        if (data.data.getCurrentUser.expertise) {
          setRole("mentor");
        } else {
          setRole("student");
        }
        setUser(data.data.getCurrentUser);
      } else {
        setUser(undefined);
      }
    });
  }, [cookies.PROD_SESSION]);

  const navigate = useNavigate();

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="mr-4 hidden md:flex">
            <Link to="/" className="mr-10 flex items-center space-x-2">
              {/* <span className="font-bold text-xl">Whale</span> */}
              <img src={WhaleIcon} alt="" className="h-10" />
            </Link>
            <nav className="flex items-center space-x-6 text-md font-medium">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="transition-colors hover:text-foreground/80 text-foreground/60"
                >
                  {item.title}
                </Link>
              ))}
            </nav>
          </div>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="mr-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Открыть меню</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <SheetTitle>
                <Link
                  to="/"
                  className="flex items-center"
                  onClick={() => setOpen(false)}
                >
                  <span className="font-bold text-xl px-6 pt-6">Whale</span>
                </Link>
              </SheetTitle>
              <div className="">
                <Separator className="my-4" />
                <nav className="grid gap-2 text-lg font-medium px-6">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      className="flex py-2 text-foreground/70 hover:text-foreground transition-colors"
                      onClick={() => setOpen(false)}
                    >
                      {item.title}
                    </Link>
                  ))}
                </nav>
              </div>

              <SheetFooter className="mt-auto pt-4">
                <Link
                  to="/auth"
                  className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
                  onClick={() => setOpen(false)}
                >
                  Войти
                </Link>
              </SheetFooter>
            </SheetContent>
          </Sheet>

          <div className="flex items-center justify-between space-x-2 md:justify-end">
            {/* <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Bell />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[100vw] md:w-auto">
                <div className="flex flex-wrap gap-3 rounded-xl z-40 py-5">
                  <div className="w-full px-5 flex items-center justify-between">
                    <span>Уведомления</span>
                  </div>
                  <ScrollArea className="w-full h-[200px] flex flex-wrap gap-3 px-5">
                    <Alert className="mb-3">
                      <AlertTitle>Heads up!</AlertTitle>
                      <AlertDescription>
                        You can add components to your app using the cli.
                      </AlertDescription>
                    </Alert>
                    <Alert className="mb-3">
                      <AlertTitle>Heads up!</AlertTitle>
                      <AlertDescription>
                        You can add components to your app using the cli.
                      </AlertDescription>
                    </Alert>
                    <Alert className="mb-3">
                      <AlertTitle>Heads up!</AlertTitle>
                      <AlertDescription>
                        You can add components to your app using the cli.
                      </AlertDescription>
                    </Alert>
                    <Alert className="mb-3">
                      <AlertTitle>Heads up!</AlertTitle>
                      <AlertDescription>
                        You can add components to your app using the cli.
                      </AlertDescription>
                    </Alert>
                  </ScrollArea>
                </div>
              </DropdownMenuContent>
            </DropdownMenu> */}
            <ModeToggle />
            <div className="w-full flex-1 md:w-auto md:flex-none">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild className="w-full">
                    <Button
                      variant="outline"
                      size="icon"
                      className="w-full px-4 flex items-center gap-3"
                    >
                      <span>{user.username}</span>
                      <User className="h-[1.2rem] w-[1.2rem]" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-[100vw] md:w-auto"
                  >
                    <DropdownMenuItem
                      onClick={() =>
                        navigate({
                          to: `/${role}s/dashboard/$${role}Id`,
                          params: {
                            [`${role}Id`]: user.id,
                          },
                        })
                      }
                    >
                      Дашборд
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        navigate({
                          to: `/${role}s/$${role}Id`,
                          params: {
                            [`${role}Id`]: user.id,
                          },
                        })
                      }
                    >
                      Профиль
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        removeCookie("PROD_SESSION", {
                          path: "/",
                        });
                        location.href = "/auth";
                      }}
                      className="text-rose-600"
                    >
                      Выйти
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  to="/auth"
                  className="hidden md:inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
                >
                  Войти
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
