import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { CourseMapPage } from "./pages/CourseMapPage";
import { LessonShellPage } from "./pages/LessonShellPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { SetupShellPage } from "./pages/SetupShellPage";

const router = createBrowserRouter([
  {
    element: (
      <AppShell>
        <Outlet />
      </AppShell>
    ),
    children: [
      { path: "/", element: <CourseMapPage /> },
      { path: "/lesson/:lessonId", element: <LessonShellPage /> },
      {
        path: "/register",
        element: (
          <SetupShellPage
            title="Create your zero2codex account"
            eyebrow="Next phase: email auth"
            body="This route is reserved for Supabase email account creation. It will migrate local progress into the learner account once auth is implemented."
          />
        ),
      },
      {
        path: "/login",
        element: (
          <SetupShellPage
            title="Sign in to continue"
            eyebrow="Next phase: email auth"
            body="This route is reserved for email/password sign-in. Google OAuth is intentionally postponed until production setup is ready."
          />
        ),
      },
      { path: "/home", element: <Navigate to="/" replace /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}
