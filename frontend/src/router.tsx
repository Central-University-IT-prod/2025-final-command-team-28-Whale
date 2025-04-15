import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import MentorsPage from "@/pages/MentorsPage/MentorsPage";
import Header from "@/components/Header";
import MentorPage from "@/pages/MentorPage/MentorPage";
import AdminPage from "@/pages/AdminPage/AdminPage";
import StudentPage from "@/pages/StudentPage/StudentPage";
import MentorDashboard from "./pages/MentorDashboard/MentorDashboard";
import AuthenticationPage from "./pages/AuthenticationPage/AuthenticationPage";
import StudentDashboardPage from "./pages/StudentDashboardPage/StudentDashboardPage";
import { Toaster } from 'sonner';

const rootRoute = createRootRoute({
  component: () => (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-6">
        <Outlet />
        <Toaster />
      </main>
    </div>
  ),
});

const mentorsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: MentorsPage,
});

const mentorDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/mentors/dashboard/$mentorId",
  component: MentorDashboard,
});


const studentDasboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/students/dashboard/$studentId",
  component: StudentDashboardPage,
});

const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/auth",
  component: AuthenticationPage,
});

const mentorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/mentors/$mentorId",
  component: MentorPage,
});

const studentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/students/$studentId",
  component: StudentPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPage,
});

const routeTree = rootRoute.addChildren([
  authRoute,
  mentorsRoute,
  mentorRoute,
  adminRoute,
  studentRoute,
  mentorDashboardRoute,
  studentDasboardRoute
]);

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
});

export function RouterConfig() {
  return <RouterProvider router={router} />;
}

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
