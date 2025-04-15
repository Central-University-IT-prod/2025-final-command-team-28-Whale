import { createRoot } from "react-dom/client";
import "@/styles/globals.css";
import Wrapper from './Wrapper.tsx';


createRoot(document.getElementById("root")!).render(
  <Wrapper />
);
