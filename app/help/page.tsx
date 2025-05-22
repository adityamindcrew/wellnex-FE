"use client";
import Image from "next/image"
import { Button } from "@/components/ui/button"
import logo from '../assets/images/logo.png';
import AI from '../assets/images/AI.png';
import Relume from '../assets/images/Relume.png';
import Mobile from '../assets/images/Mobile.png';
import ContactForm from "@/components/contact-form";
import FeatureCard from "@/components/feature-card";
import Footer from "@/components/footer";
import Map from '../assets/images/map.png';
import robot from '../assets/images/robot.png';
import featureAI from '../assets/images/featureAI.png';

import { usePathname } from "next/navigation";
import Header from "@/components/ui/header";
export default function HelpPage() {

  const pathname = usePathname();
  return (
    <main className="min-h-screen bg-white">

      <Header />


      <section className="bg-white rounded-xl shadow-sm mt-16 p-8">
        <h1 className="text-2xl md:text-4xl font-bold text-black text-center mb-1">
          How to Install the WellnexAI Chatbot on Your Website
        </h1>
        <span className="block text-sm text-[#666] text-center mt-1 mb-4 mt-4">
          Once you've customized your chatbot, installing it on your site is simple. Follow the instructions below based on the platform you're using.
        </span>
        <div className="max-w-2xl mx-auto mt-4">
          <h2 className="text-lg font-semibold mb-2 mt-20">📝 Step 1: Copy Your Unique Embed Code</h2>
          <span className="block text-[#000000] mb-3">
            You'll receive a code like this:
          </span>
          <pre className="bg-gray-100 rounded p-4 text-sm mb-4 overflow-x-auto"><code>{`<script src="https://embed.wellnexai.com/chatbot.js?bot=YOURID"></script>`}</code></pre>
          <p className="mb-4 text-[#000000]">Copy the entire line above.</p>

          <h2 className="text-lg font-semibold mb-2">🔄 2. Clear your cache and refresh</h2>
          <ul className="list-disc pl-6 mb-4 text-[#000000]">
            <li>Sometimes,browser or site caching can delay updates.</li>
            <li>Try clearing your browser cache or open your site in an incognito/private window.</li>
            <li>If you're using a site builder with a "Publish" button, make sure you've clicked it after adding the code..</li>
          </ul>

          <h2 className="text-lg font-semibold mb-2">🌐 Platform-Specific Instructions</h2>

          <h3 className="font-medium mt-4 mb-1"><li>🔹 Squarespace </li></h3>
          <div>
            a. Go to your Squarespace dashboard.<br />
            b. Click on Settings &gt; Advanced &gt; Code Injection.<br />
            c. Scroll to the Footer section.<br />
            d. Paste your embed code here.<br />
            e. Click Save.<br />
            ✔️ Your chatbot will now appear on every page.
          </div>

          <h3 className="font-medium mt-4 mb-1">🔹 WordPress</h3>
          <div>
           <li>Option A: Using Elementor:</li>
            a. Open the page in Elementor where you want to place the chatbot. .<br />
            b. Drag the HTML widget to the bottom of the page<br />
            c. Paste the code into the widget. .<br />
            d. Click Update. <br />
            <br />
            <li>Option B : Manual Theme Install:</li>
            <br />
            a. Go to your WordPress Dashboard. .<br />
            b. Navigate to Appearance &gt Theme File Editor.<br />
            c. Select the footer.php file.<br />
            d. Paste the embed code just before the closing &lt;/body&gt; tag. .<br />
            e. Click Update File. <br />
          </div>

          <h3 className="font-medium mt-4 mb-1">🔹Wix</h3>
          <ul className="list-disc pl-6 mb-4 text-[#000000]">
            <li>Go to your Wix site dashboard. .</li>
            <li>Click Settings &gt; Custom Code. </li>
            <li>Click + Add Custom Code. </li>
            <li>Paste the embed code. </li>
            <li>Under Add Code to Pages, select "All Pages." .</li>
            <li>Choose Place Code in: Body - end.</li>
            <li>Save and publish. </li>
            </ul>
          <h3 className="font-medium mt-4 mb-1">🔹 Shopify</h3>
          <ul className="list-disc pl-6 mb-4 text-[#000000]">
            <li>From your admin panel, go to Online Store &gt; Themes.</li>
            <li>Click Actions &gt; Edit Code.</li>
            <li>Open the theme.liquid file.</li>
            <li>Scroll to the bottom and paste the code just before the &lt;/body&gt; tag.</li>
            <li>Click Save.</li>
            ✔️ Your chatbot will now appear on every page.
            </ul>

          <h3 className="font-medium mt-4 mb-1">🔹 Webflow</h3>
          <ul className="list-disc pl-6 mb-4 text-[#000000]">
            <li>Open your Webflow project dashboard.</li>
            <li>Click Pages, then the gear icon next to your desired page.</li>
            <li>Scroll to the Before &lt;/body&gt; tag field.</li>
            <li>Paste the code.</li>
            <li>Click Save, then Publish your changes.</li>
          </ul>
          <h3 className="font-medium mt-4 mb-1">🔹 Weebly</h3>
          <ul className="list-disc pl-6 mb-4 text-[#000000]">
            <li> Go to your Site Editor &gt; Settings &gt; SEO. </li>
            <li>Scroll to the Footer Code section. </li>
            <li>Paste the embed code. </li>
            <li>Save and Publish your site. </li>
          </ul>


          <h3 className="font-medium mt-4 mb-1">🔹 GoDaddy Website Builder</h3>
          <ul className="list-disc pl-6 mb-4 text-[#000000]">
            <li>In your website editor, click Edit Site.</li>
            <li>Navigate to Settings &gt; Site-wide Code.</li>
            <li>Place the embed code in the Footer section.</li>
            <li>Press Done.</li>
            <li>Click Publish.</li>
          </ul>

          <h3 className="font-medium mt-4 mb-1">🔹 Duda</h3>
          <ul className="list-disc pl-6 mb-4 text-[#000000]">
            <li>Open your site editor and click Settings &gt; Head HTML.</li>
            <li>Scroll to the Body End tab.</li>
            <li>Paste your embed code.</li>
            <li>Click Save and Publish.</li>
          </ul>

          <h3 className="font-medium mt-4 mb-1">🔹 ClickFunnels</h3>
          <ul className="list-disc pl-6 mb-4 text-[#000000]">
            <li>Open the desired funnel page.</li>
            <li>Click Settings &gt; Tracking Code.</li>
            <li>Scroll to Footer.</li>
            <li>Paste your embed code.</li>
            <li>Save the page.</li>
          </ul>

          <h3 className="font-medium mt-4 mb-1">🔹 Kajabi</h3>
          <ul className="list-disc pl-6 mb-4 text-[#000000]">
            <li>Go to Settings &gt; Site Details &gt; Page Scripts.</li>
            <li>Paste the embed code in the Footer section.</li>
            <li>Click Save.</li>
            <li>Your chatbot is now installed on all pages.</li>
          </ul>

          <h3 className="font-medium mt-4 mb-1">🔹 Bubble</h3>
          <div>
            <li>Option A: Site-wide Installation :</li>
            <li>Open your Bubble app.</li>
            <li>Scroll to Script in the body (before &lt;/body&gt;).</li>
            <li>Paste your embed code there.</li>
            <li>Click Save.</li>
            <li>Deploy or Preview to check chatbot visibility.</li>
            <br />
            <li>Option B - Specific Page Installation: </li>
            <br />
            <li>Open your desired page. </li>
            <li>Drag the HTML element onto the canvas.</li>
            <li>Paste the embed code inside the HTML element. </li>
            <li>Place it near the bottom of the page. </li>
            <li>Click Preview or Deploy.  </li>
          </div>

          <h3 className="font-medium mt-4 mb-1">🔹 Framer</h3>
          <ul className="list-disc pl-6 mb-4 text-[#000000]">
            <li>Open your Framer project.</li>
            <li>In the editor, click + Add Element &gt; Embed.</li>
            <li>Paste your embed code.</li>
            <li>Position the element where you want the chatbot to appear.</li>
            <li>Click Publish.</li>
          </ul>

          <h3 className="font-medium mt-4 mb-1">🔹 Card</h3>
          <ul className="list-disc pl-6 mb-4 text-[#000000]">
            <li><span style={{ color: '#2563eb' }}></span> In the editor, click + Add Element &gt; Embed.</li>
            <li><span style={{ color: '#2563eb' }}></span> Select Code and paste the embed code.</li>
            <li><span style={{ color: '#2563eb' }}></span> Place the element at the bottom of your page.</li>
            <li><span style={{ color: '#2563eb' }}></span> Click Publish.</li>
          </ul>

          <h3 className="font-medium mt-4 mb-1">🔹 Tilda</h3>
          <ul className="list-disc pl-6 mb-4 text-[#000000]">
            <li><span style={{ color: '#2563eb' }}></span> Go to Site Settings &gt; More &gt; Custom Code.</li>
            <li><span style={{ color: '#2563eb' }}></span> Scroll to Before &lt;/body&gt;.</li>
            <li><span style={{ color: '#2563eb' }}></span> Paste your embed code.</li>
            <li><span style={{ color: '#2563eb' }}></span> Click Save & Publish.</li>
          </ul>

          <h3 className="font-medium mt-4 mb-1">🔹 Webnode</h3>
          <ul className="list-disc pl-6 mb-4 text-[#000000]">
            <li><span style={{ color: '#2563eb' }}></span> Open your website dashboard.</li>
            <li><span style={{ color: '#2563eb' }}></span> Navigate to Settings &gt; Website Settings &gt; HTML Footer.</li>
            <li><span style={{ color: '#2563eb' }}></span> Paste the chatbot embed code.</li>
            <li><span style={{ color: '#2563eb' }}></span> Click Save and Publish.</li>
          </ul>

          <h3 className="font-medium mt-4 mb-1">❓ Need Help?</h3>
          <ul className="list-disc mb-4 text-[#000000]">

            <div className="list-disc">
              If your website platform isn't listed or you'd like assistance, feel free to reach out to us anytime at support@wellnexai.com. <br />
              We're here to make setup simple so you can start converting visitors into clients right away.
            </div>

          </ul>

          {/* FAQ Section - EXACT Figma Copy Below */}
          <div className="mt-8">
            <div className="font-bold mt-8 mb-2">💭 My chatbot isn't showing up on my website. What should I do?</div>
            <div>There are a few common reasons why your WellnexAI chatbot may not appear after installation.</div>

            <div className="font-semibold mt-4">✅ 1. Check that the embed code is placed correctly</div>
            <ul className="list-disc pl-6 mb-4 text-[#000000]">
              <li> Make sure the code was pasted just before the closing &lt;/body&gt; tag of your website's HTML.</li>
              <li>x If you're using a site builder (like Wix, Shopify, Webflow, etc.), double-check that you followed the correct steps for your platform.</li>

              <li>On WordPress, if you're using a theme editor, ensure you saved changes in footer.php.</li>
            </ul>

            <div className="font-semibold mt-4">🔄 2. Clear your cache and refresh</div>
            <ul className="list-disc pl-6 mb-4 text-[#000000]">
              <li>Sometimes, browser or site caching can delay updates.</li>
              <li>Try clearing your browser cache or open your site in an incognito/private window.</li>
              <li>If you're using a site builder with a "Publish" button, make sure you've clicked it after adding the code.</li>
            </ul>

            <div className="font-semibold mt-4">🆔 3. Verify your chatbot ID</div>
            <ul className="list-disc pl-6 mb-4 text-[#000000]">
              <li>Make sure that your embed code contains your unique business ID (e.g. biz=yourcompany123). If the ID is missing or incorrect, the chatbot won't load.</li>
            </ul>

            <div className="font-semibold mt-4">🔐 4. Check if the chatbot is restricted by your site's privacy settings</div>
            <ul className="list-disc pl-6 mb-4 text-[#000000]">
              <li>Some platforms (like Shopify or Webflow) may have custom script settings, cookie consent banners, or firewalls that block third-party scripts.</li>
              <li>Make sure third-party scripts are allowed, and whitelist the WellnexAI script in any firewall or cookie consent manager.</li>
            </ul>

            <div className="font-semibold mt-4">🛑 Still not working?</div>
            <ul className="list-disc pl-6 mb-4 text-[#000000]">
              <li>If you've double-checked all the above and your chatbot is still not showing, please contact us:

              </li>
              <li> 📩 <a href="mailto:support@wellnexai.com">support@wellnexai.com</a></li>
              <div>Include:
              </div>
              <ul className="list-disc pl-6 mb-4 text-[#000000]">
                <li><span style={{ color: '#2563eb' }}></span>Your website URL.</li>
                <li><span style={{ color: '#2563eb' }}></span>A screenshot of where the code is placed .</li>
                <li><span style={{ color: '#2563eb' }}></span>The platform you're using (e.g., Squarespace, Shopify, etc.)</li>

              </ul>
              <li>We're here to help and usually respond within 24 hours.  </li>
            </ul>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )

}