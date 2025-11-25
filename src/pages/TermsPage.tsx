import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TermsPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link to="/">
            <Button
              variant="ghost"
              className="-ml-4 text-slate-500 hover:text-slate-900 hover:bg-slate-200/50"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="bg-slate-900 px-8 py-10 sm:px-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
              Terms & Conditions
            </h1>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-slate-400 text-sm font-medium">
              <span>VOYA DAILY DRIVER SERVICE</span>
              <span className="hidden sm:inline">•</span>
              <span>Effective Date: 14 November 2025</span>
            </div>
          </div>

          {/* Content */}
          <div className="px-8 py-10 sm:px-12 space-y-10 text-slate-700 leading-relaxed">
            <Section title="1. Service Description">
              <p>
                1.1. VOYA provides a dedicated vehicle and professional driver
                for a continuous 12-hour period within Lagos State only.
              </p>
              <div className="mt-2">
                <p>1.2. VOYA operates two vehicle categories:</p>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>Sedans (Petrol or Electric Vehicle – EV)</li>
                  <li>SUVs (Petrol or Electric Vehicle – EV)</li>
                </ul>
              </div>
              <div className="mt-2">
                <p>1.3. Each booking includes:</p>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>1 dedicated driver</li>
                  <li>
                    1 assigned vehicle (Sedan or SUV, in Petrol or EV variant)
                  </li>
                  <li>12 consecutive hours from the agreed start time</li>
                  <li>100 km of included travel distance within Lagos State</li>
                </ul>
              </div>
              <p>
                1.4. Travel outside Lagos State is not permitted under this
                Service.
              </p>
            </Section>

            <Section title="2. Booking, Payment & Confirmation">
              <p>
                2.1. <strong>Standard Bookings – 24 Hours’ Notice:</strong> All
                standard bookings must be made at least 24 hours before the
                requested start time.
              </p>
              <p>
                2.2. <strong>Non-Compliance with 24-Hour Rule:</strong> Bookings
                made without observing the 24-hour rule will, by default, be
                scheduled to start the next day (same start time), unless the
                Client opts to pay the applicable rush or instant booking fee.
              </p>
              <div className="mt-2">
                <p>
                  2.3. <strong>Rush & Instant Booking Fees:</strong>
                </p>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>
                    Bookings within 24 hours of the requested start time attract
                    a ₦50,000 rush fee.
                  </li>
                  <li>
                    Bookings requested for 90 minutes or less from the required
                    start time attract a ₦100,000 instant booking fee.
                  </li>
                </ul>
              </div>
              <p>
                2.4. <strong>Payment & Confirmation:</strong> Payment validates
                booking. A booking is considered confirmed only after VOYA has
                received and confirmed full payment (base fare plus any
                applicable rush/instant fee). Service will not commence without
                confirmed payment.
              </p>
            </Section>

            <Section title="3. Duration & Service Window">
              <p>
                3.1. Each booking covers a continuous 12-hour service window
                starting from the agreed start time.
              </p>
              <p>
                3.2. The 12-hour period cannot be paused, split, or carried over
                to another day.
              </p>
              <p>
                3.3. At the end of the 12 hours, the driver may end the service
                as scheduled, or agree, at their sole discretion, to continue
                for extended hours under new terms agreed between VOYA and the
                Client, including additional charges.
              </p>
            </Section>

            <Section title="4. Distance, Kilometres Included & Extra-Km Charges">
              <p>
                4.1. Each 12-hour booking includes 100 km of travel within Lagos
                State.
              </p>
              <p>
                4.2. Distance is measured by: (a) the vehicle’s odometer
                readings (start and end), and/or (b) VOYA’s GPS tracking
                records.
              </p>
              <p>
                4.3. If odometer and GPS records differ by more than 3%, VOYA’s
                liaison will review the data and determine the final billable
                kilometres. The liaison’s decision will be final.
              </p>
              <div className="mt-2">
                <p>
                  4.4. If total distance exceeds 100 km, extra-km charges apply
                  per additional kilometre as follows:
                </p>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>Sedans (Petrol or EV): ₦3,000 per km</li>
                  <li>SUVs (Petrol or EV): ₦5,000 per km</li>
                </ul>
              </div>
              <p>
                4.5. Extra-km charges are calculated at the end of the Service
                and are payable before the booking is closed. VOYA may withhold
                completion documents or future bookings until settlement of
                these charges.
              </p>
              <p>
                4.6. The Client acknowledges that extra-km rates are set to
                cover fuel/energy costs, wear and tear, time in Lagos traffic,
                and operational overheads.
              </p>
            </Section>

            <Section title="5. Operating Zone – Lagos Only">
              <p>5.1. The Service operates strictly within Lagos State.</p>
              <p>
                5.2. The driver is not permitted to cross Lagos State boundaries
                under this Service.
              </p>
              <p>
                5.3. The driver and/or VOYA may decline routes or stops that are
                unsafe, illegal, or clearly unreasonable.
              </p>
            </Section>

            <Section title="6. Vehicle Types, Age & Availability">
              <p>
                6.1. VOYA deploys Sedans (Petrol and EV) and SUVs (Petrol and
                EV) across model years 2023–2025.
              </p>
              <p>
                6.2. VOYA will use reasonable efforts to assign a vehicle that
                matches the Client’s requested category (Sedan vs SUV, Petrol vs
                EV where specifically requested); however, specific models,
                colours, or plates cannot be guaranteed.
              </p>
              <p>
                6.3. All vehicle assignments are subject to availability,
                operational status, and safety considerations at the time of
                dispatch.
              </p>
            </Section>

            <Section title="7. Liaison & Support">
              <div className="mt-2">
                <p>
                  7.1. VOYA will assign a Fleet Liaison or Operations Contact,
                  responsible for:
                </p>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>
                    Dispatching vehicles and drivers after booking confirmation
                  </li>
                  <li>Sharing driver and vehicle details with the Client</li>
                  <li>
                    Monitoring service progress and handling operational issues
                  </li>
                  <li>Reviewing and resolving mileage discrepancies</li>
                  <li>Confirming extra-km charges</li>
                  <li>
                    Coordinating replacement vehicles in case of breakdowns or
                    major issues
                  </li>
                </ul>
              </div>
              <p>
                7.2. For urgent assistance or updates, the Client may contact
                VOYA via WhatsApp at <strong>+234 814 969 6918</strong>, or
                through any other official VOYA communication channel.
              </p>
            </Section>

            <Section title="8. Client Obligations">
              <div className="mt-2">
                <p>8.1. The Client agrees to:</p>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>
                    Treat the driver and all VOYA staff with respect and
                    professionalism
                  </li>
                  <li>
                    Refrain from abusive, threatening, or harassing behaviour
                  </li>
                  <li>
                    Not request illegal, unsafe, or unethical activities or
                    routes
                  </li>
                  <li>
                    Ensure all requested destinations are within Lagos State
                  </li>
                </ul>
              </div>
              <p>
                8.2. The Client is responsible for personal belongings. VOYA is
                not liable for loss, theft, or damage to items left in the
                vehicle.
              </p>
              <p>
                8.3. Any damage to the vehicle (interior or exterior) caused by
                the Client or their party through negligence, misconduct, or
                misuse will be billed to the Client, including repair costs and
                reasonable loss-of-use or downtime costs.
              </p>
            </Section>

            <Section title="9. Driver Conduct & Safety">
              <p>
                9.1. VOYA drivers must comply with all road traffic laws and
                safety regulations, operate vehicles responsibly and
                professionally, and may decline routes or stops that are unsafe,
                illegal, or conflict with VOYA policy.
              </p>
              <p>
                9.2. If the Client or their guests engage in abusive, dangerous,
                or illegal behaviour, the driver may, after contacting VOYA,
                terminate the Service immediately.
              </p>
              <p>
                9.3. In such cases, no refund will be due, and any outstanding
                extra-km or damage charges will remain payable by the Client.
              </p>
            </Section>

            <Section title="10. Rescheduling, Cancellations & Refunds">
              <p>
                10.1. <strong>Rescheduling by Client:</strong> The Client may
                request to reschedule a confirmed booking up to 6 hours before
                the start time, subject to vehicle and driver availability. VOYA
                is not obligated to accept reschedule requests made less than 6
                hours before the start time.
              </p>
              <p>
                10.2. <strong>Cancellations by Client:</strong> Client-initiated
                cancellations are eligible for a refund, subject to a 15%
                cancellation fee deducted from the total amount paid.
                Cancellation requests must be submitted in writing via WhatsApp
                to +234 814 969 6918 or via email to support@voyaapp.co. The
                refund (minus the 15% fee) will be processed within a reasonable
                period. Any rush or instant booking fees paid are
                non-refundable.
              </p>
              <p>
                10.3. <strong>Non-Availability / Cancellation by VOYA:</strong>{' '}
                If VOYA is unable to provide a vehicle and driver within the
                agreed time window for a confirmed and paid booking (including
                standard, rush, or instant bookings), and no suitable
                alternative can be arranged, VOYA will issue a full refund of
                the amount paid for that booking. This refund represents VOYA’s
                entire liability in respect of that booking. VOYA will not be
                responsible for any indirect or consequential losses (e.g.,
                missed meetings, flights, or events).
              </p>
              <p>
                10.4. <strong>Delays Outside VOYA’s Control:</strong> VOYA is
                not liable for delays caused by heavy traffic, road closures,
                weather conditions, law enforcement operations, or other events
                beyond VOYA’s reasonable control.
              </p>
            </Section>

            <Section title="11. Liability & Disclaimers">
              <p>
                11.1. Road travel carries inherent risks. While VOYA exercises
                due care in selecting and supervising drivers and vehicles, it
                cannot fully control third-party incidents, traffic, or security
                conditions.
              </p>
              <p>
                11.2. To the maximum extent permitted by law, VOYA’s total
                liability for any claim arising out of or in connection with a
                booking (including negligence) is limited to the total amount
                paid by the Client for that specific booking.
              </p>
              <p>
                11.3. VOYA will not be liable for any indirect, incidental,
                special, or consequential damages, including loss of profits,
                loss of business opportunities, or missed engagements.
              </p>
            </Section>

            <Section title="12. Data Protection & Privacy">
              <p>
                12.1. VOYA collects and processes Client data (name, contact
                details, trip information, etc.) for processing bookings and
                payments, coordinating drivers and vehicles, providing support,
                and improving services.
              </p>
              <p>
                12.2. VOYA will not sell Client data to unauthorised third
                parties. Limited sharing may occur where necessary for Service
                delivery (e.g., providing pickup details to a driver) or where
                required by law or regulation.
              </p>
              <p>
                12.3. VOYA may use anonymized or aggregated data for analytics,
                reporting, and service improvements.
              </p>
            </Section>

            <Section title="13. Amendments">
              <p>
                13.1. VOYA reserves the right to amend or update these Terms at
                any time.
              </p>
              <p>
                13.2. Updated Terms will be published on VOYA’s official
                platforms and/or communicated via email or messaging channels.
                Continued use of the Service after such updates constitutes
                acceptance of the new Terms.
              </p>
            </Section>

            <Section title="14. Governing Law & Dispute Resolution">
              <p>
                14.1. These Terms are governed by the laws of the Federal
                Republic of Nigeria, with primary reference to matters arising
                in Lagos State.
              </p>
              <p>
                14.2. In case of dispute, VOYA and the Client will first attempt
                amicable resolution through negotiation.
              </p>
              <p>
                14.3. If no resolution is reached, the dispute may be referred
                to mediation or arbitration in Lagos, as mutually agreed.
              </p>
            </Section>
          </div>
        </div>

        {/* Footer note */}
        <div className="mt-8 text-center text-slate-400 text-sm">
          &copy; {new Date().getFullYear()} Voya. All rights reserved.
        </div>
      </div>
    </div>
  );
};

// Helper component for clean sections
const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <section className="space-y-3">
    <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-2 mb-4">
      {title}
    </h2>
    <div className="text-base text-slate-600 space-y-3">{children}</div>
  </section>
);
