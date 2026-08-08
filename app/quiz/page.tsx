import type { Metadata } from "next";
import QuizFlow from "@/components/QuizFlow";

export const metadata: Metadata = {
  title: "Builder Match Quiz",
  description:
    "Four questions — county, budget, home type, timeline — and you'll see the New Jersey new-construction communities that actually fit. No email required to see results.",
};

export default function QuizPage() {
  return <QuizFlow />;
}
