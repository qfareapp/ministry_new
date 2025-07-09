import React from "react";

const About = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 text-gray-800">
      <h1 className="text-3xl font-bold mb-4 text-red-600">🏛️ About Us – The Ministry of Missed Opportunities</h1>
      <p className="mb-4">
        Welcome to the <strong>Ministry of Missed Opportunities</strong> – a proud fictional department committed to
        cataloguing all the brilliant ideas that were <em>never implemented</em>, <em>almost passed</em>, or <em>buried
        under red tape</em> before they could see daylight.
      </p>
      <p className="mb-4">
        <strong>Our mission?</strong> To pay tribute to policies that could’ve changed lives, transformed cities,
        or at least fixed that pothole outside your house… but didn’t.
      </p>
      <p className="mb-4">
        We specialize in:
        <ul className="list-disc list-inside mt-2 ml-4">
          <li>Development dreams that died in committee.</li>
          <li>Schemes that were announced, forgotten, then rebranded.</li>
          <li>Solutions that made too much sense to ever be approved.</li>
        </ul>
      </p>
      <p className="mb-4">
        Think of us as the <em>official archive of could-have-beens</em> – a digital museum where satire meets
        civic pain and missed deadlines are just part of the legacy.
      </p>
      <p className="mb-4">
        Whether you're a concerned citizen, a frustrated taxpayer, or a curious policymaker looking to see what not to do – we’ve got you covered.
      </p>
      <p className="font-semibold text-center text-red-700 mt-8">
        Because in this country, <em>hope isn't the only thing that gets recycled</em> – good ideas do too.
      </p>
    </div>
  );
};

export default About;
