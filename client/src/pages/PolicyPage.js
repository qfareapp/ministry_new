import React from "react";

const PolicyPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 text-gray-800 leading-relaxed">
      <h1 className="text-3xl font-bold mb-6">📜 Usage Policy</h1>
      <h2 className="text-xl font-semibold mb-4">Ministry of Missed Opportunities (MoMO)</h2>
      <p className="mb-6 italic text-gray-600">
        Because someone has to document the "what could have been."
      </p>

      <h3 className="text-lg font-bold mb-2">1. Purpose of the Platform</h3>
      <p className="mb-4">
        This site exists to collect, curate, and creatively document ideas, policies, dreams,
        and common sense reforms that were tragically (or comically) missed. It’s a digital
        monument to every "almost", "not now", "too ambitious", and "let’s set up a committee".
      </p>
      <p className="mb-4">You may use this platform to:</p>
      <ul className="list-disc list-inside mb-6">
        <li>Share satirical policies</li>
        <li>Reflect on real systemic gaps</li>
        <li>Vent responsibly about bureaucratic black holes</li>
        <li>Laugh, cry, and maybe — be inspired to act</li>
      </ul>

      <h3 className="text-lg font-bold mb-2">2. What You Can Post</h3>
      <ul className="list-disc list-inside mb-6">
        <li>
          <strong>Imaginative Policy Proposals:</strong> Unrealized plans, forgotten ideas, or what-if
          scenarios that should’ve been implemented. Bonus points for satire.
        </li>
        <li>
          <strong>Civic Commentary:</strong> Constructive takes on policy delays, missed reforms, or
          systemic blind spots — especially if they come with a dash of humour.
        </li>
        <li>
          <strong>Public Contributions:</strong> Your own lived experience of "almost change". Was your
          road promised in 2012? We want to hear about it.
        </li>
      </ul>

      <h3 className="text-lg font-bold mb-2">3. What You Can’t Post</h3>
      <ul className="list-disc list-inside mb-6 text-red-600">
        <li>🚫 Hate speech, personal attacks, communal propaganda, or any form of discrimination. We miss opportunities, not our morals.</li>
        <li>🚫 Misinformation presented as fact — satire is welcome, but state your fiction proudly.</li>
        <li>🚫 Spam, plagiarism, or uncredited content lifted from the Ministry of Copy-Paste (no, we don’t collaborate with them).</li>
      </ul>

      <h3 className="text-lg font-bold mb-2">4. Community Conduct</h3>
      <p className="mb-6">
        This is a judgment-free zone for judgmental citizens. Be witty, not wicked. Disagree
        with grace. And remember — sarcasm is best served with empathy.
      </p>

      <h3 className="text-lg font-bold mb-2">5. Disclaimer</h3>
      <p className="mb-6">
        All content here is for satirical, reflective, and civic awareness purposes. We are
        not an actual ministry (yet), and any resemblance to functioning departments is purely
        coincidental — or prophetic.
      </p>

      <h3 className="text-lg font-bold mb-2">6. Contact & Feedback</h3>
      <p>
        If you have a policy idea, correction, or just want to say, "You forgot to miss this
        opportunity too", drop us a line. We’ll add it to our ever-growing list of things we
        plan to follow up on... someday.
      </p>
    </div>
  );
};

export default PolicyPage;
