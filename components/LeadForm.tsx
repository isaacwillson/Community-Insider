"use client";

import { FormEvent, useState } from "react";
import { QuizAnswers } from "@/lib/filters";

const inputClass =
  "w-full rounded-none border border-line-strong bg-white px-4 py-3.5 text-base text-ink placeholder:text-muted/70 transition-colors hover:border-ink/40 focus:border-accent";

/**
 * Lead capture. This form intentionally does not submit anywhere — it logs to
 * the console and flips to a success state so the client can see the flow.
 */
export default function LeadForm({
  answers,
  matchedSlugs,
  heading = "Send me the full match report",
  blurb = "I'll put together your matched communities plus every incentive those builders are running right now, and email it over. No drip campaign, no drive-by calls.",
}: {
  answers?: QuizAnswers;
  matchedSlugs?: string[];
  heading?: string;
  blurb?: string;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const payload = {
      name,
      email,
      phone,
      quizAnswers: answers ?? null,
      matchedCommunitySlugs: matchedSlugs ?? [],
      submittedAt: new Date().toISOString(),
    };

    // ------------------------------------------------------------------
    // TODO: REAL HANDLER GOES HERE.
    // Nothing is sent anywhere in this prototype. To make it live, replace
    // the console.log below with a POST to a route handler
    // (e.g. app/api/leads/route.ts) that forwards to the CRM / email
    // provider, and handle the loading + error states around it:
    //
    //   const res = await fetch("/api/leads", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify(payload),
    //   });
    //   if (!res.ok) { setError(...); return; }
    //
    // Also needed before launch: spam protection, server-side validation,
    // and a consent checkbox if this feeds an SMS or email list.
    // ------------------------------------------------------------------
    console.log("[prototype] Lead form submitted — not sent anywhere:", payload);

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="border border-accent/40 bg-accent-wash p-8 text-center sm:p-12">
        <p className="display text-3xl sm:text-4xl">Got it{name ? `, ${name.split(" ")[0]}` : ""}.</p>
        <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-ink-soft">
          Your match report and this month&apos;s full incentive list are on the
          way to{" "}
          <span className="font-medium text-ink">{email || "your inbox"}</span>.
          I read every one of these myself — expect a reply, not an autoresponder.
        </p>
        <p className="mx-auto mt-6 max-w-md border-t border-accent/25 pt-5 font-mono text-xs leading-relaxed text-muted">
          Prototype: nothing was actually sent. The submitted values were logged
          to the browser console.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-6 text-sm font-medium text-accent underline underline-offset-4 hover:text-accent-deep"
        >
          Show the form again
        </button>
      </div>
    );
  }

  return (
    <div className="border border-ink/15 bg-white p-6 sm:p-10">
      <div className="max-w-xl">
        <p className="eyebrow text-accent">One last thing</p>
        <h2 className="display mt-4 text-3xl leading-tight sm:text-4xl">{heading}</h2>
        <p className="mt-4 text-base leading-relaxed text-ink-soft">{blurb}</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 max-w-xl" noValidate={false}>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="eyebrow mb-2 block text-muted">Name</span>
            <input
              className={inputClass}
              type="text"
              name="name"
              autoComplete="name"
              placeholder="Alex Rivera"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </label>

          <label className="block">
            <span className="eyebrow mb-2 block text-muted">Email</span>
            <input
              className={inputClass}
              type="email"
              name="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label className="block">
            <span className="eyebrow mb-2 block text-muted">Phone</span>
            <input
              className={inputClass}
              type="tel"
              name="phone"
              autoComplete="tel"
              placeholder="(555) 010-0000"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              required
            />
          </label>
        </div>

        <button
          type="submit"
          className="mt-7 w-full rounded-full bg-accent px-8 py-4 text-base font-medium text-white transition-colors hover:bg-accent-deep sm:w-auto"
        >
          Send my match report
        </button>

        <p className="mt-4 text-xs leading-relaxed text-muted">
          Demo form — it doesn&apos;t submit anywhere. Values are logged to the
          console so you can see the shape of the payload.
        </p>
      </form>
    </div>
  );
}
