import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { UserButton } from "@clerk/nextjs";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <>
      <div className="grainy min-h-screen">
        <div className="max-w-7xl mx-auto p-10">
          <div className="flex justify-between items-center md:flex-row flex-col pt-14">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button className="bg-violet-600">
                  <ArrowLeft className="mr-1 w-5 h-5" />
                  Back
                </Button>
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">My notes</h1>
              <UserButton />
            </div>
          </div>
          <Separator className="my-8" />
          <div className="text-center">
            <h2 className="text-xl text-gray-500">You have no notes yet.</h2>
          </div>
        </div>
      </div>
    </>
  );
}
