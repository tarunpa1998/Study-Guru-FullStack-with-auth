import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import CookiePolicy from './pages/CookiePolicy';

createRoot(document.getElementById("root")!).render(<App />);

