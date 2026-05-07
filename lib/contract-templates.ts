export type TemplateKey = "service" | "nda" | "custom";

export const TEMPLATES: Record<Exclude<TemplateKey, "custom">, { title: string; body: (vars: Vars) => string }> = {
  service: {
    title: "Service Agreement",
    body: (v) => `SERVICE AGREEMENT

This Service Agreement ("Agreement") is entered into on ${v.date} between ${v.companyName} ("Provider") and ${v.clientName} ("Client").

1. SERVICES. Provider agrees to perform the services described in the attached scope of work.

2. FEES. Client agrees to pay Provider the fees set out in the invoice(s) issued under this Agreement.

3. TERM. This Agreement begins on the date above and continues until terminated by either party with 14 days' written notice.

4. CONFIDENTIALITY. Each party will keep the other's non-public information confidential.

5. INDEPENDENT CONTRACTOR. Provider is an independent contractor, not an employee of Client.

6. LIMITATION OF LIABILITY. Neither party will be liable for indirect or consequential damages.

7. GOVERNING LAW. This Agreement is governed by the laws of the Provider's primary place of business.

By signing below, both parties agree to the terms above.

Provider: ${v.companyName}
Client:   ${v.clientName}
`,
  },
  nda: {
    title: "Mutual Non-Disclosure Agreement",
    body: (v) => `MUTUAL NON-DISCLOSURE AGREEMENT

This NDA is entered into on ${v.date} between ${v.companyName} and ${v.clientName} (each a "Party").

1. CONFIDENTIAL INFORMATION. "Confidential Information" means any non-public information disclosed by one Party to the other, whether oral or written, that is marked or reasonably understood to be confidential.

2. OBLIGATIONS. Each Party agrees (a) to use Confidential Information only to evaluate or perform under a possible business relationship, and (b) to protect it with at least the same care it uses for its own confidential information.

3. EXCLUSIONS. Confidential Information does not include information that is publicly known, independently developed, or rightfully obtained from a third party.

4. TERM. The obligations in this NDA last for two (2) years from the date above.

5. NO LICENSE. Nothing in this NDA grants either Party any rights in the other Party's intellectual property.

By signing below, both Parties agree to the terms above.

${v.companyName}
${v.clientName}
`,
  },
};

export type Vars = { companyName: string; clientName: string; date: string };
