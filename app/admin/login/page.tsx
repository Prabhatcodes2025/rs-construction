import { AdminLogin } from "@/components/AdminLogin";
import { adminCredentials, recaptchaEnabled } from "@/lib/security";
export const metadata={title:"Admin Login"};
export default function Page(){return <AdminLogin recaptcha={recaptchaEnabled()} temporaryMode={adminCredentials().temporary}/>}
