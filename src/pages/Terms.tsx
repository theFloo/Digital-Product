// import { useEffect } from 'react';
// import { Helmet } from 'react-helmet-async';

// const Terms = () => {
//   // Auto scroll to top when component mounts
//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, []);

//   return (
//     <>
//       <Helmet>
//   <title>Terms and Conditions | THE FLOO CREATIVE MARKETING AGENCY</title>
//   <meta name="description" content="Read the Terms and Conditions of THE FLOO CREATIVE MARKETING AGENCY. For any queries, contact us at digital.districtofficial@gmail.com" />
// </Helmet>

//       <main className="max-w-4xl mx-auto px-4 py-10">
//         <h1 className="text-2xl font-bold mb-2 text-center">Terms and Conditions</h1>
//         <h2 className="text-3xl font-bold mb-8 text-center">  THE FLOO CREATIVE MARKETING AGENCY</h2>
        
//         <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
//           <p className="text-sm text-gray-500 mb-6">Last updated: January 2025</p>
          
//           <section>
//             <h2 className="text-2xl font-semibold mb-4 text-gray-900">1. Acceptance of Terms</h2>
//             <p>
//               By accessing and using The Floo Hub's services, you accept and agree to be bound by the terms 
//               and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
//             </p>
//           </section>

//           <section>
//             <h2 className="text-2xl font-semibold mb-4 text-gray-900">2. Digital Products</h2>
//             <p>
//               We sell digital products including databases, courses, and premium data assets. All products are 
//               delivered electronically via email immediately after successful payment confirmation.
//             </p>
//             <ul className="list-disc list-inside ml-4 space-y-2">
//               <li>Products include commercial license for resale rights</li>
//               <li>Lifetime access to purchased products</li>
//               <li>Products are delivered in digital format only</li>
//               <li>No physical shipping is involved</li>
//             </ul>
//           </section>

//           <section>
//             <h2 className="text-2xl font-semibold mb-4 text-gray-900">3. Payment Terms</h2>
//             <p>
//               All payments are processed securely through Razorpay. We accept major credit cards, debit cards, 
//               and UPI payments. Prices are listed in Indian Rupees (INR).
//             </p>
//             <ul className="list-disc list-inside ml-4 space-y-2">
//               <li>Payment is required before product delivery</li>
//               <li>All transactions are secure and encrypted</li>
//               <li>Prices may change without prior notice</li>
//             </ul>
//           </section>

//           <section>
//             <h2 className="text-2xl font-semibold mb-4 text-gray-900">4. Refund Policy</h2>
//             <p>
//               Due to the digital nature of our products, all sales are final. Refunds are only considered in 
//               exceptional circumstances such as duplicate purchases or technical issues preventing download.
//             </p>
//           </section>

//           <section>
//             <h2 className="text-2xl font-semibold mb-4 text-gray-900">5. License and Usage Rights</h2>
//             <p>
//               Upon purchase, you receive a commercial license that allows you to:
//             </p>
//             <ul className="list-disc list-inside ml-4 space-y-2">
//               <li>Use the products for personal and commercial purposes</li>
//               <li>Resell the products with appropriate licensing</li>
//               <li>Modify and customize the products as needed</li>
//               <li>Access lifetime updates when available</li>
//             </ul>
//           </section>

//           <section>
//             <h2 className="text-2xl font-semibold mb-4 text-gray-900">6. Prohibited Uses</h2>
//             <p>You may not use our products for:</p>
//             <ul className="list-disc list-inside ml-4 space-y-2">
//               <li>Illegal activities or purposes</li>
//               <li>Spamming or unsolicited marketing</li>
//               <li>Violating privacy laws or regulations</li>
//               <li>Redistributing without proper licensing</li>
//             </ul>
//           </section>

//           <section>
//             <h2 className="text-2xl font-semibold mb-4 text-gray-900">7. Privacy and Data Protection</h2>
//             <p>
//               We respect your privacy and are committed to protecting your personal information. 
//               We collect only necessary information for order processing and product delivery.
//             </p>
//           </section>

//           <section>
//             <h2 className="text-2xl font-semibold mb-4 text-gray-900">8. Limitation of Liability</h2>
//             <p>
//               Digital Hub shall not be liable for any indirect, incidental, special, consequential, 
//               or punitive damages resulting from your use of our products or services.
//             </p>
//           </section>

//          <section>
//   <h2 className="text-2xl font-semibold mb-4 text-gray-900">
//     9. Contact Information
//   </h2>
//   <p>
//     For questions about these Terms and Conditions, please contact us at:
//   </p>
//   <p className="font-semibold">
//     THE FLOO CREATIVE MARKETING AGENCY
//   </p>
//   <p className="font-semibold">
//     Email: digital.districtofficial@gmail.com
//   </p>
// </section>


//           <section>
//             <h2 className="text-2xl font-semibold mb-4 text-gray-900">10. Changes to Terms</h2>
//             <p>
//               We reserve the right to modify these terms at any time. Changes will be effective immediately 
//               upon posting on this page. Your continued use of our services constitutes acceptance of any changes.
//             </p>
//           </section>
//         </div>
//       </main>
//     </>
//   );
// };

// export default Terms;

import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

const Terms = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>Terms and Conditions | THE FLOO CREATIVE MARKETING AGENCY</title>
        <meta
          name="description"
          content="Read the Terms and Conditions of THE FLOO CREATIVE MARKETING AGENCY. For queries, contact digital.districtofficial@gmail.com"
        />
      </Helmet>

      <main className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-2 text-center">
          Terms and Conditions
        </h1>
        <h2 className="text-3xl font-bold mb-8 text-center">
          THE FLOO CREATIVE MARKETING AGENCY
        </h2>

        <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
          <p className="text-sm text-gray-500 mb-6">
            Last updated: January 2025
          </p>

          {/* 1 */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing and using THE FLOO CREATIVE MARKETING AGENCY’s website
              and services, you agree to be bound by these Terms and Conditions.
              If you do not agree with any part of these Terms, please do not use
              our services.
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">
              2. Nature of Products
            </h2>
            <p>
              THE FLOO CREATIVE MARKETING AGENCY offers <strong>digital products</strong>,
              including downloadable digital books, guides, and creative resources.
              All products are delivered electronically. We do not sell or ship
              physical books or goods.
            </p>
            <ul className="list-disc list-inside ml-4 space-y-2">
              <li>All products are digital and non-tangible</li>
              <li>No physical delivery or shipping is involved</li>
              <li>Access details are provided after successful payment</li>
            </ul>
          </section>

          {/* 3 */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">
              3. Pricing and Payment
            </h2>
            <p>
              All prices are listed in Indian Rupees (INR). Payments are processed
              securely through Razorpay using supported payment methods.
            </p>
            <ul className="list-disc list-inside ml-4 space-y-2">
              <li>Full payment must be completed before access is granted</li>
              <li>Prices may change without prior notice</li>
              <li>Applicable taxes, if any, are included or shown at checkout</li>
            </ul>
          </section>

          {/* 4 */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">
              4. Delivery of Digital Products
            </h2>
            <p>
              Upon successful payment, digital products are delivered
              electronically via download links, email, or user account access.
            </p>
            <ul className="list-disc list-inside ml-4 space-y-2">
              <li>Delivery is usually instant or within a short period</li>
              <li>Users are responsible for providing a valid email address</li>
              <li>
                We are not responsible for non-delivery due to incorrect contact
                details provided by the user
              </li>
            </ul>
          </section>

          {/* 5 */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">
              5. Cancellation, Refunds, and Returns
            </h2>
            <p>
              As we provide digital products, cancellations and returns are
              generally not permitted once the product has been accessed or
              downloaded.
            </p>
            <ul className="list-disc list-inside ml-4 space-y-2">
              <li>No refunds after successful delivery of digital content</li>
              <li>
                Refunds may be considered only in cases of duplicate payment or
                non-delivery due to technical issues
              </li>
              <li>
                Refund requests must be raised within a reasonable time by
                contacting customer support
              </li>
            </ul>
          </section>

          {/* 6 */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">
              6. User Responsibilities
            </h2>
            <p>You agree not to:</p>
            <ul className="list-disc list-inside ml-4 space-y-2">
              <li>Provide false, inaccurate, or misleading information</li>
              <li>Share, resell, or distribute digital products unlawfully</li>
              <li>Attempt to misuse, hack, or disrupt the website or services</li>
              <li>Engage in any fraudulent or illegal activities</li>
            </ul>
          </section>

          {/* 7 */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">
              7. Intellectual Property
            </h2>
            <p>
              All digital products, content, text, graphics, and materials
              available on this website are the intellectual property of
              THE FLOO CREATIVE MARKETING AGENCY and are protected by applicable
              copyright and intellectual property laws.
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">
              8. Privacy
            </h2>
            <p>
              Your use of our services is governed by our Privacy Policy. Please
              review it to understand how we collect, use, and protect your data.
            </p>
          </section>

          {/* 9 */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">
              9. Limitation of Liability
            </h2>
            <p>
              THE FLOO CREATIVE MARKETING AGENCY shall not be liable for any
              indirect, incidental, consequential, or special damages arising
              from the use of our website or digital products.
            </p>
          </section>

          {/* 10 */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">
              10. Changes to Terms
            </h2>
            <p>
              We reserve the right to update or modify these Terms and Conditions
              at any time. Continued use of the website constitutes acceptance
              of the revised Terms.
            </p>
          </section>

          {/* 11 */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">
              11. Contact Information
            </h2>
            <p>
              For any questions regarding these Terms and Conditions, please
              contact us:
            </p>
            <p className="font-semibold">
              THE FLOO CREATIVE MARKETING AGENCY
            </p>
            <p className="font-semibold">
              Email: digital.districtofficial@gmail.com
            </p>
          </section>
        </div>
      </main>
    </>
  );
};

export default Terms;

