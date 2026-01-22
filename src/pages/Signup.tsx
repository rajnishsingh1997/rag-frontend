import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { signupApi } from "@/services/auth.service";
import userAuthStore from "@/store/auth.store";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const formSchema = z.object({
    name: z.string().min(3, "Name must be at least 2 characters"),
    email: z.email(),
    password: z.string().min(6, "Password must be at least 6 characters"),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    mode: "onChange",
  });
  const setUser = userAuthStore((state) => state.setUser);
  const navigate = useNavigate();
  async function onSubmit(data: z.infer<typeof formSchema>) {
    console.log(data);
    try {
      const response = await signupApi(data);
      if (response.status === 201 || response.status === 200) {
        setUser(response.data.user);
        localStorage.setItem("token", response.data.token);
        toast.success("Account created successfully.");
        navigate("/");
        return;
      }
      toast.error("Sign up failed. Please try again.");
    } catch (error) {
      console.error("sign up failed:", error);
      toast.error("Sign up failed. Please try again.");
    }
  }
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your details below to create an account
        </CardDescription>
      </CardHeader>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent>
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="nameInput">Name</FieldLabel>
                  <Input
                    {...field}
                    id="nameInput"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter your name"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="emailInput">Email</FieldLabel>
                  <Input
                    {...field}
                    id="emailInput"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter your email"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel typeof="password" htmlFor="passwordInput">
                    Password
                  </FieldLabel>
                  <Input
                    {...field}
                    id="passwordInput"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter your password"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </CardContent>
        <CardFooter className="flex-col gap-2 mt-4">
          <Button type="submit" className="w-full">
            Sign up
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default Signup;
