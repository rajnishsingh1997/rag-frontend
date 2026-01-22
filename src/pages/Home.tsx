import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import userAuthStore from "@/store/auth.store";

const Home = () => {
  const user = userAuthStore((state) => state.user);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-6 py-6 bg-muted/30 border-y border-border/40">
        <div className="w-full max-w-2xl space-y-2 text-center">
          <h1 className="text-3xl font-semibold tracking-tight">
            Welcome{user?.name ? `, ${user.name}` : ""}
          </h1>
          <p className="text-muted-foreground">
            You are signed in and can access the homepage.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
