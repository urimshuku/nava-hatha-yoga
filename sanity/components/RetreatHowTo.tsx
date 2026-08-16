"use client";

const STEPS = [
        "Open Retreats → Retreat template (not Retreats page). That document is a ready-made example — do not turn Published on for the template itself.",
  "Use Duplicate (the document menu) to make a new retreat from the template.",
  "Change Title, then click Generate on Slug.",
  "Set Date (start) and End date (last day). Multi-day retreats stay listed until the end date.",
  "Adjust location, price, descriptions, images, registration link, and SEO as needed.",
  "Turn Published on for the new retreat only.",
  "Click Publish (the Sanity publish button). This is a second step from the Published toggle.",
];

export function RetreatHowTo() {
  return (
    <div
      style={{
        maxWidth: "40rem",
        margin: "0 auto",
        padding: "2rem 1.5rem 3rem",
        lineHeight: 1.55,
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: "0.75rem",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          opacity: 0.7,
        }}
      >
        For the website editor
      </p>
      <h2 style={{ margin: "0.5rem 0 1rem", fontSize: "1.5rem" }}>
        How to add a retreat
      </h2>
      <p style={{ margin: "0 0 1.25rem" }}>
        You only need this Studio. After you publish, the retreat appears on{" "}
        <code>/retreats</code> within about a minute. When the end date passes,
        it leaves that page and shows on <code>/retreats/archive</code>. If
        nothing is upcoming, the site shows Coming Soon again.
      </p>
      <ol style={{ margin: 0, paddingLeft: "1.25rem" }}>
        {STEPS.map((step) => (
          <li key={step} style={{ marginBottom: "0.75rem" }}>
            {step}
          </li>
        ))}
      </ol>
      <p style={{ margin: "1.25rem 0 0" }}>
        To hide a retreat early: turn <strong>Published</strong> off and click{" "}
        <strong>Publish</strong> again.
      </p>
    </div>
  );
}
