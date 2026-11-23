export type ServiceContent = {
  slug: string;
  name: string;
  intro: string;
  helpWith: string[]; 
  services: { name: string; description: string }[]; 
  official: { label: string; url: string | null };
  prepare: { verified: boolean; items: string[] };
  governmentFee: string;
};

export const sharedContent = {
  usefulWhen: [
    "Your schedule is busy and you can't spend time on the process",
    "You're unsure about the requirements",
    "Previous attempts ran into repeated errors",
    "You'd like your documents checked before submitting",
    "You want one dedicated person following your case",
  ],
  includes: [
    "Initial review of your case",
    "A document checklist for your situation",
    "Step-by-step guidance",
    "Application assistance, where we are authorized",
    "Follow-up on your request",
    "Progress updates",
    "Direct WhatsApp access to our team",
  ],
  notIncluded: [
    "Guaranteed official approval",
    "Bypassing any requirement",
    "Unofficial shortcuts",
    "Preferential treatment",
  ],
};

export const serviceContent: ServiceContent[] = [
  {
    slug: "identification-documents",
    name: "Identification",
    intro:
      "Help with your national ID and identity certificates: first applications, replacements, corrections and name changes, from checking what's required to following up until it's done.",
    helpWith: [
      "Application for National ID",
      "National ID Replacement",
      "Change of Name",
      "Application for National ID Correction",
      "Certificate of Full Identity",
      "Certificate of Being Alive",
      "Certificate for Replacement of National Identity Card",
    ],
    services: [
      {
        name: "Application for National ID",
        description:
          "Applying for your first national ID and following it up until it's ready.",
      },
      {
        name: "National ID Replacement",
        description:
          "Replacing a national ID that was lost, stolen or damaged.",
      },
      {
        name: "Change of Name",
        description:
          "Applying to change your name and getting your records updated.",
      },
      {
        name: "Application for National ID Correction",
        description:
          "Correcting wrong details on your ID, such as your name, date or place of birth.",
      },
      {
        name: "Certificate of Full Identity",
        description: "A certificate that confirms your full identity details.",
      },
      {
        name: "Certificate of Being Alive",
        description:
          "Proof of life, often asked for by pension funds, banks and insurers.",
      },
      {
        name: "Certificate for Replacement of National Identity Card",
        description:
          "The certificate you use while your national ID is being replaced.",
      },
    ],
    official: { label: "Official service", url: null }, // TODO: verified official link
    prepare: { verified: false, items: [] }, // TODO: verified list
    governmentFee: "Set by the institution",
  },
  {
    slug: "family",
    name: "Family Documents",
    intro:
      "Help with civil status records for the key moments in a family's life: births, marriages, divorces and deaths, plus the certificates institutions ask for.",
    helpWith: [
      "Divorce Services",
      "Certificate of Being Single",
      "Certificate for Widow/Widower",
      "Birth Services",
      "Marriage Services",
      "Death Services",
      "Record of Recognition",
    ],
    services: [
      {
        name: "Divorce Services",
        description:
          "Divorce records, certified copies and updating your civil status.",
      },
      {
        name: "Certificate of Being Single",
        description:
          "Confirms you are not married, often needed to marry abroad or for visas.",
      },
      {
        name: "Certificate for Widow/Widower",
        description:
          "Confirms your status as a widow or widower, e.g. for pension or inheritance files.",
      },
      {
        name: "Birth Services",
        description:
          "Birth registration, birth certificates, certified copies and corrections.",
      },
      {
        name: "Marriage Services",
        description: "Marriage certificates, certified copies and corrections.",
      },
      {
        name: "Death Services",
        description:
          "Registering a death and getting death certificates for family and legal matters.",
      },
      {
        name: "Record of Recognition",
        description:
          "The official recognition of a child and copies of the record.",
      },
    ],
    official: { label: "Official service", url: null }, // TODO
    prepare: { verified: false, items: [] }, // TODO
    governmentFee: "Set by the institution",
  },
  {
    slug: "criminal-record-and-investigation",
    name: "Criminal Record and Investigation",
    intro:
      "Help getting the certificates you need for work, studies, visas and immigration, or after losing documents.",
    helpWith: [
      "Criminal Record Certificate",
      "Lost and Theft Certificate",
      "Fingerprint Certificate",
    ],
    services: [
      {
        name: "Criminal Record Certificate",
        description:
          "Proof of your criminal record status for work, studies, visas or immigration.",
      },
      {
        name: "Lost and Theft Certificate",
        description:
          "Declares lost or stolen documents or items, often needed to replace them.",
      },
      {
        name: "Fingerprint Certificate",
        description:
          "Fingerprint records for immigration files and background checks.",
      },
    ],
    official: { label: "Official service", url: null }, // TODO
    prepare: { verified: false, items: [] }, // TODO
    governmentFee: "Set by the institution",
  },
  {
    slug: "immigration-and-emigration",
    name: "Immigration and Emigration",
    intro:
      "Help with Rwandan passports, travel documents and nationality applications, from the requirements to following up on the decision.",
    helpWith: [
      "e-Passport Application",
      "Laissez-passer",
      "Rwandan Nationality by Origin",
      "Rwandan Nationality by Acquisition",
    ],
    services: [
      {
        name: "e-Passport Application",
        description: "New Rwandan e-passports, renewals and replacements.",
      },
      {
        name: "Laissez-passer",
        description: "Applying for a laissez-passer travel document.",
      },
      {
        name: "Rwandan Nationality by Origin",
        description:
          "Applying for recognition of Rwandan nationality by origin.",
      },
      {
        name: "Rwandan Nationality by Acquisition",
        description: "Applying to acquire Rwandan nationality.",
      },
    ],
    official: { label: "Official service", url: null }, // TODO
    prepare: { verified: false, items: [] }, // TODO
    governmentFee: "Set by the institution",
  },
  {
    slug: "foreign-affairs-consular-services",
    name: "Foreign Affairs Consular Services",
    intro:
      "Help legalizing documents so they are accepted where you need them: Rwandan documents used abroad, and foreign documents used in Rwanda.",
    helpWith: [
      "Legalization of public documents from Rwanda to be used abroad/Apostille",
      "Legalization of documents from abroad to be used in Rwanda",
    ],
    services: [
      {
        name: "Legalization of public documents from Rwanda to be used abroad/Apostille",
        description:
          "Diplomas, civil status records and other Rwandan public documents, made valid for use in another country.",
      },
      {
        name: "Legalization of documents from abroad to be used in Rwanda",
        description:
          "Documents issued in another country, made valid for use in Rwanda.",
      },
    ],
    official: { label: "Official service", url: null }, // TODO
    prepare: { verified: false, items: [] }, // TODO
    governmentFee: "Set by the institution",
  },
  {
    slug: "notarisation-and-gazette",
    name: "Notarisation and Gazette Service",
    intro:
      "Help with notarised documents and with publishing official notices in the Official Gazette.",
    helpWith: ["Various Notary Services", "Publish in the Official Gazette"],
    services: [
      {
        name: "Various Notary Services",
        description:
          "Certified copies, declarations, powers of attorney and other notarised documents.",
      },
      {
        name: "Publish in the Official Gazette",
        description:
          "Publishing notices such as a change of name, and getting the published copy.",
      },
    ],
    official: { label: "Official service", url: null }, // TODO
    prepare: { verified: false, items: [] }, // TODO
    governmentFee: "Set by the institution",
  },
];

export const getServiceContent = (slug: string) =>
  serviceContent.find((s) => s.slug === slug);
