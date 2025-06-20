import LoginPage from "../loginPage";

export const metadata = {
  title: "Student Login",
};

export default function StudentLoginPage() {
  return <LoginPage role="student" imagePath="/StudentLogin.png" />;
}
