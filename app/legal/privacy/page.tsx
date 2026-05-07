export const metadata = { title: "Privacy Policy — Billy" };

export default function PrivacyPage() {
  return (
    <article className="space-y-4 text-sm leading-6">
      <h1 className="text-2xl font-semibold">Billy — Privacy Policy</h1>
      <p className="text-gray-500">Last updated: {new Date().toISOString().slice(0, 10)}</p>

      <p>
        This Privacy Policy describes how Billy collects, uses, and shares information when
        you use the Service. By using Billy you agree to this Policy.
      </p>

      <h2 className="text-lg font-semibold mt-6">1. Information we collect</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li><strong>Account info:</strong> company name, email, optional address, optional logo image.</li>
        <li><strong>Customer info you upload:</strong> client names, emails, addresses, invoice line items, contract content.</li>
        <li><strong>Payment info:</strong> we never receive or store credit card numbers. Stripe collects payment information directly from your customer; we receive only metadata (charge ID, status, last4, etc.).</li>
        <li><strong>E-signature metadata:</strong> when a contract is signed we record the typed name, optional drawn signature, IP address, browser user agent, and timestamp to support legal validity.</li>
        <li><strong>Usage data:</strong> standard server logs including IP, request paths, and timestamps for security and debugging.</li>
      </ul>

      <h2 className="text-lg font-semibold mt-6">2. How we use information</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>To operate the Service: render invoices, process subscriptions, generate and store contracts.</li>
        <li>To process payments through Stripe and collect the platform fee.</li>
        <li>To prevent fraud, comply with law, and enforce our Terms.</li>
        <li>To send transactional emails (e.g., contract sign confirmations). We do not sell your data or use it for advertising.</li>
      </ul>

      <h2 className="text-lg font-semibold mt-6">3. Sharing</h2>
      <p>We share information only with:</p>
      <ul className="list-disc pl-5 space-y-1">
        <li><strong>Stripe</strong>, our payment processor — see{" "}
          <a href="https://stripe.com/privacy" target="_blank" rel="noreferrer" className="underline">Stripe's Privacy Policy</a>.</li>
        <li>Hosting and infrastructure providers acting as our service providers.</li>
        <li>Authorities when legally required, or to protect rights, property, or safety.</li>
      </ul>

      <h2 className="text-lg font-semibold mt-6">4. Data retention</h2>
      <p>
        We retain your account and transaction records while your account is active and for
        as long as needed to comply with tax and accounting law. You can request deletion of
        your account at any time; we will delete or anonymize personal data, except where
        retention is legally required.
      </p>

      <h2 className="text-lg font-semibold mt-6">5. Security</h2>
      <p>
        We use TLS in transit and reasonable administrative and technical safeguards. No
        system is perfectly secure; you use the Service at your own risk.
      </p>

      <h2 className="text-lg font-semibold mt-6">6. Your rights</h2>
      <p>
        Depending on your jurisdiction (e.g., GDPR, CCPA), you may have rights to access,
        correct, delete, or port your personal data, and to object to certain processing.
        Contact us at the address below to exercise these rights.
      </p>

      <h2 className="text-lg font-semibold mt-6">7. International transfers</h2>
      <p>
        Billy may process data in countries other than your own. Where required, we use
        standard contractual clauses or other lawful transfer mechanisms.
      </p>

      <h2 className="text-lg font-semibold mt-6">8. Children</h2>
      <p>The Service is not intended for individuals under 16. We do not knowingly collect data from children.</p>

      <h2 className="text-lg font-semibold mt-6">9. Changes</h2>
      <p>We may update this Policy; material changes will be announced in the app or by email.</p>

      <h2 className="text-lg font-semibold mt-6">10. Contact</h2>
      <p>Questions? Email the address shown on the Billy homepage.</p>

      <p className="text-xs text-gray-500 border-t pt-4 mt-8">
        This policy is a starter template and is not legal advice. Have it reviewed before
        using in production.
      </p>
    </article>
  );
}
