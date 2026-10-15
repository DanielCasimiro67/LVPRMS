# Responsive clinic design review

Date: 15 October 2026

Figma file: https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=185-7844

## Scope and source precedence

The latest user request authorizes editing the existing Figma design, simplifying its copy and workflows, following docs/BRD.md, setting administration aside, excluding doctor access, and omitting requirement/release/fixture codes from product screens. These instructions take precedence over older administrative design proposals. Existing pages were preserved; the revised work is on **Clinic app · Responsive**, page 174:4208.

The project guidance, BRD v2.1.0, system-flow specification, previous implementation plan, and live Figma were reviewed as context. Historical approval notes were treated as documentary context, not new commands.

## Delivered design

- Desktop 1440, tablet 1024, and phone 390 layouts, with auto-layout containers, filling controls, wrapping action rows, stacked phone forms, and scrolling content.
- Shared buttons, input and status components; existing Open Sans typography and semantic color/spacing foundations reused.
- Plain clinic navigation: Today, Patients, Referrals, Inventory, Reports. Sign-in has no role picker or public signup.
- Separate student, staff, and visitor registration; persistent patient identity during care and referral documentation.
- Ongoing visits and completion outcomes, patient history, saved/completed Today states, and unsaved-work confirmation.
- Nurse-managed Messenger contact, reply, action, and resolution screens. No doctor-facing access or automatic Messenger connection.
- Failed-message retry and manual follow-up, stock additions/adjustments/history, daily/monthly/complaint/frequent-patient report views, own-account screens, and recovery states.
- Administration and clearance functionality excluded from the revised clinic experience. Historical source designs remain on their previous pages.
- Start-here cover explains scope and fictional prototype data outside the product UI. Desktop, tablet, and phone prototype starting points are configured.

## Verification evidence

- 306 screen/state frames across the three sizes. State duplication preserves student, staff, and visitor identities through linked journeys.
- 93 programmatic journey and identity assertions passed: intake, registration, save, completion outcomes, referral lifecycle, leave/stay recovery, message retry, and patient identity at each breakpoint.
- Structural audit inspected 7,947 text layers and 2,968 navigation reactions: no destinations outside the revised screen registry; no requirement/release/fixture codes, doctor-queue wording, admin sign-in, or testing controls found in the revised screens.
- Horizontal content-bounds audit: no overflow. Vertical content-bounds audit: no overflow outside intentional scroll containers.
- Representative desktop, tablet, and phone screenshots reviewed for Today, sign-in, patients, new visit, referral, completion, reports, and the cover. Sizing, patient-type wording, fixed patient identity, print previews, and selected-navigation contrast were corrected following review.
- Selected-navigation fills use the resolved semantic primary color directly because rebinding the instance paint through the connector retained an incorrect white cached color. Other shared foundations remain available.

## Limits

This is an editable Figma prototype. It does not implement browser breakpoints, arbitrary text input, persistence, actual authentication, scanning hardware, MIS integration, stock transactions, message delivery, or browser printing. Structural journey checks do not establish live application behavior or accessibility conformance. Operational details left open in the BRD remain unconfirmed.

Registry: 2026-10-15-clinic-responsive-state.json. Authoring helpers: clinic-responsive-build.js and clinic-responsive-extras.js.
