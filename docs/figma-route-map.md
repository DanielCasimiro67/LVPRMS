# Figma screen and state route map

Page: **Clinic app · Responsive** (`174:4208`). Live inventory: **348 screens/states**, **4 guide frames**. All top-level frames were inspected via node metadata and text content on October 15, 2026. Component definitions are shared UI primitives, not routes. Nested Application/content wrappers are not separate screens.

The same route reflows across sizes. State is determined by records and user actions; a mapped example state is not evidence that its functionality is implemented. Parameter names stand for real record IDs. All routes beyond login, session-ended, menu, account, and Today foundation are reserved for later tasks. The JSON companion retains inspection evidence for every frame. Additional high-fidelity context is mandatory before implementing each screen.

| Figma node | Frame | Dimensions | State | Route / guide destination |
|---|---|---|---|---|
| [174:4244](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=174-4244) | Today · Desktop | 1440 × 1083 | today | `#/today` |
| [174:4319](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=174-4319) | Today · Tablet | 1024 × 1083 | today | `#/today` |
| [174:4394](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=174-4394) | Today · Phone | 390 × 844 | today | `#/today` |
| [177:4259](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=177-4259) | Welcome back · Desktop | 1440 × 960 | login | `#/login` |
| [177:4303](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=177-4303) | Welcome back · Tablet | 1024 × 960 | login | `#/login` |
| [177:4347](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=177-4347) | Welcome back · Phone | 390 × 844 | login | `#/login` |
| [177:4372](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=177-4372) | Patients · Desktop | 1440 × 960 | patients | `#/patients` |
| [177:4443](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=177-4443) | Patients · Tablet | 1024 × 960 | patients | `#/patients` |
| [177:4514](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=177-4514) | Patients · Phone | 390 × 844 | patients | `#/patients` |
| [177:4566](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=177-4566) | Patients · Desktop | 1440 × 960 | patientStaff | `#/patients?type=staff` |
| [177:4621](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=177-4621) | Patients · Tablet | 1024 × 960 | patientStaff | `#/patients?type=staff` |
| [177:4676](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=177-4676) | Patients · Phone | 390 × 844 | patientStaff | `#/patients?type=staff` |
| [177:8558](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=177-8558) | Patients · Desktop | 1440 × 960 | patientVisitor | `#/patients?type=visitor` |
| [177:8613](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=177-8613) | Patients · Tablet | 1024 × 960 | patientVisitor | `#/patients?type=visitor` |
| [177:8668](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=177-8668) | Patients · Phone | 390 × 844 | patientVisitor | `#/patients?type=visitor` |
| [177:8704](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=177-8704) | Register a patient · Desktop | 1440 × 960 | register | `#/patients/register?type=student` |
| [177:8769](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=177-8769) | Register a patient · Tablet | 1024 × 960 | register | `#/patients/register?type=student` |
| [177:8834](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=177-8834) | Register a patient · Phone | 390 × 844 | register | `#/patients/register?type=student` |
| [177:8880](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=177-8880) | Register a patient · Desktop | 1440 × 960 | registerStaff | `#/patients/register?type=staff` |
| [177:8945](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=177-8945) | Register a patient · Tablet | 1024 × 960 | registerStaff | `#/patients/register?type=staff` |
| [177:9010](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=177-9010) | Register a patient · Phone | 390 × 844 | registerStaff | `#/patients/register?type=staff` |
| [177:9056](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=177-9056) | Register a patient · Desktop | 1440 × 960 | registerVisitor | `#/patients/register?type=visitor` |
| [177:9113](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=177-9113) | Register a patient · Tablet | 1024 × 960 | registerVisitor | `#/patients/register?type=visitor` |
| [177:9170](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=177-9170) | Register a patient · Phone | 390 × 844 | registerVisitor | `#/patients/register?type=visitor` |
| [177:9208](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=177-9208) | Patient record · Desktop | 1440 × 960 | record | `#/patients/:patientId` |
| [177:9281](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=177-9281) | Patient record · Tablet | 1024 × 960 | record | `#/patients/:patientId` |
| [177:9354](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=177-9354) | Patient record · Phone | 390 × 844 | record | `#/patients/:patientId` |
| [177:9408](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=177-9408) | New visit · Desktop | 1440 × 960 | visit | `#/visits/new?patient=:patientId` |
| [177:9498](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=177-9498) | New visit · Tablet | 1024 × 960 | visit | `#/visits/new?patient=:patientId` |
| [177:9588](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=177-9588) | New visit · Phone | 390 × 844 | visit | `#/visits/new?patient=:patientId` |
| [177:9659](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=177-9659) | New visit · Desktop | 1440 × 960 | visitFilled | `#/visits/new?patient=:patientId` |
| [177:9749](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=177-9749) | New visit · Tablet | 1024 × 960 | visitFilled | `#/visits/new?patient=:patientId` |
| [177:9839](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=177-9839) | New visit · Phone | 390 × 844 | visitFilled | `#/visits/new?patient=:patientId` |
| [177:9910](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=177-9910) | New visit · Desktop | 1440 × 960 | visitStaff | `#/visits/new?patient=:patientId` |
| [177:10000](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=177-10000) | New visit · Tablet | 1024 × 960 | visitStaff | `#/visits/new?patient=:patientId` |
| [177:10090](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=177-10090) | New visit · Phone | 390 × 844 | visitStaff | `#/visits/new?patient=:patientId` |
| [177:10161](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=177-10161) | New visit · Desktop | 1440 × 960 | visitVisitor | `#/visits/new?patient=:patientId` |
| [177:10251](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=177-10251) | New visit · Tablet | 1024 × 960 | visitVisitor | `#/visits/new?patient=:patientId` |
| [177:10341](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=177-10341) | New visit · Phone | 390 × 844 | visitVisitor | `#/visits/new?patient=:patientId` |
| [177:10412](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=177-10412) | Ongoing visit · Desktop | 1440 × 960 | saved | `#/visits/:visitId` |
| [177:10505](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=177-10505) | Ongoing visit · Tablet | 1024 × 960 | saved | `#/visits/:visitId` |
| [177:10598](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=177-10598) | Ongoing visit · Phone | 390 × 844 | saved | `#/visits/:visitId` |
| [177:10672](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=177-10672) | Complete visit · Desktop | 1440 × 960 | complete | `#/visits/:visitId/complete` |
| [177:10732](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=177-10732) | Complete visit · Tablet | 1024 × 960 | complete | `#/visits/:visitId/complete` |
| [177:10792](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=177-10792) | Complete visit · Phone | 390 × 844 | complete | `#/visits/:visitId/complete` |
| [177:10833](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=177-10833) | Visit completed · Desktop | 1440 × 960 | completed | `#/visits/:visitId` |
| [177:10882](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=177-10882) | Visit completed · Tablet | 1024 × 960 | completed | `#/visits/:visitId` |
| [177:10931](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=177-10931) | Visit completed · Phone | 390 × 844 | completed | `#/visits/:visitId` |
| [177:10961](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=177-10961) | Referrals · Desktop | 1440 × 960 | referrals | `#/referrals` |
| [177:11018](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=177-11018) | Referrals · Tablet | 1024 × 960 | referrals | `#/referrals` |
| [177:11075](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=177-11075) | Referrals · Phone | 390 × 844 | referrals | `#/referrals` |
| [177:11113](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=177-11113) | Referral · Desktop | 1440 × 960 | prepared | `#/referrals/:referralId` |
| [177:11167](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=177-11167) | Referral · Tablet | 1024 × 960 | prepared | `#/referrals/:referralId` |
| [177:11221](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=177-11221) | Referral · Phone | 390 × 844 | prepared | `#/referrals/:referralId` |
| [177:11256](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=177-11256) | Record contact · Desktop | 1440 × 960 | contact | `#/referrals/:referralId/contact` |
| [177:11314](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=177-11314) | Record contact · Tablet | 1024 × 960 | contact | `#/referrals/:referralId/contact` |
| [177:11372](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=177-11372) | Record contact · Phone | 390 × 844 | contact | `#/referrals/:referralId/contact` |
| [177:11411](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=177-11411) | Referral · Desktop | 1440 × 960 | waiting | `#/referrals/:referralId` |
| [177:11468](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=177-11468) | Referral · Tablet | 1024 × 960 | waiting | `#/referrals/:referralId` |
| [177:11525](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=177-11525) | Referral · Phone | 390 × 844 | waiting | `#/referrals/:referralId` |
| [177:11563](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=177-11563) | Record doctor’s reply · Desktop | 1440 × 960 | reply | `#/referrals/:referralId/reply` |
| [177:11618](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=177-11618) | Record doctor’s reply · Tablet | 1024 × 960 | reply | `#/referrals/:referralId/reply` |
| [177:11673](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=177-11673) | Record doctor’s reply · Phone | 390 × 844 | reply | `#/referrals/:referralId/reply` |
| [177:11709](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=177-11709) | Referral · Desktop | 1440 × 960 | advice | `#/referrals/:referralId` |
| [177:11767](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=177-11767) | Referral · Tablet | 1024 × 960 | advice | `#/referrals/:referralId` |
| [177:11825](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=177-11825) | Referral · Phone | 390 × 844 | advice | `#/referrals/:referralId` |
| [177:11864](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=177-11864) | Resolve follow-up · Desktop | 1440 × 960 | resolve | `#/referrals/:referralId/resolve` |
| [177:11915](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=177-11915) | Resolve follow-up · Tablet | 1024 × 960 | resolve | `#/referrals/:referralId/resolve` |
| [177:11966](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=177-11966) | Resolve follow-up · Phone | 390 × 844 | resolve | `#/referrals/:referralId/resolve` |
| [177:11998](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=177-11998) | Referral · Desktop | 1440 × 960 | resolved | `#/referrals/:referralId` |
| [177:12054](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=177-12054) | Referral · Tablet | 1024 × 960 | resolved | `#/referrals/:referralId` |
| [177:12110](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=177-12110) | Referral · Phone | 390 × 844 | resolved | `#/referrals/:referralId` |
| [177:12147](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=177-12147) | Messages · Desktop | 1440 × 960 | notifications | `#/messages?status=failed` |
| [177:12199](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=177-12199) | Messages · Tablet | 1024 × 960 | notifications | `#/messages?status=failed` |
| [177:12251](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=177-12251) | Messages · Phone | 390 × 844 | notifications | `#/messages?status=failed` |
| [177:12284](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=177-12284) | Message details · Desktop | 1440 × 960 | retry | `#/messages/:messageId` |
| [177:12336](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=177-12336) | Message details · Tablet | 1024 × 960 | retry | `#/messages/:messageId` |
| [177:12388](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=177-12388) | Message details · Phone | 390 × 844 | retry | `#/messages/:messageId` |
| [177:12421](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=177-12421) | Message details · Desktop | 1440 × 960 | messageSent | `#/messages/:messageId` |
| [177:12468](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=177-12468) | Message details · Tablet | 1024 × 960 | messageSent | `#/messages/:messageId` |
| [177:12515](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=177-12515) | Message details · Phone | 390 × 844 | messageSent | `#/messages/:messageId` |
| [177:12543](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=177-12543) | Inventory · Desktop | 1440 × 960 | inventory | `#/inventory` |
| [177:12612](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=177-12612) | Inventory · Tablet | 1024 × 960 | inventory | `#/inventory` |
| [177:12681](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=177-12681) | Inventory · Phone | 390 × 844 | inventory | `#/inventory` |
| [178:5354](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=178-5354) | Add stock · Desktop | 1440 × 960 | stock | `#/inventory/:itemId/add` |
| [178:5409](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=178-5409) | Add stock · Tablet | 1024 × 960 | stock | `#/inventory/:itemId/add` |
| [178:5464](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=178-5464) | Add stock · Phone | 390 × 844 | stock | `#/inventory/:itemId/add` |
| [178:5500](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=178-5500) | Inventory · Desktop | 1440 × 960 | stockSaved | `#/inventory` |
| [178:5572](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=178-5572) | Inventory · Tablet | 1024 × 960 | stockSaved | `#/inventory` |
| [178:5644](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=178-5644) | Inventory · Phone | 390 × 844 | stockSaved | `#/inventory` |
| [178:5697](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=178-5697) | Reports · Desktop | 1440 × 1061 | reports | `#/reports` |
| [178:5788](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=178-5788) | Reports · Tablet | 1024 × 960 | reports | `#/reports` |
| [178:5879](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=178-5879) | Reports · Phone | 390 × 844 | reports | `#/reports` |
| [178:9797](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=178-9797) | Daily patient log · Desktop | 1440 × 960 | reportPrint | `#/reports/daily/print` |
| [178:9860](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=178-9860) | Daily patient log · Tablet | 1024 × 960 | reportPrint | `#/reports/daily/print` |
| [178:9923](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=178-9923) | Daily patient log · Phone | 390 × 844 | reportPrint | `#/reports/daily/print` |
| [178:9967](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=178-9967) | My account · Desktop | 1440 × 960 | account | `#/account` |
| [178:10025](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=178-10025) | My account · Tablet | 1024 × 960 | account | `#/account` |
| [178:10083](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=178-10083) | My account · Phone | 390 × 844 | account | `#/account` |
| [178:10122](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=178-10122) | My account · Desktop | 1440 × 960 | passwordSaved | `#/account?result=password-changed` |
| [178:10183](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=178-10183) | My account · Tablet | 1024 × 960 | passwordSaved | `#/account?result=password-changed` |
| [178:10244](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=178-10244) | My account · Phone | 390 × 844 | passwordSaved | `#/account?result=password-changed` |
| [178:10286](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=178-10286) | Card not recognized · Desktop | 1440 × 960 | unknown | `#/intake/unknown` |
| [178:10328](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=178-10328) | Card not recognized · Tablet | 1024 × 960 | unknown | `#/intake/unknown` |
| [178:10370](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=178-10370) | Card not recognized · Phone | 390 × 844 | unknown | `#/intake/unknown` |
| [178:10393](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=178-10393) | A visit is already open · Desktop | 1440 × 960 | duplicate | `#/visits/:visitId?notice=already-open` |
| [178:10436](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=178-10436) | A visit is already open · Tablet | 1024 × 960 | duplicate | `#/visits/:visitId?notice=already-open` |
| [178:10479](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=178-10479) | A visit is already open · Phone | 390 × 844 | duplicate | `#/visits/:visitId?notice=already-open` |
| [178:10503](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=178-10503) | Visit could not be saved · Desktop | 1440 × 960 | saveError | `#/visits/:visitId?notice=save-error` |
| [178:10596](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=178-10596) | Visit could not be saved · Tablet | 1024 × 960 | saveError | `#/visits/:visitId?notice=save-error` |
| [178:10689](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=178-10689) | Visit could not be saved · Phone | 390 × 844 | saveError | `#/visits/:visitId?notice=save-error` |
| [178:10763](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=178-10763) | Today · Desktop | 1440 × 960 | empty | `#/today` |
| [178:10822](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=178-10822) | Today · Tablet | 1024 × 960 | empty | `#/today` |
| [178:10881](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=178-10881) | Today · Phone | 390 × 844 | empty | `#/today` |
| [178:10921](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=178-10921) | Menu · Desktop | 1440 × 960 | menu | `#/menu` |
| [178:10967](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=178-10967) | Menu · Tablet | 1024 × 960 | menu | `#/menu` |
| [178:11013](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=178-11013) | Menu · Phone | 390 × 844 | menu | `#/menu` |
| [178:11040](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=178-11040) | Supplies used · Desktop | 1440 × 960 | supplyPicker | `#/visits/:visitId/supplies` |
| [178:11088](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=178-11088) | Supplies used · Tablet | 1024 × 960 | supplyPicker | `#/visits/:visitId/supplies` |
| [178:11136](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=178-11136) | Supplies used · Phone | 390 × 844 | supplyPicker | `#/visits/:visitId/supplies` |
| [178:11165](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=178-11165) | Referral summary · Desktop | 1440 × 960 | referralPrint | `#/referrals/:referralId/print` |
| [178:11208](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=178-11208) | Referral summary · Tablet | 1024 × 960 | referralPrint | `#/referrals/:referralId/print` |
| [178:11251](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=178-11251) | Referral summary · Phone | 390 × 844 | referralPrint | `#/referrals/:referralId/print` |
| [179:5846](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=179-5846) | Record manual follow-up · Desktop | 1440 × 960 | manualMessage | `#/messages/:messageId/follow-up` |
| [179:5903](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=179-5903) | Record manual follow-up · Tablet | 1024 × 960 | manualMessage | `#/messages/:messageId/follow-up` |
| [179:5960](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=179-5960) | Record manual follow-up · Phone | 390 × 844 | manualMessage | `#/messages/:messageId/follow-up` |
| [179:5998](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=179-5998) | Follow-up recorded · Desktop | 1440 × 960 | manualSaved | `#/messages/:messageId` |
| [179:6058](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=179-6058) | Follow-up recorded · Tablet | 1024 × 960 | manualSaved | `#/messages/:messageId` |
| [179:6118](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=179-6118) | Follow-up recorded · Phone | 390 × 844 | manualSaved | `#/messages/:messageId` |
| [179:6159](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=179-6159) | Monthly summary · Desktop | 1440 × 960 | monthly | `#/reports/monthly` |
| [179:6215](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=179-6215) | Monthly summary · Tablet | 1024 × 960 | monthly | `#/reports/monthly` |
| [179:6271](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=179-6271) | Monthly summary · Phone | 390 × 844 | monthly | `#/reports/monthly` |
| [179:10154](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=179-10154) | Visits by complaint · Desktop | 1440 × 960 | complaints | `#/reports/complaints` |
| [179:10214](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=179-10214) | Visits by complaint · Tablet | 1024 × 960 | complaints | `#/reports/complaints` |
| [179:10274](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=179-10274) | Visits by complaint · Phone | 390 × 844 | complaints | `#/reports/complaints` |
| [179:10315](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=179-10315) | Frequent patients · Desktop | 1440 × 960 | frequent | `#/reports/frequent` |
| [179:10379](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=179-10379) | Frequent patients · Tablet | 1024 × 960 | frequent | `#/reports/frequent` |
| [179:10443](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=179-10443) | Frequent patients · Phone | 390 × 844 | frequent | `#/reports/frequent` |
| [179:10488](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=179-10488) | Low stock · Desktop | 1440 × 960 | inventoryLow | `#/inventory?stock=low` |
| [179:10534](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=179-10534) | Low stock · Tablet | 1024 × 960 | inventoryLow | `#/inventory?stock=low` |
| [179:10580](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=179-10580) | Low stock · Phone | 390 × 844 | inventoryLow | `#/inventory?stock=low` |
| [179:10607](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=179-10607) | Adjust stock · Desktop | 1440 × 960 | adjust | `#/inventory/:itemId/adjust` |
| [179:10659](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=179-10659) | Adjust stock · Tablet | 1024 × 960 | adjust | `#/inventory/:itemId/adjust` |
| [179:10711](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=179-10711) | Adjust stock · Phone | 390 × 844 | adjust | `#/inventory/:itemId/adjust` |
| [179:10744](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=179-10744) | Stock adjusted · Desktop | 1440 × 960 | adjustSaved | `#/inventory/:itemId` |
| [179:10799](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=179-10799) | Stock adjusted · Tablet | 1024 × 960 | adjustSaved | `#/inventory/:itemId` |
| [179:10854](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=179-10854) | Stock adjusted · Phone | 390 × 844 | adjustSaved | `#/inventory/:itemId` |
| [179:10890](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=179-10890) | Stock history · Desktop | 1440 × 960 | movements | `#/inventory/:itemId/history` |
| [179:10932](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=179-10932) | Stock history · Tablet | 1024 × 960 | movements | `#/inventory/:itemId/history` |
| [179:10974](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=179-10974) | Stock history · Phone | 390 × 844 | movements | `#/inventory/:itemId/history` |
| [179:10997](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=179-10997) | Visit completed · Desktop | 1440 × 960 | completedHome | `#/visits/:visitId` |
| [179:11044](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=179-11044) | Visit completed · Tablet | 1024 × 960 | completedHome | `#/visits/:visitId` |
| [179:11091](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=179-11091) | Visit completed · Phone | 390 × 844 | completedHome | `#/visits/:visitId` |
| [179:11119](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=179-11119) | Visit completed · Desktop | 1440 × 960 | completedTransfer | `#/visits/:visitId` |
| [179:11167](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=179-11167) | Visit completed · Tablet | 1024 × 960 | completedTransfer | `#/visits/:visitId` |
| [179:11215](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=179-11215) | Visit completed · Phone | 390 × 844 | completedTransfer | `#/visits/:visitId` |
| [179:11244](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=179-11244) | Visit completed · Desktop | 1440 × 960 | completedLeft | `#/visits/:visitId` |
| [179:11291](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=179-11291) | Visit completed · Tablet | 1024 × 960 | completedLeft | `#/visits/:visitId` |
| [179:11338](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=179-11338) | Visit completed · Phone | 390 × 844 | completedLeft | `#/visits/:visitId` |
| [179:11366](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=179-11366) | Leave this visit? · Desktop | 1440 × 960 | leave | `#/visits/:visitId?dialog=leave` |
| [179:11410](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=179-11410) | Leave this visit? · Tablet | 1024 × 960 | leave | `#/visits/:visitId?dialog=leave` |
| [179:11454](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=179-11454) | Leave this visit? · Phone | 390 × 844 | leave | `#/visits/:visitId?dialog=leave` |
| [179:11479](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=179-11479) | Please sign in again · Desktop | 1440 × 960 | expired | `#/session-ended` |
| [179:11515](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=179-11515) | Please sign in again · Tablet | 1024 × 960 | expired | `#/session-ended` |
| [179:11551](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=179-11551) | Please sign in again · Phone | 390 × 844 | expired | `#/session-ended` |
| [179:11568](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=179-11568) | No matching patient · Desktop | 1440 × 960 | noResults | `#/patients?q=:query` |
| [179:11607](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=179-11607) | No matching patient · Tablet | 1024 × 960 | noResults | `#/patients?q=:query` |
| [179:11646](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=179-11646) | No matching patient · Phone | 390 × 844 | noResults | `#/patients?q=:query` |
| [180:6290](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=180-6290) | Patient record · Desktop · Staff | 1440 × 960 | recordStaff | `#/patients/:patientId` |
| [180:6363](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=180-6363) | Patient record · Desktop · Visitor | 1440 × 960 | recordVisitor | `#/patients/:patientId` |
| [180:6436](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=180-6436) | Patient record · Tablet · Staff | 1024 × 960 | recordStaff | `#/patients/:patientId` |
| [180:6509](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=180-6509) | Patient record · Tablet · Visitor | 1024 × 960 | recordVisitor | `#/patients/:patientId` |
| [180:6582](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=180-6582) | Patient record · Phone · Staff | 390 × 844 | recordStaff | `#/patients/:patientId` |
| [180:6636](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=180-6636) | Patient record · Phone · Visitor | 390 × 844 | recordVisitor | `#/patients/:patientId` |
| [180:6690](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=180-6690) | New visit · Desktop · Staff | 1440 × 960 | visitFilledStaff | `#/visits/new?patient=:patientId` |
| [180:6780](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=180-6780) | New visit · Desktop · Visitor | 1440 × 960 | visitFilledVisitor | `#/visits/new?patient=:patientId` |
| [180:6870](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=180-6870) | New visit · Tablet · Staff | 1024 × 960 | visitFilledStaff | `#/visits/new?patient=:patientId` |
| [180:6960](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=180-6960) | New visit · Tablet · Visitor | 1024 × 960 | visitFilledVisitor | `#/visits/new?patient=:patientId` |
| [180:7050](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=180-7050) | New visit · Phone · Staff | 390 × 844 | visitFilledStaff | `#/visits/new?patient=:patientId` |
| [180:7121](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=180-7121) | New visit · Phone · Visitor | 390 × 844 | visitFilledVisitor | `#/visits/new?patient=:patientId` |
| [180:11038](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=180-11038) | Ongoing visit · Desktop · Staff | 1440 × 960 | savedStaff | `#/visits/:visitId` |
| [180:11131](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=180-11131) | Ongoing visit · Desktop · Visitor | 1440 × 960 | savedVisitor | `#/visits/:visitId` |
| [180:11224](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=180-11224) | Ongoing visit · Tablet · Staff | 1024 × 960 | savedStaff | `#/visits/:visitId` |
| [180:11317](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=180-11317) | Ongoing visit · Tablet · Visitor | 1024 × 960 | savedVisitor | `#/visits/:visitId` |
| [180:11410](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=180-11410) | Ongoing visit · Phone · Staff | 390 × 844 | savedStaff | `#/visits/:visitId` |
| [180:11484](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=180-11484) | Ongoing visit · Phone · Visitor | 390 × 844 | savedVisitor | `#/visits/:visitId` |
| [180:11558](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=180-11558) | Complete visit · Desktop · Staff | 1440 × 960 | completeStaff | `#/visits/:visitId/complete` |
| [180:11618](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=180-11618) | Complete visit · Desktop · Visitor | 1440 × 960 | completeVisitor | `#/visits/:visitId/complete` |
| [180:11678](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=180-11678) | Complete visit · Tablet · Staff | 1024 × 960 | completeStaff | `#/visits/:visitId/complete` |
| [180:11738](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=180-11738) | Complete visit · Tablet · Visitor | 1024 × 960 | completeVisitor | `#/visits/:visitId/complete` |
| [180:11798](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=180-11798) | Complete visit · Phone · Staff | 390 × 844 | completeStaff | `#/visits/:visitId/complete` |
| [180:11839](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=180-11839) | Complete visit · Phone · Visitor | 390 × 844 | completeVisitor | `#/visits/:visitId/complete` |
| [180:11880](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=180-11880) | Visit completed · Desktop · Staff | 1440 × 960 | completedStaff | `#/visits/:visitId` |
| [180:11929](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=180-11929) | Visit completed · Desktop · Visitor | 1440 × 960 | completedVisitor | `#/visits/:visitId` |
| [180:11978](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=180-11978) | Visit completed · Tablet · Staff | 1024 × 960 | completedStaff | `#/visits/:visitId` |
| [180:12027](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=180-12027) | Visit completed · Tablet · Visitor | 1024 × 960 | completedVisitor | `#/visits/:visitId` |
| [180:12076](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=180-12076) | Visit completed · Phone · Staff | 390 × 844 | completedStaff | `#/visits/:visitId` |
| [180:12106](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=180-12106) | Visit completed · Phone · Visitor | 390 × 844 | completedVisitor | `#/visits/:visitId` |
| [180:12136](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=180-12136) | Visit completed · Desktop · Staff | 1440 × 960 | completedHomeStaff | `#/visits/:visitId` |
| [180:12183](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=180-12183) | Visit completed · Desktop · Visitor | 1440 × 960 | completedHomeVisitor | `#/visits/:visitId` |
| [180:12230](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=180-12230) | Visit completed · Tablet · Staff | 1024 × 960 | completedHomeStaff | `#/visits/:visitId` |
| [180:12277](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=180-12277) | Visit completed · Tablet · Visitor | 1024 × 960 | completedHomeVisitor | `#/visits/:visitId` |
| [180:12324](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=180-12324) | Visit completed · Phone · Staff | 390 × 844 | completedHomeStaff | `#/visits/:visitId` |
| [180:12352](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=180-12352) | Visit completed · Phone · Visitor | 390 × 844 | completedHomeVisitor | `#/visits/:visitId` |
| [180:12380](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=180-12380) | Visit completed · Desktop · Staff | 1440 × 960 | completedTransferStaff | `#/visits/:visitId` |
| [180:12428](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=180-12428) | Visit completed · Desktop · Visitor | 1440 × 960 | completedTransferVisitor | `#/visits/:visitId` |
| [180:12476](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=180-12476) | Visit completed · Tablet · Staff | 1024 × 960 | completedTransferStaff | `#/visits/:visitId` |
| [180:12524](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=180-12524) | Visit completed · Tablet · Visitor | 1024 × 960 | completedTransferVisitor | `#/visits/:visitId` |
| [180:12572](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=180-12572) | Visit completed · Phone · Staff | 390 × 844 | completedTransferStaff | `#/visits/:visitId` |
| [180:12601](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=180-12601) | Visit completed · Phone · Visitor | 390 × 844 | completedTransferVisitor | `#/visits/:visitId` |
| [180:12630](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=180-12630) | Visit completed · Desktop · Staff | 1440 × 960 | completedLeftStaff | `#/visits/:visitId` |
| [180:12677](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=180-12677) | Visit completed · Desktop · Visitor | 1440 × 960 | completedLeftVisitor | `#/visits/:visitId` |
| [180:12724](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=180-12724) | Visit completed · Tablet · Staff | 1024 × 960 | completedLeftStaff | `#/visits/:visitId` |
| [180:12771](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=180-12771) | Visit completed · Tablet · Visitor | 1024 × 960 | completedLeftVisitor | `#/visits/:visitId` |
| [180:12818](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=180-12818) | Visit completed · Phone · Staff | 390 × 844 | completedLeftStaff | `#/visits/:visitId` |
| [180:12846](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=180-12846) | Visit completed · Phone · Visitor | 390 × 844 | completedLeftVisitor | `#/visits/:visitId` |
| [181:6878](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=181-6878) | Referral · Desktop · Staff | 1440 × 960 | preparedStaff | `#/referrals/:referralId` |
| [181:6932](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=181-6932) | Referral · Desktop · Visitor | 1440 × 960 | preparedVisitor | `#/referrals/:referralId` |
| [181:6986](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=181-6986) | Referral · Tablet · Staff | 1024 × 960 | preparedStaff | `#/referrals/:referralId` |
| [181:7040](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=181-7040) | Referral · Tablet · Visitor | 1024 × 960 | preparedVisitor | `#/referrals/:referralId` |
| [181:7094](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=181-7094) | Referral · Phone · Staff | 390 × 844 | preparedStaff | `#/referrals/:referralId` |
| [181:7129](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=181-7129) | Referral · Phone · Visitor | 390 × 844 | preparedVisitor | `#/referrals/:referralId` |
| [181:7164](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=181-7164) | Record contact · Desktop · Staff | 1440 × 960 | contactStaff | `#/referrals/:referralId/contact` |
| [181:7222](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=181-7222) | Record contact · Desktop · Visitor | 1440 × 960 | contactVisitor | `#/referrals/:referralId/contact` |
| [181:7280](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=181-7280) | Record contact · Tablet · Staff | 1024 × 960 | contactStaff | `#/referrals/:referralId/contact` |
| [181:7338](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=181-7338) | Record contact · Tablet · Visitor | 1024 × 960 | contactVisitor | `#/referrals/:referralId/contact` |
| [181:7396](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=181-7396) | Record contact · Phone · Staff | 390 × 844 | contactStaff | `#/referrals/:referralId/contact` |
| [181:7435](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=181-7435) | Record contact · Phone · Visitor | 390 × 844 | contactVisitor | `#/referrals/:referralId/contact` |
| [181:7474](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=181-7474) | Referral · Desktop · Staff | 1440 × 960 | waitingStaff | `#/referrals/:referralId` |
| [181:7531](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=181-7531) | Referral · Desktop · Visitor | 1440 × 960 | waitingVisitor | `#/referrals/:referralId` |
| [181:7588](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=181-7588) | Referral · Tablet · Staff | 1024 × 960 | waitingStaff | `#/referrals/:referralId` |
| [181:7645](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=181-7645) | Referral · Tablet · Visitor | 1024 × 960 | waitingVisitor | `#/referrals/:referralId` |
| [181:7702](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=181-7702) | Referral · Phone · Staff | 390 × 844 | waitingStaff | `#/referrals/:referralId` |
| [181:7740](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=181-7740) | Referral · Phone · Visitor | 390 × 844 | waitingVisitor | `#/referrals/:referralId` |
| [181:7778](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=181-7778) | Record doctor’s reply · Desktop · Staff | 1440 × 960 | replyStaff | `#/referrals/:referralId/reply` |
| [181:7833](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=181-7833) | Record doctor’s reply · Desktop · Visitor | 1440 × 960 | replyVisitor | `#/referrals/:referralId/reply` |
| [181:7888](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=181-7888) | Record doctor’s reply · Tablet · Staff | 1024 × 960 | replyStaff | `#/referrals/:referralId/reply` |
| [181:7943](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=181-7943) | Record doctor’s reply · Tablet · Visitor | 1024 × 960 | replyVisitor | `#/referrals/:referralId/reply` |
| [181:7998](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=181-7998) | Record doctor’s reply · Phone · Staff | 390 × 844 | replyStaff | `#/referrals/:referralId/reply` |
| [181:8034](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=181-8034) | Record doctor’s reply · Phone · Visitor | 390 × 844 | replyVisitor | `#/referrals/:referralId/reply` |
| [181:8070](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=181-8070) | Referral · Desktop · Staff | 1440 × 960 | adviceStaff | `#/referrals/:referralId` |
| [181:8128](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=181-8128) | Referral · Desktop · Visitor | 1440 × 960 | adviceVisitor | `#/referrals/:referralId` |
| [181:8186](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=181-8186) | Referral · Tablet · Staff | 1024 × 960 | adviceStaff | `#/referrals/:referralId` |
| [181:8244](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=181-8244) | Referral · Tablet · Visitor | 1024 × 960 | adviceVisitor | `#/referrals/:referralId` |
| [181:8302](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=181-8302) | Referral · Phone · Staff | 390 × 844 | adviceStaff | `#/referrals/:referralId` |
| [181:8341](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=181-8341) | Referral · Phone · Visitor | 390 × 844 | adviceVisitor | `#/referrals/:referralId` |
| [181:8380](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=181-8380) | Resolve follow-up · Desktop · Staff | 1440 × 960 | resolveStaff | `#/referrals/:referralId/resolve` |
| [181:8431](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=181-8431) | Resolve follow-up · Desktop · Visitor | 1440 × 960 | resolveVisitor | `#/referrals/:referralId/resolve` |
| [181:8482](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=181-8482) | Resolve follow-up · Tablet · Staff | 1024 × 960 | resolveStaff | `#/referrals/:referralId/resolve` |
| [181:8533](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=181-8533) | Resolve follow-up · Tablet · Visitor | 1024 × 960 | resolveVisitor | `#/referrals/:referralId/resolve` |
| [181:8584](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=181-8584) | Resolve follow-up · Phone · Staff | 390 × 844 | resolveStaff | `#/referrals/:referralId/resolve` |
| [181:8616](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=181-8616) | Resolve follow-up · Phone · Visitor | 390 × 844 | resolveVisitor | `#/referrals/:referralId/resolve` |
| [181:8648](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=181-8648) | Referral · Desktop · Staff | 1440 × 960 | resolvedStaff | `#/referrals/:referralId` |
| [181:8704](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=181-8704) | Referral · Desktop · Visitor | 1440 × 960 | resolvedVisitor | `#/referrals/:referralId` |
| [181:8760](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=181-8760) | Referral · Tablet · Staff | 1024 × 960 | resolvedStaff | `#/referrals/:referralId` |
| [181:8816](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=181-8816) | Referral · Tablet · Visitor | 1024 × 960 | resolvedVisitor | `#/referrals/:referralId` |
| [181:8872](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=181-8872) | Referral · Phone · Staff | 390 × 844 | resolvedStaff | `#/referrals/:referralId` |
| [181:8909](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=181-8909) | Referral · Phone · Visitor | 390 × 844 | resolvedVisitor | `#/referrals/:referralId` |
| [181:8946](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=181-8946) | Referral summary · Desktop · Staff | 1440 × 960 | referralPrintStaff | `#/referrals/:referralId/print` |
| [181:8989](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=181-8989) | Referral summary · Desktop · Visitor | 1440 × 960 | referralPrintVisitor | `#/referrals/:referralId/print` |
| [181:9032](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=181-9032) | Referral summary · Tablet · Staff | 1024 × 960 | referralPrintStaff | `#/referrals/:referralId/print` |
| [181:9075](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=181-9075) | Referral summary · Tablet · Visitor | 1024 × 960 | referralPrintVisitor | `#/referrals/:referralId/print` |
| [181:9118](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=181-9118) | Referral summary · Phone · Staff | 390 × 844 | referralPrintStaff | `#/referrals/:referralId/print` |
| [181:9142](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=181-9142) | Referral summary · Phone · Visitor | 390 × 844 | referralPrintVisitor | `#/referrals/:referralId/print` |
| [181:9166](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=181-9166) | Supplies used · Desktop · Staff | 1440 × 960 | supplyPickerStaff | `#/visits/:visitId/supplies` |
| [181:9214](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=181-9214) | Supplies used · Desktop · Visitor | 1440 × 960 | supplyPickerVisitor | `#/visits/:visitId/supplies` |
| [181:9262](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=181-9262) | Supplies used · Tablet · Staff | 1024 × 960 | supplyPickerStaff | `#/visits/:visitId/supplies` |
| [181:9310](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=181-9310) | Supplies used · Tablet · Visitor | 1024 × 960 | supplyPickerVisitor | `#/visits/:visitId/supplies` |
| [181:9358](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=181-9358) | Supplies used · Phone · Staff | 390 × 844 | supplyPickerStaff | `#/visits/:visitId/supplies` |
| [181:9387](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=181-9387) | Supplies used · Phone · Visitor | 390 × 844 | supplyPickerVisitor | `#/visits/:visitId/supplies` |
| [181:9416](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=181-9416) | Leave this visit? · Desktop · Staff | 1440 × 960 | leaveStaff | `#/visits/:visitId?dialog=leave` |
| [181:9460](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=181-9460) | Leave this visit? · Desktop · Visitor | 1440 × 960 | leaveVisitor | `#/visits/:visitId?dialog=leave` |
| [181:9504](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=181-9504) | Leave this visit? · Tablet · Staff | 1024 × 960 | leaveStaff | `#/visits/:visitId?dialog=leave` |
| [181:9548](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=181-9548) | Leave this visit? · Tablet · Visitor | 1024 × 960 | leaveVisitor | `#/visits/:visitId?dialog=leave` |
| [181:9592](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=181-9592) | Leave this visit? · Phone · Staff | 390 × 844 | leaveStaff | `#/visits/:visitId?dialog=leave` |
| [181:9617](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=181-9617) | Leave this visit? · Phone · Visitor | 390 × 844 | leaveVisitor | `#/visits/:visitId?dialog=leave` |
| [181:9642](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=181-9642) | A visit is already open · Desktop · Staff | 1440 × 960 | duplicateStaff | `#/visits/:visitId?notice=already-open` |
| [181:9685](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=181-9685) | A visit is already open · Desktop · Visitor | 1440 × 960 | duplicateVisitor | `#/visits/:visitId?notice=already-open` |
| [181:9728](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=181-9728) | A visit is already open · Tablet · Staff | 1024 × 960 | duplicateStaff | `#/visits/:visitId?notice=already-open` |
| [181:9771](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=181-9771) | A visit is already open · Tablet · Visitor | 1024 × 960 | duplicateVisitor | `#/visits/:visitId?notice=already-open` |
| [181:9814](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=181-9814) | A visit is already open · Phone · Staff | 390 × 844 | duplicateStaff | `#/visits/:visitId?notice=already-open` |
| [181:9838](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=181-9838) | A visit is already open · Phone · Visitor | 390 × 844 | duplicateVisitor | `#/visits/:visitId?notice=already-open` |
| [181:9862](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=181-9862) | Visit could not be saved · Desktop · Staff | 1440 × 960 | saveErrorStaff | `#/visits/:visitId?notice=save-error` |
| [181:9955](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=181-9955) | Visit could not be saved · Desktop · Visitor | 1440 × 960 | saveErrorVisitor | `#/visits/:visitId?notice=save-error` |
| [181:10048](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=181-10048) | Visit could not be saved · Tablet · Staff | 1024 × 960 | saveErrorStaff | `#/visits/:visitId?notice=save-error` |
| [181:10141](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=181-10141) | Visit could not be saved · Tablet · Visitor | 1024 × 960 | saveErrorVisitor | `#/visits/:visitId?notice=save-error` |
| [181:10234](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=181-10234) | Visit could not be saved · Phone · Staff | 390 × 844 | saveErrorStaff | `#/visits/:visitId?notice=save-error` |
| [181:10308](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=181-10308) | Visit could not be saved · Phone · Visitor | 390 × 844 | saveErrorVisitor | `#/visits/:visitId?notice=save-error` |
| [183:8876](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=183-8876) | Today · Visit saved · Student · 1440 | 1440 × 960 | todaySaved | `#/today` |
| [183:8951](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=183-8951) | Today · After completion · Student · 1440 | 1440 × 960 | todayCompleted | `#/today` |
| [183:9026](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=183-9026) | Today · Visit saved · Staff · 1440 | 1440 × 960 | todaySavedStaff | `#/today` |
| [183:9101](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=183-9101) | Today · After completion · Staff · 1440 | 1440 × 960 | todayCompletedStaff | `#/today` |
| [183:9176](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=183-9176) | Today · Visit saved · Visitor · 1440 | 1440 × 960 | todaySavedVisitor | `#/today` |
| [183:9259](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=183-9259) | Today · After completion · Visitor · 1440 | 1440 × 960 | todayCompletedVisitor | `#/today` |
| [183:13180](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=183-13180) | Today · Visit saved · Student · 1024 | 1024 × 960 | todaySaved | `#/today` |
| [183:13255](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=183-13255) | Today · After completion · Student · 1024 | 1024 × 960 | todayCompleted | `#/today` |
| [183:13330](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=183-13330) | Today · Visit saved · Staff · 1024 | 1024 × 960 | todaySavedStaff | `#/today` |
| [183:13405](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=183-13405) | Today · After completion · Staff · 1024 | 1024 × 960 | todayCompletedStaff | `#/today` |
| [183:13480](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=183-13480) | Today · Visit saved · Visitor · 1024 | 1024 × 960 | todaySavedVisitor | `#/today` |
| [183:13563](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=183-13563) | Today · After completion · Visitor · 1024 | 1024 × 960 | todayCompletedVisitor | `#/today` |
| [183:13638](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=183-13638) | Today · Visit saved · Student · 390 | 390 × 844 | todaySaved | `#/today` |
| [183:13694](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=183-13694) | Today · After completion · Student · 390 | 390 × 844 | todayCompleted | `#/today` |
| [183:13750](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=183-13750) | Today · Visit saved · Staff · 390 | 390 × 844 | todaySavedStaff | `#/today` |
| [183:13806](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=183-13806) | Today · After completion · Staff · 390 | 390 × 844 | todayCompletedStaff | `#/today` |
| [183:13862](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=183-13862) | Today · Visit saved · Visitor · 390 | 390 × 844 | todaySavedVisitor | `#/today` |
| [183:13926](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=183-13926) | Today · After completion · Visitor · 390 | 390 × 844 | todayCompletedVisitor | `#/today` |
| [185:7844](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=185-7844) | Start here · Clinic app | 1200 × 744 | guide | `README.md#design-reference` |
| [185:7866](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=185-7866) | Student care · Desktop, tablet, phone | 1000 × 39 | guide | `README.md#design-reference` |
| [185:7868](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=185-7868) | Staff care · Desktop, tablet, phone | 1000 × 39 | guide | `README.md#design-reference` |
| [185:7870](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=185-7870) | Visitor care · Desktop, tablet, phone | 1000 × 39 | guide | `README.md#design-reference` |
| [222:7953](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=222-7953) | Patients · Students · 1440 | 1440 × 960 | patientsStudent | `#/patients?type=student` |
| [222:11904](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=222-11904) | Patients · Students · 1024 | 1024 × 960 | patientsStudent | `#/patients?type=student` |
| [222:12009](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=222-12009) | Patients · Students · 390 | 390 × 844 | patientsStudent | `#/patients?type=student` |
| [225:7898](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=225-7898) | Messages · Inbox · 1440 | 1440 × 960 | messagesInbox | `#/messages` |
| [225:11853](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=225-11853) | Messages · Inbox · 1024 | 1024 × 960 | messagesInbox | `#/messages` |
| [225:11962](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=225-11962) | Messages · Inbox · 390 | 390 × 844 | messagesInbox | `#/messages` |
| [226:7937](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=226-7937) | Messages · Mara Santos · Returned to class · 1440 | 1440 × 1291 | nurseSummary | `#/messages/:messageId` |
| [226:8034](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=226-8034) | Messages · Mara Santos · Returned to class · 1024 | 1024 × 1291 | nurseSummary | `#/messages/:messageId` |
| [226:8131](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=226-8131) | Messages · Mara Santos · Returned to class · 390 | 390 × 844 | nurseSummary | `#/messages/:messageId` |
| [226:12036](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=226-12036) | Messages · Mara Santos · Sent home · 1440 | 1440 × 960 | nurseSummary | `#/messages/:messageId` |
| [226:12131](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=226-12131) | Messages · Mara Santos · Sent home · 1024 | 1024 × 960 | nurseSummary | `#/messages/:messageId` |
| [226:12226](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=226-12226) | Messages · Mara Santos · Sent home · 390 | 390 × 844 | nurseSummary | `#/messages/:messageId` |
| [226:12283](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=226-12283) | Messages · Mara Santos · Referred to an external facility · 1440 | 1440 × 960 | nurseSummary | `#/messages/:messageId` |
| [226:12379](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=226-12379) | Messages · Mara Santos · Referred to an external facility · 1024 | 1024 × 960 | nurseSummary | `#/messages/:messageId` |
| [226:12475](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=226-12475) | Messages · Mara Santos · Referred to an external facility · 390 | 390 × 844 | nurseSummary | `#/messages/:messageId` |
| [226:12533](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=226-12533) | Messages · Mara Santos · Left clinic after treatment · 1440 | 1440 × 960 | nurseSummary | `#/messages/:messageId` |
| [226:12628](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=226-12628) | Messages · Mara Santos · Left clinic after treatment · 1024 | 1024 × 960 | nurseSummary | `#/messages/:messageId` |
| [226:12723](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=226-12723) | Messages · Mara Santos · Left clinic after treatment · 390 | 390 × 844 | nurseSummary | `#/messages/:messageId` |
| [226:12780](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=226-12780) | Messages · Leo Cruz · Returned to work · 1440 | 1440 × 960 | nurseSummary | `#/messages/:messageId` |
| [226:12877](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=226-12877) | Messages · Ana Reyes · Left clinic after treatment · 1440 | 1440 × 960 | nurseSummary | `#/messages/:messageId` |
| [226:12974](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=226-12974) | Messages · Leo Cruz · Returned to work · 1024 | 1024 × 960 | nurseSummary | `#/messages/:messageId` |
| [226:13071](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=226-13071) | Messages · Ana Reyes · Left clinic after treatment · 1024 | 1024 × 960 | nurseSummary | `#/messages/:messageId` |
| [226:13168](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=226-13168) | Messages · Leo Cruz · Returned to work · 390 | 390 × 844 | nurseSummary | `#/messages/:messageId` |
| [226:13227](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=226-13227) | Messages · Ana Reyes · Left clinic after treatment · 390 | 390 × 844 | nurseSummary | `#/messages/:messageId` |
| [226:13286](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=226-13286) | Messages · Leo Cruz · Sent home · 1440 | 1440 × 960 | nurseSummary | `#/messages/:messageId` |
| [226:13381](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=226-13381) | Messages · Ana Reyes · Sent home · 1440 | 1440 × 960 | nurseSummary | `#/messages/:messageId` |
| [226:13476](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=226-13476) | Messages · Leo Cruz · Sent home · 1024 | 1024 × 960 | nurseSummary | `#/messages/:messageId` |
| [226:13571](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=226-13571) | Messages · Ana Reyes · Sent home · 1024 | 1024 × 960 | nurseSummary | `#/messages/:messageId` |
| [226:13666](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=226-13666) | Messages · Leo Cruz · Sent home · 390 | 390 × 844 | nurseSummary | `#/messages/:messageId` |
| [226:13723](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=226-13723) | Messages · Ana Reyes · Sent home · 390 | 390 × 844 | nurseSummary | `#/messages/:messageId` |
| [226:13780](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=226-13780) | Messages · Leo Cruz · Referred to an external facility · 1440 | 1440 × 960 | nurseSummary | `#/messages/:messageId` |
| [226:13876](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=226-13876) | Messages · Ana Reyes · Referred to an external facility · 1440 | 1440 × 960 | nurseSummary | `#/messages/:messageId` |
| [226:13972](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=226-13972) | Messages · Leo Cruz · Referred to an external facility · 1024 | 1024 × 960 | nurseSummary | `#/messages/:messageId` |
| [226:14068](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=226-14068) | Messages · Ana Reyes · Referred to an external facility · 1024 | 1024 × 960 | nurseSummary | `#/messages/:messageId` |
| [226:14164](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=226-14164) | Messages · Leo Cruz · Referred to an external facility · 390 | 390 × 844 | nurseSummary | `#/messages/:messageId` |
| [226:14222](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=226-14222) | Messages · Ana Reyes · Referred to an external facility · 390 | 390 × 844 | nurseSummary | `#/messages/:messageId` |
| [226:14280](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=226-14280) | Messages · Leo Cruz · Left clinic after treatment · 1440 | 1440 × 960 | nurseSummary | `#/messages/:messageId` |
| [226:14375](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=226-14375) | Messages · Ana Reyes · Left clinic after treatment · 1440 | 1440 × 960 | nurseSummary | `#/messages/:messageId` |
| [226:14470](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=226-14470) | Messages · Leo Cruz · Left clinic after treatment · 1024 | 1024 × 960 | nurseSummary | `#/messages/:messageId` |
| [226:14565](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=226-14565) | Messages · Ana Reyes · Left clinic after treatment · 1024 | 1024 × 960 | nurseSummary | `#/messages/:messageId` |
| [226:14660](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=226-14660) | Messages · Leo Cruz · Left clinic after treatment · 390 | 390 × 844 | nurseSummary | `#/messages/:messageId` |
| [226:14717](https://www.figma.com/design/j9OCbJk4L7CjZxtqbHbRAq/LVCC-Clinic-System?node-id=226-14717) | Messages · Ana Reyes · Left clinic after treatment · 390 | 390 × 844 | nurseSummary | `#/messages/:messageId` |

## Task 5 implementation route additions (19 October 2026)

The original frame inventory above is unchanged. These BRD-required desktop forms compose the inspected referral details/contact/resolution components; no separate Figma frame is claimed:

- `#/referrals/new?visit=:visitId` — prepare a referral against a saved visit.
- `#/referrals/:referralId/actions` — record an action or external transfer while follow-up continues.

Existing contact, reply, resolve and print routes follow their mapped desktop frames.

## Task 6 desktop implementation routes (19 October 2026)

The original frame inventory is unchanged. These desktop nodes were inspected with high-fidelity design context before implementation. Shared list/history/forms serve record-driven examples; no phone/tablet frame was compared in this task.

| Desktop Figma node | Runtime route |
| --- | --- |
| Inventory `177:12543` | `#/inventory` |
| Low stock `179:10488` | `#/inventory?stock=low` |
| Add stock `178:5354` | `#/inventory/add` and `#/inventory/:itemId/add` |
| Adjust stock `179:10607` | `#/inventory/:itemId/adjust` |
| Stock history `179:10890` | `#/inventory/:itemId/history` (`#/inventory/:itemId` also opens history) |
| Reports `178:5697` | `#/reports` |
| Daily print `178:9797` | `#/reports/daily/print` |
| Monthly summary `179:6159` | `#/reports/monthly` |
| Complaints `179:10154` | `#/reports/complaints` |
| Frequent patients `179:10315` | `#/reports/frequent` |

Reports retain query filters `from`, `to`, `type`, `complaint`. Each aggregate route supports `/print` using the same content and print styles. The date-range example becomes native From/To fields, and all counts come from saved records. Additional seeded supplies retain earlier visit-selector choices. No administration routes or catalog management were added. Existing fonts/icons are reused; no new remote asset is required.
