const ids = [
  "leadName",
  "leadCompany",
  "leadHeadline",
  "leadUrl",
  "leadContact",
  "senderName",
  "offer",
  "personalDetail",
  "messageDraft",
  "status",
  "nextFollowUp",
  "templateType",
  "tone",
  "displayCurrency",
  "searchLeads"
];

const form = Object.fromEntries(ids.map((id) => [id, document.getElementById(id)]));
const feedback = document.getElementById("feedback");
const leadList = document.getElementById("leadList");
const planBadge = document.getElementById("planBadge");

const pricing = {
  INR: "₹99/mo"
};

async function getStorage() {
  const data = await chrome.storage.local.get(["draft", "leads", "settings"]);
  return {
    draft: data.draft || {},
    leads: data.leads || [],
    settings: data.settings || { displayCurrency: "INR" }
  };
}

async function setStorage(update) {
  await chrome.storage.local.set(update);
}

function showFeedback(message, isError = false) {
  feedback.textContent = message;
  feedback.style.color = isError ? "#ff9a9a" : "#5dd39e";
}

function bindDraft() {
  for (const [key, el] of Object.entries(form)) {
    if (!el) {
      continue;
    }

    el.addEventListener("input", async () => {
      const { draft } = await getStorage();
      draft[key] = el.value;
      await setStorage({ draft });

      if (key === "searchLeads") {
        await renderLeads();
      }
      if (key === "displayCurrency") {
        await applyCurrency(el.value);
      }
    });
  }
}

async function restoreDraft() {
  const { draft, settings } = await getStorage();
  for (const [key, el] of Object.entries(form)) {
    if (el && typeof draft[key] === "string") {
      el.value = draft[key];
    }
  }

  if (form.displayCurrency) {
    form.displayCurrency.value = settings.displayCurrency || "INR";
    await applyCurrency(form.displayCurrency.value);
  }
}

async function applyCurrency(currency) {
  planBadge.textContent = pricing[currency] || pricing.INR;
  const { settings } = await getStorage();
  settings.displayCurrency = currency;
  await setStorage({ settings });
}

async function captureLeadFromTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id || !tab.url?.includes("linkedin.com/in/")) {
    showFeedback("Open a LinkedIn profile page first.", true);
    return;
  }

  const response = await chrome.tabs.sendMessage(tab.id, { type: "CAPTURE_LEAD" });
  if (!response) {
    showFeedback("Unable to capture profile. Refresh page and try again.", true);
    return;
  }

  form.leadName.value = response.name || "";
  form.leadHeadline.value = response.headline || "";
  form.leadUrl.value = response.profileUrl || tab.url;
  showFeedback("Public profile data captured.");
}

function buildMessage() {
  const name = form.leadName.value.trim() || "there";
  const senderName = form.senderName.value.trim() || "Your Name";
  const offer = form.offer.value.trim() || "virtual assistant support";
  const personalDetail = form.personalDetail.value.trim();
  const templateType = form.templateType.value;
  const tone = form.tone.value;

  const intros = {
    professional: `Hi ${name},`,
    friendly: `Hi ${name} 👋,`,
    premium: `Hello ${name},`
  };

  const core = {
    intro: `${personalDetail ? `I noticed ${personalDetail}. ` : ""}I support founders with ${offer} and thought a connection could be useful.`,
    value: `${personalDetail ? `Your focus on ${personalDetail} stood out. ` : ""}I help teams save 8-10 hours weekly through ${offer}. Happy to share a quick approach.`,
    followup: `Quick follow-up on my earlier note${personalDetail ? ` about ${personalDetail}` : ""}. I can help with ${offer} if this is still relevant.`
  };

  const closings = {
    professional: `Best regards,\n${senderName}`,
    friendly: `Cheers,\n${senderName}`,
    premium: `Warm regards,\n${senderName}`
  };

  return `${intros[tone]}\n${core[templateType]}\n\n${closings[tone]}`;
}

async function saveLead() {
  const leadName = form.leadName.value.trim();
  const profileUrl = form.leadUrl.value.trim();

  if (!leadName || !profileUrl) {
    showFeedback("Name and profile URL are required.", true);
    return;
  }

  const { leads } = await getStorage();
  const entry = {
    leadName,
    leadCompany: form.leadCompany.value.trim(),
    leadHeadline: form.leadHeadline.value.trim(),
    profileUrl,
    leadContact: form.leadContact.value.trim(),
    messageDraft: form.messageDraft.value.trim(),
    status: form.status.value,
    nextFollowUp: form.nextFollowUp.value,
    updatedAt: new Date().toISOString()
  };

  const existingIndex = leads.findIndex((item) => item.profileUrl === profileUrl);
  if (existingIndex >= 0) {
    leads[existingIndex] = entry;
  } else {
    leads.push(entry);
  }

  await setStorage({ leads });
  await renderLeads();
  showFeedback("Lead saved to pipeline.");
}

function clearForm() {
  for (const [key, el] of Object.entries(form)) {
    if (!el || key === "searchLeads" || key === "displayCurrency") {
      continue;
    }
    el.value = "";
  }
  form.status.value = "To contact";
  showFeedback("Form cleared.");
}

async function copyMessage() {
  const message = form.messageDraft.value.trim();
  if (!message) {
    showFeedback("Generate or type a message first.", true);
    return;
  }

  await navigator.clipboard.writeText(message);
  showFeedback("Message copied. Paste manually in LinkedIn.");
}

function csvValue(v) {
  const value = String(v || "").replaceAll('"', '""');
  return `"${value}"`;
}

async function exportCsv() {
  const { leads } = await getStorage();
  if (!leads.length) {
    showFeedback("No leads available to export.", true);
    return;
  }

  const headers = ["Name", "Company", "Headline", "URL", "Contact", "Status", "NextFollowUp", "UpdatedAt"];
  const rows = leads.map((lead) => [
    lead.leadName,
    lead.leadCompany,
    lead.leadHeadline,
    lead.profileUrl,
    lead.leadContact,
    lead.status,
    lead.nextFollowUp,
    lead.updatedAt
  ]);

  const csv = [headers, ...rows].map((row) => row.map(csvValue).join(",")).join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  await chrome.downloads.download({
    url,
    filename: "va-outreach-leads.csv",
    saveAs: true
  });
  showFeedback("CSV export started.");
}

async function renderLeads() {
  const { leads } = await getStorage();
  const term = form.searchLeads.value.trim().toLowerCase();
  const filtered = leads
    .filter((lead) => {
      const source = `${lead.leadName} ${lead.leadCompany} ${lead.status}`.toLowerCase();
      return !term || source.includes(term);
    })
    .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));

  leadList.innerHTML = filtered.length
    ? filtered
        .slice(0, 20)
        .map(
          (lead) => `
            <article class="leadItem">
              <strong>${lead.leadName} ${lead.leadCompany ? `• ${lead.leadCompany}` : ""}</strong>
              <small>${lead.status} ${lead.nextFollowUp ? `• follow-up ${lead.nextFollowUp}` : ""}</small>
            </article>`
        )
        .join("")
    : '<article class="leadItem"><small>No leads yet. Capture one to begin.</small></article>';

  const total = leads.length;
  const invites = leads.filter((lead) => lead.status === "Invite sent").length;
  const replies = leads.filter((lead) => lead.status === "Replied").length;
  document.getElementById("statTotal").textContent = String(total);
  document.getElementById("statInvites").textContent = String(invites);
  document.getElementById("statReplies").textContent = String(replies);
}

document.getElementById("captureBtn").addEventListener("click", captureLeadFromTab);
document.getElementById("saveBtn").addEventListener("click", saveLead);
document.getElementById("clearBtn").addEventListener("click", clearForm);
document.getElementById("generateBtn").addEventListener("click", () => {
  form.messageDraft.value = buildMessage();
  showFeedback("Draft generated.");
});
document.getElementById("copyBtn").addEventListener("click", copyMessage);
document.getElementById("exportBtn").addEventListener("click", exportCsv);

restoreDraft();
bindDraft();
renderLeads();
