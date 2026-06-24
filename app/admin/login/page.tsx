import { AdminLogin } from "@/components/AdminLogin";
import { adminCredentials, recaptchaEnabled } from "@/lib/security";
import { captchaFallbackEnabled, captchaProvider } from "@/lib/captcha";
export const metadata={title:"Admin Login"};
export default function Page(){return <AdminLogin captchaFallback={captchaFallbackEnabled()} captchaProvider={captchaProvider() === "text" ? "text" : "google"} recaptcha={recaptchaEnabled()} temporaryMode={adminCredentials().temporary}/>}
