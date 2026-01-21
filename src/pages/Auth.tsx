import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Login } from "@/pages/Login";
import Signup from "@/pages/Signup";

const Auth = () => {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const isLogin = mode === "login";

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-3">
        {isLogin ? <Login /> : <Signup />}
        <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
          <span>
            {isLogin ? "New user?" : "Already have an account?"}
          </span>
          <Button
            type="button"
            variant="link"
            className="h-auto p-0 text-sm"
            onClick={() => setMode(isLogin ? "signup" : "login")}
          >
            {isLogin ? "Create an account" : "Login"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
