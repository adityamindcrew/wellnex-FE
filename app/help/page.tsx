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
      {/* Navbar */}
 <Header/>

      {/* Help Content */}
      <section className="flex flex-col max-w-3xl mx-auto bg-white rounded-xl shadow-sm mt-12 p-8">
        <h1 className="text-3xl font-bold mb-4 text-center">How to Install the WellnexAI Chatbot on Your Website</h1>
        <p className="text-[#000000] text-center mb-8">Once you've customized your chatbot, installing it on your site is simple. Follow the instructions below based on the platform you're using.</p>

        <h2 className="text-lg font-semibold mb-2">1. Step 1: Copy Your Unique Embed Code</h2>
        <pre className="bg-gray-100 rounded p-4 text-sm mb-4 overflow-x-auto"><code>{`<script src="https://embed.wellnexai.com/chatbot.js?bot=YOURID"></script>`}</code></pre>
        <p className="mb-4 text-[#000000]">Copy the entire line above.</p>

        <h2 className="text-lg font-semibold mb-2">2. Clear your cache and refresh</h2>
        <ul className="list-disc pl-6 mb-4 text-[#000000]">
          <li>Sometimes, browser or site caching can delay updates.</li>
          <li>Try viewing your browser cache or open your site in an incognito/private window.</li>
          <li>If using a site builder with a "Publish" button, make sure you've clicked it after adding the code.</li>
        </ul>

        <h2 className="text-lg font-semibold mb-2">3. Platform-Specific Instructions</h2>
        <h3 className="font-medium mt-4 mb-1">Squarespace</h3>
        <ul className="list-disc pl-6 mb-4 text-[#000000]">
          <li>Go to your Squarespace dashboard.</li>
          <li>Go to Settings &gt; Advanced &gt; Code Injection.</li>
          <li>Scroll to the Footer section.</li>
          <li>Paste the embed code above.</li>
          <li>Click Save.</li>
          <li>Your chatbot will now appear on every page.</li>
        </ul>
        <h3 className="font-medium mt-4 mb-1">WordPress</h3>
        <ul className="list-disc pl-6 mb-4 text-[#000000]">
          <li>Open a page (using Elementor or where you want to place the chatbot).</li>
          <li>Drag the HTML widget to the bottom of the page.</li>
          <li>Paste the code into the widget.</li>
          <li>Or (Classic Method):</li>
          <li>Go to your WordPress Dashboard.</li>
          <li>Navigate to Appearance &gt; Theme File Editor.</li>
          <li>Find the <code>footer.php</code> file.</li>
          <li>Paste the embed code just before the closing <code>&lt;/body&gt;</code> tag.</li>
          <li>Save and publish.</li>
        </ul>
        <h3 className="font-medium mt-4 mb-1">Wix</h3>
        <ul className="list-disc pl-6 mb-4 text-[#000000]">
          <li>Go to your Wix site dashboard.</li>
          <li>Click Settings &gt; Custom Code.</li>
          <li>Click + Add Custom Code.</li>
          <li>Paste the embed code.</li>
          <li>Under Place Code In, choose "All Pages".</li>
          <li>Choose Place Code at End.</li>
          <li>Save and publish.</li>
        </ul>
        <h3 className="font-medium mt-4 mb-1">Shopify</h3>
        <ul className="list-disc pl-6 mb-4 text-[#000000]">
          <li>From your admin panel, go to Online Store &gt; Themes.</li>
          <li>Click Actions &gt; Edit code.</li>
          <li>Open the theme.liquid file.</li>
          <li>Paste the embed code just before the closing <code>&lt;/body&gt;</code> tag.</li>
          <li>Save and publish.</li>
        </ul>
        <h3 className="font-medium mt-4 mb-1">Webflow</h3>
        <ul className="list-disc pl-6 mb-4 text-[#000000]">
          <li>Open your Webflow project dashboard.</li>
          <li>Click Pages, then the page (or root) you want to add your desired page.</li>
          <li>Scroll to the Footer (body) tag field.</li>
          <li>Paste the code.</li>
          <li>Click Save, then Publish your changes.</li>
        </ul>
        <h3 className="font-medium mt-4 mb-1">GoDaddy Website Builder</h3>
        <ul className="list-disc pl-6 mb-4 text-[#000000]">
          <li>In your website editor, click Edit Site.</li>
          <li>Navigate to Settings &gt; Site-wide Code.</li>
          <li>Place the embed code in the Footer section.</li>
          <li>Press Done.</li>
          <li>Click Publish.</li>
        </ul>
        <h3 className="font-medium mt-4 mb-1">Duda</h3>
        <ul className="list-disc pl-6 mb-4 text-[#000000]">
          <li>Open your site editor and click Settings &gt; Head HTML.</li>
          <li>Scroll to the Body End tag.</li>
          <li>Paste your embed code.</li>
          <li>Click Save and Publish.</li>
        </ul>
        <h3 className="font-medium mt-4 mb-1">ClickFunnels</h3>
        <ul className="list-disc pl-6 mb-4 text-[#000000]">
          <li>Open the desired funnel page.</li>
          <li>Click Settings &gt; Tracking Code.</li>
          <li>Scroll to Footer.</li>
          <li>Paste your embed code.</li>
          <li>Save the page.</li>
        </ul>
        <h3 className="font-medium mt-4 mb-1">Kajabi</h3>
        <ul className="list-disc pl-6 mb-4 text-[#000000]">
          <li>Go to Settings &gt; Site Details &gt; Page Scripts.</li>
          <li>Paste the embed code in the Footer section.</li>
          <li>Click Save.</li>
          <li>Your chatbot is now installed on all pages.</li>
        </ul>
        <h3 className="font-medium mt-4 mb-1">Bubble</h3>
        <ul className="list-disc pl-6 mb-4 text-[#000000]">
          <li>Option A – Site-wide installation</li>
          <li>Open your Bubble app editor.</li>
          <li>Go to Settings &gt; SEO / Metadata.</li>
          <li>Paste your script in body (before </li>
          <li>Save or re-deploy code.</li>
          <li>Option B – Per page</li>
          <li>Design or Preview to check chatbot visibility.</li>
          <li>Drag the HTML element onto the canvas.</li>
          <li>Paste the embed code inside the HTML element.</li>
          <li>Place the element towards the bottom of the page.</li>
          <li>Click Preview or Deploy.</li>
        </ul>
        <h3 className="font-medium mt-4 mb-1">Framer</h3>
        <ul className="list-disc pl-6 mb-4 text-[#000000]">
          <li>Open your Framer project.</li>
          <li>In the editor, click + Add Element &gt; Embed.</li>
          <li>Paste your embed code.</li>
          <li>Position the element where you want the chatbot to appear.</li>
          <li>Click Publish.</li>
        </ul>
        <h3 className="font-medium mt-4 mb-1">Card</h3>
        <ul className="list-disc pl-6 mb-4 text-[#000000]">
          <li>In the editor, click + Add Element &gt; Embed.</li>
          <li>Select Code and paste the embed code.</li>
          <li>Place the element at the bottom of your page.</li>
          <li>Click Publish.</li>
        </ul>
        <h3 className="font-medium mt-4 mb-1">Tilda</h3>
        <ul className="list-disc pl-6 mb-4 text-[#000000]">
          <li>Go to Site Settings &gt; More &gt; Custom Code.</li>
          <li>Scroll to before &lt;/body&gt;.</li>
          <li>Paste your embed code.</li>
          <li>Click Save &amp; Publish.</li>
        </ul>
        <h3 className="font-medium mt-4 mb-1">Webnode</h3>
        <ul className="list-disc pl-6 mb-4 text-[#000000]">
          <li>Navigate to your website dashboard.</li>
          <li>Go to Settings &gt; Website Settings &gt; HTML Footer.</li>
          <li>Paste the embed code.</li>
          <li>Click Save and Publish.</li>
        </ul>
        <h3 className="font-medium mt-4 mb-1">Need Help?</h3>
        <ul className="list-disc pl-6 mb-4 text-[#000000]">
          <li>If your website platform isn't listed or you'd like assistance, feel free to reach out to us anytime at support@wellnexai.com.</li>
        </ul>
        <h3 className="font-medium mt-4 mb-1">Why isn't the chatbot showing up on my website? What should I do?</h3>
        <ul className="list-disc pl-6 mb-4 text-[#000000]">
          <li><strong>1) Check that the embed code is placed correctly</strong>
            <ul className="list-disc pl-6">
              <li>Make sure the code was pasted just before the closing &lt;/body&gt; tag of your website's HTML.</li>
              <li>If using a site builder (like Wix, Shopify, Webflow, etc.), double-check that you followed the correct steps for your platform.</li>
              <li>On WordPress, if you're using a theme file editor, ensure you saved changes in footer.php.</li>
            </ul>
          </li>
          <li><strong>2) Clear your cache and refresh</strong>
            <ul className="list-disc pl-6">
              <li>Sometimes, browser or site caching can delay updates.</li>
              <li>Try clearing your browser cache or open your site in an incognito/private window.</li>
              <li>If using a site builder with a "Publish" button, make sure you clicked it after adding the code.</li>
            </ul>
          </li>
          <li><strong>3) Verify your chatbot embed code</strong>
            <ul className="list-disc pl-6">
              <li>Ensure that your embed code contains your unique business ID (e.g. <code>?bot=yourcompany123</code>).</li>
            </ul>
          </li>
          <li><strong>4) Check if the chatbot is restricted by your site's privacy settings</strong>
            <ul className="list-disc pl-6">
              <li>Some platforms (e.g. Shopify) may require you to change script settings, cookie settings, or third-party script allowances.</li>
              <li>Make sure no content security filters are enabled, or whitelist the WellnexAI script in any content security policy or consent manager.</li>
            </ul>
          </li>
          <li><strong>Still not working?</strong>
            <ul className="list-disc pl-6">
              <li>If you've double-checked all the above and your chatbot is still not showing, please contact us:<br/>Email: support@wellnexai.com</li>
              <li>For a screenshot of where the code is placed:<br/>- Tell us your website type (e.g. Squarespace, Shopify, etc.)<br/>- The platform and steps you tried</li>
            </ul>
          </li>
        </ul>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  )

}