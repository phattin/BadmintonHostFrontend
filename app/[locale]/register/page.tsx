import RegisterPanel from "./RegisterPanel";
import AuthCard from "../../components/AuthCard";

export default function Register() {
  return (
    <main className="relative isolate flex min-h-screen items-center justify-center overflow-hidden">
      <div
        className="absolute -inset-8 -z-20 scale-110 bg-cover bg-center blur-md"
        style={{
          backgroundImage: "url('/anhnencl.jpg')",
        }}
      />

      <div className="absolute inset-0 -z-10 bg-[#021c0d]/75" />

      <div className="relative z-10">
        <div className="flex bg-white overflow-hidden rounded-2xl items-stretch">
          <AuthCard />
          <RegisterPanel />
        </div>
      </div>
    </main>
  );
}
