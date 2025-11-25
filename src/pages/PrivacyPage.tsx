import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PrivacyPage = () => {
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
              Privacy Policy
            </h1>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-slate-400 text-sm font-medium">
              <span>VOYA DAILY DRIVER SERVICE</span>
              <span className="hidden sm:inline">•</span>
              <span>Effective Date: 14 November 2025</span>
            </div>
          </div>

          {/* Content */}
          <div className="px-8 py-10 sm:px-12 space-y-10 text-slate-700 leading-relaxed">
            <Section title="1. Who We Are">
              <p>
                VOYA operates a premium daily driver and mobility concierge
                service in Lagos, Nigeria, providing clients with dedicated
                vehicles and drivers. This Privacy Policy applies to our Daily
                Driver Service and all related VOYA platforms, including our
                website, booking forms, WhatsApp channels, email communications,
                and any other official VOYA platforms used to deliver the
                Service.
              </p>
            </Section>

            <Section title="2. Information We Collect">
              <p>
                We collect information in three main ways: information you
                provide directly, information generated during service delivery,
                and limited information from third parties.
              </p>

              <div className="mt-4">
                <h3 className="font-semibold text-slate-900 mb-2">
                  2.1. Information You Provide Directly
                </h3>
                <p className="mb-2">
                  When you book or interact with VOYA, we may collect:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Full name</li>
                  <li>Phone number (including WhatsApp)</li>
                  <li>Email address</li>
                  <li>Company name (if applicable)</li>
                  <li>Pickup address and drop-off locations</li>
                  <li>Scheduled date and time of service</li>
                  <li>Requested vehicle type (Sedan/SUV; Petrol/EV)</li>
                  <li>
                    Special instructions (e.g., security sensitivities,
                    accessibility needs)
                  </li>
                  <li>
                    Payment confirmation details and transaction references
                    (where applicable)
                  </li>
                  <li>
                    Messages and communications sent via WhatsApp, email, or
                    forms
                  </li>
                </ul>
              </div>

              <div className="mt-4">
                <h3 className="font-semibold text-slate-900 mb-2">
                  2.2. Information Generated During Use of the Service
                </h3>
                <p className="mb-2">
                  During your booking and trip, we may process:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Trip start and end time</li>
                  <li>Odometer readings</li>
                  <li>Route and distance (km) travelled</li>
                  <li>Extra-kilometre calculations</li>
                  <li>
                    GPS location data from vehicles or driver apps (for
                    monitoring and safety)
                  </li>
                </ul>
                <p className="mt-2">
                  We may also maintain internal records of assigned driver IDs
                  and vehicle details for operational purposes.
                </p>
              </div>

              <div className="mt-4">
                <h3 className="font-semibold text-slate-900 mb-2">
                  2.3. Information from Third Parties
                </h3>
                <p className="mb-2">We may receive limited information from:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    Fleet partners or vehicle providers (e.g., vehicle
                    availability and status)
                  </li>
                  <li>
                    Payment processors (e.g., confirmation of payment,
                    transaction references)
                  </li>
                  <li>
                    Corporate clients or hotels that book on your behalf (e.g.,
                    your name and contact details)
                  </li>
                </ul>
              </div>
            </Section>

            <Section title="3. How We Use Your Information">
              <p>
                We use your information to provide, manage, and improve the
                Service. Specifically, we use it for:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Processing and confirming bookings</li>
                <li>Assigning drivers and vehicles</li>
                <li>
                  Sending booking confirmations, trip details, and updates
                </li>
                <li>
                  Monitoring trips (time and distance) for safety and billing
                </li>
                <li>
                  Calculating included kilometres and extra-kilometre charges
                </li>
                <li>Handling reschedules, cancellations, and refunds</li>
                <li>Responding to questions, feedback, and complaints</li>
                <li>
                  Investigating incidents, disputes, or claims related to the
                  Service
                </li>
                <li>
                  Complying with applicable laws, regulations, and law
                  enforcement requests
                </li>
                <li>
                  Analysing usage patterns to improve scheduling, operations,
                  and overall service quality
                </li>
              </ul>
            </Section>

            <Section title="4. Legal Basis for Processing">
              <p>
                Depending on the context, we process your personal data based
                on:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>
                  <strong>Contractual necessity</strong> – to perform our
                  obligations under your booking and deliver the Service you
                  requested.
                </li>
                <li>
                  <strong>Legitimate interests</strong> – to operate, secure,
                  and improve the Service (for example, GPS monitoring for
                  safety and billing, dispute resolution, analytics).
                </li>
                <li>
                  <strong>Legal obligation</strong> – to comply with legal,
                  regulatory, tax, or law enforcement requirements.
                </li>
                <li>
                  <strong>Consent</strong> – in specific cases where required
                  (for example, certain marketing communications), which you can
                  withdraw at any time.
                </li>
              </ul>
            </Section>

            <Section title="5. How We Share Your Information">
              <p>
                We share your information only when necessary and in controlled
                ways:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>
                  With drivers and internal operations staff who need your trip
                  details to deliver the Service (e.g., name, pickup address,
                  contact number).
                </li>
                <li>
                  With fleet partners or vehicle providers for dispatch,
                  maintenance, or replacement vehicles.
                </li>
                <li>
                  With payment processors and financial institutions to process
                  payments and refunds.
                </li>
                <li>
                  With IT, communication, and booking system providers that help
                  us run the Service (subject to appropriate confidentiality and
                  security).
                </li>
                <li>
                  With law enforcement, regulators, or legal advisers where
                  required by law or necessary to protect our rights, property,
                  safety, or that of others.
                </li>
              </ul>
            </Section>

            <Section title="6. Data Retention">
              <p>
                We retain your personal data only for as long as reasonably
                necessary to:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Provide the Service and manage bookings</li>
                <li>Comply with legal, tax, or regulatory requirements</li>
                <li>
                  Resolve disputes, enforce our Terms & Conditions, and protect
                  our rights
                </li>
              </ul>
              <p className="mt-2">
                After this period, we may delete your data or anonymise it so it
                can no longer be linked to you (for analytics and reporting).
                Different categories of data may be kept for different periods
                as required by law or business needs.
              </p>
            </Section>

            <Section title="7. Data Security">
              <p>
                We take reasonable technical and organisational measures to
                protect your personal data, including restricted access to
                booking records, secure digital storage, and controlled use of
                trip data. However, no system is completely secure, and we
                cannot guarantee absolute security of information transmitted
                over the internet or via third-party platforms (such as WhatsApp
                and email).
              </p>
            </Section>

            <Section title="8. Your Rights">
              <p>Subject to applicable law, you may have the right to:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Access the personal data we hold about you</li>
                <li>
                  Request correction of inaccurate or incomplete information
                </li>
                <li>
                  Request deletion of your personal data, where appropriate
                </li>
                <li>
                  Object to or request restriction of certain types of
                  processing
                </li>
                <li>
                  Withdraw consent where we rely on your consent (for example,
                  certain marketing)
                </li>
              </ul>
              <p className="mt-2">
                To exercise any of these rights, please contact us using the
                details in Section 10. We may need to verify your identity
                before responding to certain requests.
              </p>
            </Section>

            <Section title="9. Use of WhatsApp, Email & Third-Party Platforms">
              <p>
                We use WhatsApp and email as primary channels for booking
                confirmations, updates, support, cancellations, and other
                communications. These platforms are operated by third parties
                with their own privacy and security practices. While we take
                care in how we use them, your use of WhatsApp and email is also
                subject to those third-party terms and policies.
              </p>
            </Section>

            <Section title="10. Contact Details">
              <p>
                If you have questions about this Privacy Policy, your personal
                data, or wish to exercise your rights, please contact us at:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>
                  <strong>WhatsApp:</strong> +234 814 969 6918
                </li>
                <li>
                  <strong>Email:</strong> support@voyaapp.co
                </li>
              </ul>
            </Section>

            <Section title="11. Changes to This Privacy Policy">
              <p>
                We may update this Privacy Policy from time to time. Updated
                versions will be posted on our official platforms and may be
                communicated via email or messaging when changes are
                significant. Continued use of the Service after an update means
                you accept the revised Policy.
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

// Helper component for consistent section styling
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
