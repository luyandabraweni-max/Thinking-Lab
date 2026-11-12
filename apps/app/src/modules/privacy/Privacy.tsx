// The privacy notice families read before adding a child (POPIA sections 18 and 72). Plain language, short sections.
// DRAFT: to be reviewed by the foundation (and ideally a POPIA adviser) before real families use the app.

export const PRIVACY_CONTACT = "milisa@pholoso.africa";
export const PRIVACY_VERSION = "2026-11-12";

export function PrivacyNotice() {
  return (
    <div className="tl-stack privacy">
      <p><b>Thinking Lab is run by the Pholoso Afrika Foundation (2to.iQ).</b> This is how we look after your information and your child's.</p>

      <h3>What we keep</h3>
      <ul className="plain">
        <li><b>About you:</b> your name, email address, and your work if you're a teacher or therapist.</li>
        <li><b>About your child:</b> a nickname (not their real name), their age group and level, the activities they do and how they went, goals and notes from the team you choose, and their settings and character.</li>
        <li><b>Health and medicines,</b> only if you add them. These are kept separately and are shared only when you switch health sharing on.</li>
        <li><b>We don't keep</b> your child's real name, photo, birthday, school or address, and we never record their voice.</li>
      </ul>

      <h3>Why</h3>
      <p>To give your child activities that suit them, and to let you and the people you choose see how they are doing and work together. We never sell information or use it for advertising.</p>

      <h3>Who can see it</h3>
      <ul className="plain">
        <li>You, and any other parent or guardian of your child on Thinking Lab.</li>
        <li>Teachers and therapists, <b>only if you share your child with them</b>. You can stop sharing at any time.</li>
        <li>School admins see totals only, never a child's name, progress or notes.</li>
        <li>If your child says they feel unsafe, the designated safeguarding lead is told, so they can help.</li>
      </ul>

      <h3>Where it is stored</h3>
      <p>On secure servers run by Supabase in <b>Paris, France</b>, where European data-protection law (GDPR) gives it protection at least as strong as South Africa's POPIA. The app is delivered by Netlify, and sign-in emails are sent by Brevo. If you turn on answering by speaking, your browser or phone may send the sound to Google or Apple to turn it into words; we never keep it.</p>

      <h3>How long</h3>
      <p>Until you delete your child's profile or ask us to. You can delete it yourself from your child's <b>Sharing</b> tab.</p>

      <h3>Your rights</h3>
      <p>You can see, correct or delete your information and your child's, withdraw your consent, and object to how it is used. Email <a href={`mailto:${PRIVACY_CONTACT}`}>{PRIVACY_CONTACT}</a>. If you're not happy with our answer, you can complain to South Africa's Information Regulator (inforegulator.org.za).</p>

      <p className="note">Version {PRIVACY_VERSION}.</p>
    </div>
  );
}
