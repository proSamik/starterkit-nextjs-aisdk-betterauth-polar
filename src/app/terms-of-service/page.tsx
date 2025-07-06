export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Terms of Service
          </h1>

          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 leading-relaxed mb-6">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                1. Acceptance of Terms
              </h2>
              <p className="text-gray-700 leading-relaxed">
                By accessing and using Next.js Starter Kit, you accept and agree
                to be bound by the terms and provision of this agreement.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                2. Use License
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Permission is granted to temporarily download one copy of
                Next.js Starter Kit per device for personal, non-commercial
                transitory viewing only. This is the grant of a license, not a
                transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc ml-6 text-gray-700 leading-relaxed">
                <li>modify or copy the materials</li>
                <li>
                  use the materials for any commercial purpose or for any public
                  display (commercial or non-commercial)
                </li>
                <li>
                  attempt to decompile or reverse engineer any software
                  contained on Next.js Starter Kit
                </li>
                <li>
                  remove any copyright or other proprietary notations from the
                  materials
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                3. Disclaimer
              </h2>
              <p className="text-gray-700 leading-relaxed">
                The materials on Next.js Starter Kit are provided on an &apos;as
                is&apos; basis. Next.js Starter Kit makes no warranties,
                expressed or implied, and hereby disclaims and negates all other
                warranties including without limitation, implied warranties or
                conditions of merchantability, fitness for a particular purpose,
                or non-infringement of intellectual property or other violation
                of rights.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                4. Limitations
              </h2>
              <p className="text-gray-700 leading-relaxed">
                In no event shall Next.js Starter Kit or its suppliers be liable
                for any damages (including, without limitation, damages for loss
                of data or profit, or due to business interruption) arising out
                of the use or inability to use Next.js Starter Kit, even if
                Next.js Starter Kit or an Next.js Starter Kit authorized
                representative has been notified orally or in writing of the
                possibility of such damage. Because some jurisdictions do not
                allow limitations on implied warranties, or limitations of
                liability for consequential or incidental damages, these
                limitations may not apply to you.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                5. Accuracy of Materials
              </h2>
              <p className="text-gray-700 leading-relaxed">
                The materials appearing on our website could include technical,
                typographical, or photographic errors. We do not warrant that
                any of the materials on our website are accurate, complete, or
                current. We may make changes to the materials contained on our
                website at any time without notice. However, we do not make any
                commitment to update the materials.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                6. Links
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We have not reviewed all of the sites linked to our website and
                are not responsible for the contents of any such linked site.
                The inclusion of any link does not imply endorsement by us of
                the site. Use of any such linked website is at the user&apos;s
                own risk.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                7. Modifications
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We may revise these terms of service at any time without notice.
                By using this website, you are agreeing to be bound by the then
                current version of these terms of service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                8. Governing Law
              </h2>
              <p className="text-gray-700 leading-relaxed">
                These terms and conditions are governed by and construed in
                accordance with the laws and you irrevocably submit to the
                exclusive jurisdiction of the courts in that state or location.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                9. Privacy Policy
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Your privacy is important to us. Please review our Privacy
                Policy, which also governs your use of our services, to
                understand our practices.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                10. Changes to Terms
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Next.js Starter Kit reserves the right, at its sole discretion,
                to modify or replace these Terms at any time. If a revision is
                material, we will try to provide at least 30 days notice prior
                to any new terms taking effect.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                11. Contact Information
              </h2>
              <p className="text-gray-700 leading-relaxed">
                If you have any questions about these Terms of Service, please
                contact us at support@your-domain.com.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
