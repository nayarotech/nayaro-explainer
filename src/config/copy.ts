/**
 * COPY CONFIG — every on-screen word lives here, in Nepali (ne) and English (en).
 *
 * LANGUAGE MODES (set DEFAULT_LANG, or render a specific composition):
 *   'bilingual' → titles show Nepali large + English below; mockup UI in Nepali
 *   'ne'        → Nepali only
 *   'en'        → English only
 *
 * A plain string (not {ne, en}) is shown as-is in every mode — used for
 * technical terms, code, URLs and course names that stay in English.
 */
export type Lang = "bilingual" | "ne" | "en";
export const DEFAULT_LANG: Lang = "bilingual";

export type L = { ne: string; en: string };
export type Text = L | string;

export const copy = {
  scene2: {
    eyebrow: { ne: "बनाउने · Nayaro Solutions", en: "Build · Nayaro Solutions" },
    headline: {
      ne: "तपाईंको व्यवसाय सुहाउँदो सफ्टवेयर।",
      en: "Software shaped around how your business runs.",
    },
    highlight: { ne: ["सफ्टवेयर"], en: ["shaped"] },
    tags: [
      { ne: "मौज्दात", en: "Inventory" },
      { ne: "बिलिङ", en: "Billing" },
      { ne: "अभिलेख", en: "Records" },
      { ne: "समय व्यवस्थापन", en: "Scheduling" },
    ],
    appName: { ne: "Operations", en: "Operations" },
    overview: { ne: "Overview", en: "Overview" },
    thisWeek: { ne: "This week", en: "This week" },
    live: { ne: "Live", en: "Live" },
    nav: [
      { ne: "Overview", en: "Overview" },
      { ne: "Orders", en: "Orders" },
      { ne: "Inventory", en: "Inventory" },
      { ne: "Billing", en: "Billing" },
      { ne: "Reports", en: "Reports" },
    ],
    kpis: [
      { label: { ne: "Orders today", en: "Orders today" }, value: 128 },
      { label: { ne: "Items in stock", en: "Items in stock" }, value: 2460 },
      { label: { ne: "Invoices sent", en: "Invoices sent" }, value: 86 },
      { label: { ne: "Low-stock alerts", en: "Low-stock alerts" }, value: 4 },
    ],
    chartTitle: { ne: "Weekly sales", en: "Weekly sales" },
    chartUnit: { ne: "Orders", en: "Orders" },
    days: [
      { ne: "Sun", en: "Sun" },
      { ne: "Mon", en: "Mon" },
      { ne: "Tue", en: "Tue" },
      { ne: "Wed", en: "Wed" },
      { ne: "Thu", en: "Thu" },
      { ne: "Fri", en: "Fri" },
      { ne: "Sat", en: "Sat" },
    ],
    tooltip: { ne: "Saturday · 42 orders", en: "Saturday · 42 orders" },
    tableTitle: { ne: "Recent activity", en: "Recent activity" },
    rows: [
      [
        { ne: "Order received", en: "Order received" },
        { ne: "Counter", en: "Counter" },
        { ne: "Paid", en: "Paid" },
      ],
      [
        { ne: "Stock updated", en: "Stock updated" },
        { ne: "Warehouse", en: "Warehouse" },
        { ne: "Synced", en: "Synced" },
      ],
      [
        { ne: "Invoice issued", en: "Invoice issued" },
        { ne: "Billing", en: "Billing" },
        { ne: "Sent", en: "Sent" },
      ],
    ],
    stockTitle: { ne: "Stock levels", en: "Stock levels" },
    stock: [
      { ne: "Raw materials", en: "Raw materials" },
      { ne: "Finished goods", en: "Finished goods" },
      { ne: "Packaging", en: "Packaging" },
    ],
    sampleNote: { ne: "नमुना इन्टरफेस", en: "Sample interface" },
  },
  scene3: {
    eyebrow: { ne: "०२ · AI Automation", en: "02 · AI automation" },
    headline: {
      ne: "दोहोरिने कामलाई स्वचालित बनाऔं।",
      en: "The repetitive work, handled automatically.",
    },
    highlight: { ne: ["स्वचालित"], en: ["automatically"] },
    nodes: {
      request: {
        title: { ne: "New request", en: "New request" },
        sub: { ne: "फारम · इमेल · च्याट", en: "Form · Email · Chat" },
      },
      process: {
        title: { ne: "AI Processing", en: "AI processing" },
        sub: { ne: "हरेक अनुरोध जाँच्छ", en: "Checks every request" },
      },
      notify: {
        title: { ne: "Notify team", en: "Notify team" },
        sub: { ne: "केही सेकेन्डमै जानकारी", en: "Assigned in seconds" },
      },
      report: {
        title: { ne: "Business report", en: "Business report" },
        sub: { ne: "आफैं अपडेट हुन्छ", en: "Updated automatically" },
      },
    },
    steps: [
      { ne: "Read", en: "Read" },
      { ne: "Validate", en: "Validate" },
      { ne: "Sort", en: "Sort" },
    ],
    statusBusy: { ne: "Processing request…", en: "Processing request…" },
    statusReady: { ne: "Ready for the next one", en: "Ready for the next one" },
    statusWaiting: { ne: "Waiting for requests", en: "Waiting for requests" },
    statusNew: { ne: "New", en: "new" },
    statusSent: { ne: "Sent", en: "sent" },
    packets: [
      { ne: "Order #1042", en: "Order #1042" },
      { ne: "Enquiry #318", en: "Enquiry #318" },
      { ne: "Booking #77", en: "Booking #77" },
    ],
    alertLabel: { ne: "Alert", en: "Alert" },
    dataLabel: { ne: "डाटा", en: "Data" },
    notifyMsg: {
      ne: "नयाँ अर्डर पठाउन तयार छ",
      en: "New order ready for dispatch",
    },
    handled: { ne: "आज पूरा भएका", en: "Handled today" },
  },
  scene4: {
    eyebrow: { ne: "०३ . Websites", en: "03 · Websites" },
    headline: {
      ne: "हरेक स्क्रिनमा चल्ने छिटो वेबसाइट।",
      en: "Fast websites that work on every screen.",
    },
    highlight: { ne: ["छिटो"], en: ["every", "screen"] },
    url: "yourbusiness.com.np",
    siteName: { ne: "Your Business", en: "Your Business" },
    siteNav: [
      { ne: "Services", en: "Services" },
      { ne: "About", en: "About" },
      { ne: "Contact", en: "Contact" },
    ],
    heroTitle: {
      ne: "तपाईंको Business, अब Online",
      en: "Your business, beautifully online.",
    },
    heroSub: {
      ne: "Clear Information, fast pages and easy contact — on any device.",
      en: "Clear information, fast pages and easy contact — on any device.",
    },
    cta: { ne: "Get in touch", en: "Get in touch" },
    cta2: { ne: "Our Services", en: "Our services" },
    features: [
      { ne: "Loads fast", en: "Loads fast" },
      { ne: "Mobile ready", en: "Mobile ready" },
      { ne: "सजिलै Update", en: "Easy to update" },
    ],
  },
  scene5: {
    eyebrow: { ne: "सिक्ने · Nayaro Academy", en: "Learn · Nayaro Academy" },
    headline: {
      ne: "वास्तविक प्रोजेक्ट बनाएर सिकौं।",
      en: "Learn by building real projects.",
    },
    highlight: { ne: ["बनाएर"], en: ["real", "projects"] },
    academy: "Nayaro Academy",
    academySub: {
      ne: "Practical technology education",
      en: "Practical technology education",
    },
    track: { ne: "Web Development", en: "Web Development" },
    // Course module names stay in English, as on nayaro.tech
    modules: [
      "HTML & CSS",
      "Responsive layout",
      "JavaScript",
      "React basics",
      "Git & GitHub",
      "Deployment",
    ],
    fileName: "app.js",
    terminal: ["$ git push origin main", "✓ Project deployed"],
    learnersTitle: { ne: "Batch progress", en: "Batch progress" },
    learner: { ne: "Learner", en: "Learner" },
    learners: ["AS", "RK", "PM"],
    deployBadge: {
      ne: "Project live — ready for your portfolio",
      en: "Project live — ready for your portfolio",
    },
  },
  scene6: {
    services: [
      { ne: "Academy · सिक्ने", en: "Academy · Learn" },
      { ne: "Solutions · बनाउने", en: "Solutions · Build" },
      { ne: "Labs · नयाँ खोज्ने", en: "Labs · Innovate" },
    ],
    taglineEn: [["", "Learn."], ["", "Build."], ["", "Innovate."]],
    line: {
      ne: "उर्लाबारीबाट — प्रविधि सिकाउँदै, समाधान बनाउँदै, नयाँ खोज्दै।",
      en: "From Urlabari, Nepal. Teaching, building and creating our own.",
    },
    cta: {ne: "आफ्नो प्रोजेक्ट सुरु गर्नुहोस् · Academy बारे बुझ्नुहोस्", en: "Start a project · Explore Academy"},
      location: { ne: "उर्लाबारी, मोरङ, नेपाल", en: "Urlabari, Morang, Nepal" },
  },
} as const;
