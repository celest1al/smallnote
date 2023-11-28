import { Button } from "@/components/ui/button";
import { TypewriterTitle } from "@/components/ui/typewriter-title";
import Link from "next/link";
import Balancer from "react-wrap-balancer";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <main className="bg-gradient-to-r grainy min-h-screen from-rose-100 to-teal-100">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center flex-col">
        <h1 className="font-semibold text-7xl text-center">
          <Balancer>
            AI <span className="text-violet-600 font-bold">note taking</span>{" "}
            assistant
          </Balancer>
        </h1>
        <h2 className="pt-4 font-semibold text-3xl text-center text-slate-700">
          <Balancer>
            <TypewriterTitle />
          </Balancer>
        </h2>
        <Link href="/dashboard" className="pt-8">
          <Button className="bg-violet-600">
            Get started <ArrowRight className="ml-2 w-5 h-5" strokeWidth={3} />
          </Button>
        </Link>
      </div>
    </main>
  );
}
