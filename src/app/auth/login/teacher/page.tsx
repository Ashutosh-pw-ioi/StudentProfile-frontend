import LoginPage from "../../../loginPage";

export const metadata = {
  title: "Teacher Login",
};

export default function TeacherLoginPage() {
  return <LoginPage role="teacher" imagePath="/TeacherLogin.png" />;
}
