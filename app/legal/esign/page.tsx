export const metadata = { title: "E-Sign Disclosure — Billy" };

export default function EsignPage() {
  return (
    <article className="space-y-4 text-sm leading-6">
      <h1 className="text-2xl font-semibold">Electronic Signature Disclosure & Consent</h1>
      <p className="text-gray-500">Last updated: {new Date().toISOString().slice(0, 10)}</p>

      <p>
        This disclosure is provided to comply with the U.S. Electronic Signatures in Global
        and National Commerce Act ("ESIGN Act"), the Uniform Electronic Transactions Act
        ("UETA"), and similar laws. It applies whenever you use Billy to sign or to send a
        document for electronic signature.
      </p>

      <h2 className="text-lg font-semibold mt-6">1. Consent to use electronic records and signatures</h2>
      <p>
        By clicking "Sign" or otherwise submitting a signature through Billy, you agree (a)
        to receive and review the document electronically, (b) that your typed name and/or
        drawn mark constitutes your legal signature with the same effect as a handwritten
        signature, and (c) that the signed record may be retained electronically.
      </p>

      <h2 className="text-lg font-semibold mt-6">2. Hardware and software requirements</h2>
      <p>
        To access and retain electronic records you need: (a) a current web browser with
        JavaScript and cookies enabled; (b) an internet connection; (c) a device able to
        display PDF or HTML documents; (d) the ability to save or print documents; and (e)
        an active email address.
      </p>

      <h2 className="text-lg font-semibold mt-6">3. Withdrawing consent</h2>
      <p>
        You may withdraw consent to do business electronically at any time by notifying the
        sender. Withdrawal does not affect the legal validity of records already signed.
        Withdrawing consent may mean you can no longer sign documents through Billy with
        that party.
      </p>

      <h2 className="text-lg font-semibold mt-6">4. Updating contact information</h2>
      <p>
        Keep your email address current with the sender. Billy is not responsible for
        documents sent to outdated addresses.
      </p>

      <h2 className="text-lg font-semibold mt-6">5. Record retention and copies</h2>
      <p>
        After signing, the signed document plus an audit trail (signer name, IP address,
        browser user agent, timestamp) are stored in Billy and made available to the sender.
        You should download or print a copy for your own records.
      </p>

      <h2 className="text-lg font-semibold mt-6">6. Limitations</h2>
      <p>
        Some documents (e.g., wills, trusts, certain real-estate filings, court orders) may
        not be signed electronically under applicable law. You are responsible for confirming
        that an electronic signature is valid for your transaction.
      </p>

      <p className="text-xs text-gray-500 border-t pt-4 mt-8">
        This disclosure is a starter template and is not legal advice. Have it reviewed by an
        attorney before relying on Billy's e-signing in regulated workflows.
      </p>
    </article>
  );
}
