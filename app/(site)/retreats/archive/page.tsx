import { permanentRedirect } from "next/navigation";

/** Past retreats now live with past events. */
export default function RetreatsArchivePage() {
  permanentRedirect("/events/archive");
}
