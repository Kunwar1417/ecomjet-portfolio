/* ============================================================
   AGREEMENT DOCUMENT — shared renderer
   ============================================================
   Turns a plain agreement object into the printed contract.

   Used by BOTH:
     agreement.html  the private editor (Kunwar fills the form)
     sign.html       the read-only view a brand opens from a link

   THE CONTRACT WITH CALLERS
   Every function here is PURE with respect to the DOM: it reads
   its values from the data object passed in, never from form
   fields. That is what lets sign.html render the identical
   document without the editor form existing on the page.

   The data object is exactly what agreement.html's readForm()
   produces and loadForm() consumes, and exactly what is stored
   in localStorage and in the `terms` column server-side. Adding
   a field means adding it in those places too; missing keys must
   always degrade to a sensible default, because old saved
   agreements will not have them.

   Clause prose is the legal text of a real contract. Do not
   reword it casually. Tone rules live in
   docs/agreement-design-language.md §2.
   ============================================================ */
(function (global) {
  "use strict";

  // The creator side is constant. Brands know the handle, not the entity,
  // so the handle leads and NEVER SETTLE stays where it is functional.
  var ME = {
    name: "Kunwar Deep",
    handle: "@the_ecomjet",
    entity: "NEVER SETTLE",
    address: "U/G/F-1/80, Shastri Park, New Delhi, India (110053)",
    email: "kunwar@thecomjet.com"
  };

  var esc = function (s) {
    return String(s == null ? "" : s).replace(/[&<>]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c];
    });
  };
  var nl2br = function (s) { return esc(s).replace(/\n/g, "<br>"); };

  function fmtMoney(amount, cur) {
    var opts = { style: "currency", maximumFractionDigits: 0, minimumFractionDigits: 0 };
    if (cur === "INR") return new Intl.NumberFormat("en-IN", Object.assign({ currency: "INR" }, opts)).format(amount || 0);
    return new Intl.NumberFormat("en-US", Object.assign({ currency: "USD" }, opts)).format(amount || 0);
  }

  function fmtDate(iso) {
    if (!iso) return "";
    var d = new Date(iso + "T00:00:00");
    if (isNaN(d)) return iso;
    var m = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    return d.getDate() + " " + m[d.getMonth()] + ", " + d.getFullYear();
  }

  // Trim + stringify. Values arrive from a form, from localStorage, or from
  // JSON over the wire, so nothing may be assumed to already be a string.
  function s(v) { return v == null ? "" : String(v).trim(); }

  function payTermsText(d) {
    var v = s(d.payTerms);
    if (v === "__custom__") return s(d.payCustom);
    if (v === "__split__") return "50% of the total fee is payable in advance before work begins. The remaining 50% is payable within 7 days of the content going live.";
    return v;
  }

  var SCOPE_LABEL = {
    organic: "Organic usage rights",
    paid: "Organic + paid usage rights",
    whitelist: "Whitelisting",
    full: "Full paid media"
  };

  /* ---- Clause builders. Each returns {h, b}; optional clauses are simply
     not pushed, so the positional numbering in renderDoc stays contiguous. */
  function buildClauses(d) {
    d = d || {};
    var cur = s(d.currency) || "USD";
    var fee = parseFloat(d.fee) || 0;
    var brand = s(d.brand) || "the Brand";
    var out = [];

    // 1. Scope
    var campaign = s(d.campaign);
    out.push({
      h: "Scope of work",
      b: "<p>" + esc(brand) + " engages the Creator to produce and publish sponsored content" +
         (campaign ? " for <b>" + esc(campaign) + "</b>" : "") +
         " on the Creator's Instagram channel " + esc(ME.handle) + ", on the terms set out below. " +
         "This agreement covers the deliverables listed in clause 2. Additional work can be added by agreeing it in writing.</p>"
    });

    // 2. Deliverables
    var items = (d.deliverables || []).filter(function (x) { return x && s(x.desc); });
    var dtab = "";
    if (items.length) {
      dtab = '<div class="dtab"><div class="dtab-head"><span>Deliverable</span><span class="t-c">Qty</span></div>' +
        items.map(function (it) {
          var parts = String(it.desc).split("\n");
          var sub = parts.slice(1).join(" · ");
          return '<div class="dtab-row"><div><div class="t-title">' + esc(parts[0]) + '</div>' +
            (sub ? '<div class="t-sub">' + esc(sub) + '</div>' : "") + '</div>' +
            '<div class="t-c">' + (parseFloat(it.qty) || 1) + '</div></div>';
        }).join("") + '</div>';
    }
    out.push({
      h: "Deliverables",
      b: dtab + "<p>The Creator writes, films, edits and publishes the above. Concept and script are the Creator's, shaped by the brief the Brand provides.</p>"
    });

    // 3. Timeline & approval
    var draft = fmtDate(s(d.draftDate));
    var live = fmtDate(s(d.liveDate));
    var appDays = parseInt(d.approvalDays, 10) || 3;
    var minLive = s(d.minLive);
    var tl = "";
    if (draft || live || minLive) {
      tl = '<div class="kv-grid">' +
        (draft ? '<span class="k">Draft delivered by</span><span class="v">' + esc(draft) + '</span>' : "") +
        (live ? '<span class="k">Goes live on</span><span class="v">' + esc(live) + '</span>' : "") +
        (minLive ? '<span class="k">Stays live for</span><span class="v">' + esc(minLive) + '</span>' : "") +
        '</div>';
    }
    out.push({
      h: "Timeline and approval",
      b: tl +
        "<p>The Brand has <b>" + appDays + " business days</b> from receiving a draft to approve it or request changes. " +
        "If no feedback arrives within that window, the draft is treated as approved and can go live as planned. " +
        "If feedback, product access or the brief arrive later than planned, the live date moves by the same number of days.</p>" +
        (minLive && minLive !== "Permanently"
          ? "<p>The content stays on the Creator's channel for at least " + esc(minLive) + " from the live date. After that the Creator may archive it.</p>"
          : "")
    });

    // 4. Fee & payment
    var late = s(d.late);
    out.push({
      h: "Fee and payment",
      b: '<div class="fee-bar"><span class="lbl">Total <em>fee</em></span><span class="val">' + fmtMoney(fee, cur) + '</span></div>' +
        "<p>" + esc(payTermsText(d)) + "</p>" +
        "<p>The fee is quoted in " + esc(cur) + ", exclusive of taxes, and is paid by bank transfer. " +
        "Transfer and currency conversion charges sit with the Brand, so the amount received matches the amount agreed. " +
        "If tax has to be withheld at source, the Brand will share the withholding certificate so the Creator can claim the credit.</p>" +
        (late ? "<p>If payment goes beyond " + esc(late) + " days past the due date, interest of 1.5% per month applies to the outstanding balance.</p>" : "")
    });

    // 5. Revisions
    var revs = parseInt(d.revisions, 10) || 2;
    var revFee = parseFloat(d.revisionFee) || 0;
    out.push({
      h: "Revisions",
      b: "<p>The fee includes <b>" + revs + " round" + (revs === 1 ? "" : "s") + " of revisions</b>. " +
        "A revision means changes to an existing edit: copy, captions, pacing, on-screen text, the order of shots. " +
        "A change of concept, a new script, or anything needing fresh filming counts as a re-shoot, which is quoted separately.</p>" +
        (revFee ? "<p>Further rounds beyond those included are billed at " + fmtMoney(revFee, cur) + " each.</p>" : "")
    });

    // 6. Creative control & disclosure
    out.push({
      h: "Creative control and disclosure",
      b: "<p>The Creator keeps final say over creative execution, so the content reads as genuine to the audience it was built for. " +
        "The Brand sets the message, claims and any legal must-haves, and the Creator will only publish claims the Brand has approved.</p>" +
        "<p>The content will be disclosed as a paid partnership using the platform's own tools and clear wording, in line with FTC and ASCI guidance. Both parties will keep the partnership clearly disclosed.</p>"
    });

    // 7. Usage rights.
    // Each scope carries its own grant sentence AND its own editing rule.
    // A blanket "may not re-edit" is contradictory for ad formats, which
    // require cutting the content into variants to run at all.
    var scope = s(d.rightsScope);
    var term = s(d.rightsTerm);
    var terr = s(d.rightsTerritory);
    var canEdit = !!d.rightsEdit;
    var termPhrase = term
      ? (term === "In perpetuity" ? "for as long as they wish" : "for <b>" + esc(term) + "</b> from the live date")
      : "for the period the parties agree in writing";

    // grant sentence per scope
    var SCOPE_GRANT = {
      organic:
        "The Brand may repost the content organically on its own social channels and website, " + termPhrase +
        ". Organic means unpaid placement, so the content is not used in paid promotion.",
      paid:
        "The Brand may repost the content organically on its own channels, and may also run it as paid social advertising " +
        "published from the Brand's own accounts, " + termPhrase + ". The ads run under the Brand's name, not the Creator's.",
      whitelist:
        "The Brand may run paid advertising from the Creator's own Instagram handle <b>@the_ecomjet</b> " + termPhrase +
        ", using Meta's partnership ad tools. The Creator will grant the advertising permissions needed to do this and keep them " +
        "active for the term. Ads appear to audiences as coming from the Creator's handle, which is why this right is limited to " +
        "the term and territory stated above, and can be extended by a new written agreement.",
      full:
        "The Brand may use the content across all paid media channels, including paid social, display, connected TV, " +
        "its owned properties and third-party placements, " + termPhrase + "."
    };

    // editing rule per scope
    var SCOPE_EDIT = {
      organic: canEdit
        ? "The Brand may re-edit the content, provided the edit does not change the meaning of what the Creator said or imply a claim the Creator did not make."
        : "The content runs as delivered, without re-editing or re-cutting. Trimming to fit a placement's aspect ratio or duration is allowed.",
      paid: canEdit
        ? "The Brand may re-edit or re-cut the content into advertising variants, provided the edit does not change the meaning of what the Creator said or imply a claim the Creator did not make."
        : "The content runs as delivered, without re-editing or re-cutting. Trimming to fit a placement's aspect ratio or duration is allowed.",
      whitelist:
        "The Brand may trim and reformat the content to fit ad placements. Because these ads run from the Creator's handle, " +
        "the edit otherwise stays as delivered, without added claims or changes to the meaning of what the Creator said. " +
        "If an ad running from the Creator's handle does not reflect what they said, the Creator can ask for it to be paused, " +
        "and the Brand will action that promptly.",
      full:
        "The Brand may cut the content into advertising variants and reformat it for different placements, provided no edit " +
        "changes the meaning of what the Creator said or implies a claim the Creator did not make."
    };

    var rights = "";
    if (scope || term || terr) {
      rights = '<div class="kv-grid">' +
        (scope ? '<span class="k">Scope</span><span class="v">' + SCOPE_LABEL[scope] + '</span>' : "") +
        (term ? '<span class="k">Term</span><span class="v">' + esc(term) + '</span>' : "") +
        (terr ? '<span class="k">Territory</span><span class="v">' + esc(terr) + '</span>' : "") +
        '</div>';
    }

    var grant = SCOPE_GRANT[scope];
    out.push({
      h: "Usage rights",
      b: rights +
        (grant
          ? "<p>The Creator grants the Brand a non-exclusive, non-transferable licence on the terms below" +
            (terr ? (terr === "Worldwide" ? ", worldwide" : ", in " + esc(terr)) : "") + ".</p><p>" + grant + "</p>"
          : "<p>No usage rights are granted. The content stays on the Creator's channel and the Brand may not repost, " +
            "reproduce or advertise with it. If the Brand wants usage rights, they are agreed and priced separately in writing.</p>") +
        (SCOPE_EDIT[scope] ? "<p>" + SCOPE_EDIT[scope] + "</p>" : "") +
        (grant
          ? "<p>Use beyond the scope, term or territory above can be arranged in writing and is priced separately. " +
            "This licence covers the Brand's own use, and does not extend to sub-licensing or reselling the content to a third party.</p>"
          : "")
    });

    // 8. Ownership
    out.push({
      h: "Ownership",
      b: "<p>The Creator owns the copyright in the content, including all raw footage and project files. The Brand receives the licence described in clause 7, not ownership. " +
        "Raw footage is included only when listed as a deliverable.</p>" +
        "<p>The Brand keeps ownership of its trademarks, logos, product footage and any material it supplies, and grants the Creator the right to use them for this campaign.</p>"
    });

    // 9. Exclusivity (optional)
    if (d.exclOn) {
      var cat = s(d.exclCat);
      var days = parseInt(d.exclDays, 10) || 30;
      var named = s(d.exclNamed);
      out.push({
        h: "Exclusivity",
        b: "<p>For <b>" + days + " days</b> from the live date, the Creator will not publish sponsored content for a directly competing " +
          (cat ? "product in the " + esc(cat) + " category" : "product in the same category") + "." +
          (named ? " This includes " + esc(named) + "." : "") + "</p>" +
          "<p>This applies to paid placements only. It does not restrict the Creator's unpaid editorial coverage, and it does not extend to content already published or already contracted before the date of this agreement.</p>"
      });
    }

    // 10. Confidentiality (optional)
    if (d.ndaOn) {
      out.push({
        h: "Confidentiality",
        b: "<p>Each party will keep the other's non-public information private, including unreleased products, roadmaps, pricing and the commercial terms of this agreement. " +
          "This does not cover information that is already public, was already known, or must be disclosed by law.</p>" +
          "<p>The Creator may name the Brand as a client and show the published content in a portfolio, case study or media kit.</p>"
      });
    }

    // 11. Content deletion (optional)
    if (d.delOn) {
      out.push({
        h: "Use after the licence ends",
        b: "<p>When the licence term in clause 7 ends, the Brand will stop running the content in paid placements and take it down from its owned channels within 14 days, unless the parties agree a renewal in writing.</p>" +
          "<p>Archived copies held for internal record keeping are fine. Continued public use after the term is a new licence and is charged at the Creator's then-current rate.</p>"
      });
    }

    // 12. Cancellation
    var kill = s(d.kill);
    out.push({
      h: "Cancellation",
      b: (kill
          ? "<p>If the Brand cancels after this agreement is signed and work has begun, <b>" + esc(kill) + "% of the total fee</b> is payable. Any advance already paid counts toward that amount. If the content has already been delivered, the full fee remains payable, since the work has been completed.</p>"
          : "<p>Either party may cancel in writing before work begins, at no cost. Once the content has been delivered, the full fee remains payable, since the work has been completed.</p>") +
        "<p>If the Creator cannot deliver, any advance paid is refunded in full. Neither party is liable for delays caused by events outside their reasonable control, provided they say so promptly.</p>"
    });

    // 13. Warranties & liability
    out.push({
      h: "Warranties and liability",
      b: "<p>The Creator warrants that the content is original work, that it does not knowingly infringe anyone's rights, and that any music or stock used is properly licensed. " +
        "The Brand warrants that the claims and materials it supplies are accurate and that it has the right to supply them.</p>" +
        "<p>Each party indemnifies the other against claims arising from its own breach of the above. Neither party is liable for indirect or consequential loss, and each party's total liability under this agreement is capped at the total fee.</p>"
    });

    // 14. Disputes
    var seat = s(d.seat);
    out.push({
      h: "Disputes",
      b: "<p>If a disagreement comes up, the parties will first try to resolve it directly and in good faith, in writing, within 15 days of one party raising it.</p>" +
        "<p>Anything unresolved after that goes to arbitration before a single arbitrator. The arbitration is conducted remotely, in English, and the seat and venue are " +
        (seat ? "<b>" + esc(seat) + "</b>" : "as the parties agree in writing at the time") +
        ". The arbitrator's decision is final and binding, and each party bears its own costs unless the arbitrator decides otherwise.</p>"
    });

    // 15. General (+ optional governing law)
    var law = s(d.law);
    out.push({
      h: "General",
      b: (law ? "<p>This agreement is governed by the laws of " + esc(law) + ".</p>" : "") +
        "<p>This is the whole agreement between the parties on this campaign and replaces anything discussed before it. Changes must be in writing and signed by both parties. " +
        "The Creator works as an independent contractor. " +
        "If any clause is found unenforceable, the rest stays in force. Notices go to the email addresses on page one.</p>"
    });

    // 16. Additional terms (optional)
    var notes = s(d.notes);
    if (notes) out.push({ h: "Additional terms", b: "<p>" + nl2br(notes) + "</p>" });

    return out;
  }

  /* ---- Render the whole document into `root` (the .inv-doc element).
     `root` must contain the document skeleton with its d-* ids; this fills
     them in. Nothing here touches the editor form, so sign.html can call it
     with a plain object fetched from the server. ---- */
  function renderDoc(root, d) {
    d = d || {};
    var q = function (id) { return root.querySelector("#" + id); };
    var set = function (id, text) { var el = q(id); if (el) el.textContent = text; };
    var html = function (id, markup) { var el = q(id); if (el) el.innerHTML = markup; };

    var num = s(d.num);
    var brand = s(d.brand) || "Brand name";

    set("d-num", num);
    set("d-foot-num", num);
    set("d-date", fmtDate(s(d.date)));

    set("d-brand-name", brand);
    html("d-brand-addr", nl2br(d.brandAddr || ""));
    set("d-me-addr", ME.address);

    var email = s(d.brandEmail);
    var contact = q("d-brand-contact");
    if (contact) {
      if (email) { contact.hidden = false; contact.innerHTML = '<span class="k">Email</span> ' + esc(email); }
      else contact.hidden = true;
    }

    set("d-sign-name", s(d.brandSign));
    set("d-sign-title", s(d.brandTitle));
    set("d-sign-ref", num);
    set("d-sign-parties", ME.name + " and " + (s(d.brand) || "the Brand"));

    // Lead with the name and handle the brand recognises. The entity is not
    // named here: it appears in the masthead line and at signature, which is
    // enough to tie the agreement to the account that invoices and gets paid.
    html("d-preamble",
      "This collaboration agreement is made on <b>" + (esc(fmtDate(s(d.date))) || "the date signed below") +
      "</b> between <b>" + esc(ME.name) + "</b>, creator of <b>" + esc(ME.handle) +
      "</b> on Instagram (the Creator), and <b>" + esc(brand) + "</b> (the Brand).");

    // Clause numbering is positional, so omitting an optional clause
    // renumbers the rest automatically.
    var clauses = buildClauses(d);
    html("d-clauses", clauses.map(function (c, i) {
      return '<div class="cl"><div class="cl-h"><span class="n">' + (i + 1) + '.</span><span>' + esc(c.h) + '</span></div>' +
        '<div class="cl-b">' + c.b + '</div></div>';
    }).join(""));
  }

  global.KDAgreement = {
    ME: ME,
    esc: esc,
    nl2br: nl2br,
    fmtMoney: fmtMoney,
    fmtDate: fmtDate,
    payTermsText: payTermsText,
    buildClauses: buildClauses,
    renderDoc: renderDoc,
    SCOPE_LABEL: SCOPE_LABEL
  };
})(window);
