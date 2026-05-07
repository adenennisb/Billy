export const metadata = { title: "Terms of Service — Billy" };

export default function TermsPage() {
  return (
    <article className="space-y-4 text-sm leading-6">
      <h1 className="text-2xl font-semibold">Billy — Terms of Service</h1>
      <p className="text-gray-500">Last updated: {new Date().toISOString().slice(0, 10)}</p>

      <p>
        These Terms of Service ("Terms") govern your access to and use of the Billy invoicing,
        subscription, and contract software (the "Service"). By creating an account or using
        the Service you agree to these Terms. If you do not agree, do not use the Service.
      </p>

      <h2 className="text-lg font-semibold mt-6">1. The Service</h2>
      <p>
        Billy provides software that lets you (a) create and send invoices, (b) operate
        recurring subscription billing, and (c) generate basic contract documents and collect
        electronic signatures from your customers. Billy is not a payment processor, law firm,
        or accountant.
      </p>

      <h2 className="text-lg font-semibold mt-6">2. Payments and platform fee</h2>
      <p>
        Payment processing is provided by Stripe, Inc. through Stripe Connect. To accept
        payments you must onboard a Stripe account through Billy and accept the{" "}
        <a href="https://stripe.com/legal/connect-account" target="_blank" rel="noreferrer" className="underline">
          Stripe Connected Account Agreement
        </a>{" "}
        and the{" "}
        <a href="https://stripe.com/legal" target="_blank" rel="noreferrer" className="underline">
          Stripe Services Agreement
        </a>. You are the merchant of record for all transactions you process through Billy.
      </p>
      <p>
        For each successful invoice or subscription charge processed through Billy, Billy
        collects a flat platform fee of <strong>USD $5.00</strong> (the "Platform Fee") via
        Stripe's <code>application_fee</code> mechanism. The Platform Fee is in addition to
        Stripe's processing fees, which are charged separately by Stripe and deducted from
        your payout. Billy may change the Platform Fee on 30 days' notice.
      </p>

      <h2 className="text-lg font-semibold mt-6">3. Your account and content</h2>
      <p>
        You are responsible for the accuracy of information you submit (including company
        details, invoice line items, and contract content), for keeping your account
        credentials secure, and for the lawfulness of how you use the Service. You retain
        ownership of all content you upload (logos, contract text, customer data); you grant
        Billy a non-exclusive license to host, process, and display that content solely to
        operate the Service for you.
      </p>

      <h2 className="text-lg font-semibold mt-6">4. Acceptable use</h2>
      <p>You will not use the Service to: (a) violate any law or third-party rights; (b)
        send spam or unsolicited messages; (c) engage in fraud, money laundering, or
        prohibited businesses listed in Stripe's restricted businesses list; (d) interfere
        with or attempt to compromise the Service's security or infrastructure; or (e)
        resell, white-label, or sublicense the Service without our written permission.</p>

      <h2 className="text-lg font-semibold mt-6">5. Contract templates — not legal advice</h2>
      <p>
        Billy provides starter contract templates (Service Agreement, Mutual NDA, etc.) and
        an electronic signing tool as a convenience. <strong>Billy is not a law firm and the
        templates are not legal advice.</strong> You are solely responsible for whether a
        template is appropriate for your situation and jurisdiction; we recommend you have a
        qualified attorney review any agreement before relying on it for high-value or
        regulated transactions.
      </p>

      <h2 className="text-lg font-semibold mt-6">6. Electronic signatures</h2>
      <p>
        Electronic signatures collected through Billy are intended to comply with the U.S.
        ESIGN Act and Uniform Electronic Transactions Act ("UETA"). Use of the e-signing
        feature is also subject to our{" "}
        <a href="/legal/esign" className="underline">E-Sign Disclosure</a>. Some jurisdictions
        and document types (e.g., wills, certain real-estate filings) do not permit
        electronic signatures; you are responsible for confirming that e-signatures are valid
        for your use case.
      </p>

      <h2 className="text-lg font-semibold mt-6">7. Disclaimers</h2>
      <p>
        THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTY OF ANY KIND,
        EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
        PURPOSE, NON-INFRINGEMENT, AND ACCURACY. BILLY DOES NOT WARRANT THAT THE SERVICE WILL
        BE UNINTERRUPTED, ERROR-FREE, OR SECURE.
      </p>

      <h2 className="text-lg font-semibold mt-6">8. Limitation of liability</h2>
      <p>
        TO THE MAXIMUM EXTENT PERMITTED BY LAW, BILLY'S AGGREGATE LIABILITY FOR ANY CLAIMS
        ARISING OUT OF OR RELATING TO THE SERVICE WILL NOT EXCEED THE GREATER OF (A) THE
        TOTAL PLATFORM FEES YOU PAID TO BILLY IN THE 12 MONTHS PRECEDING THE EVENT GIVING
        RISE TO THE CLAIM, OR (B) USD $100. IN NO EVENT WILL BILLY BE LIABLE FOR INDIRECT,
        INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES, OR FOR LOSS OF PROFITS, REVENUE, DATA,
        OR GOODWILL.
      </p>

      <h2 className="text-lg font-semibold mt-6">9. Indemnification</h2>
      <p>
        You will indemnify and hold harmless Billy and its officers, employees, and agents
        from any third-party claim arising out of (a) content you submit through the Service,
        (b) your use of the Service in violation of these Terms or applicable law, or (c)
        any contract you create or sign through the Service.
      </p>

      <h2 className="text-lg font-semibold mt-6">10. Termination</h2>
      <p>
        You may stop using the Service at any time. Billy may suspend or terminate your
        access if you breach these Terms, if required to comply with law, or if your account
        is associated with fraud or chargebacks. Sections 5–10 survive termination.
      </p>

      <h2 className="text-lg font-semibold mt-6">11. Changes</h2>
      <p>
        Billy may update these Terms by posting a new version. Material changes will be
        announced in the app or by email. Continued use after the effective date constitutes
        acceptance.
      </p>

      <h2 className="text-lg font-semibold mt-6">12. Governing law</h2>
      <p>
        These Terms are governed by the laws of the jurisdiction in which Billy is
        established, without regard to conflict-of-laws principles. The parties consent to
        the exclusive jurisdiction of the courts located there.
      </p>

      <p className="text-xs text-gray-500 border-t pt-4 mt-8">
        These terms are a starter template provided as-is and do not constitute legal advice.
        Have an attorney review and adapt them before using the Service in production.
      </p>
    </article>
  );
}
