import { Button } from "@/components/ui/button";
import { Github, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full border-t border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-center gap-2 px-6 py-4 text-muted-foreground">
        <Button variant="ghost" size="icon" asChild>
          <a href="#" aria-label="LinkedIn">
            <Linkedin className="size-4" />
          </a>
        </Button>
        <Button variant="ghost" size="icon" asChild>
          <a href="#" aria-label="GitHub">
            <Github className="size-4" />
          </a>
        </Button>
      </div>
    </footer>
  );
};

export default Footer;
