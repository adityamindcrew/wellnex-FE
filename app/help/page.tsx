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
        {/* <hr className="border-t-2 border-grey my-4" /> */}
        <div className="max-w-2xl mx-auto mt-4">
          <h2 className="text-lg font-semibold mb-2 mt-12">🔧 Step 1: Copy Your Unique Embed Code</h2>
          <span className="block text-[#000000] mb-3">
            You'll receive a code like this:
          </span>
          <pre className="bg-gray-100 rounded p-4 text-sm mb-4 overflow-x-auto"><code>{`<script src="https://embed.wellnexai.com/chatbot.js?biz=[YourID]"></script>`}</code></pre>
          <p className="mb-4 text-[#000000]">Copy the entire line.</p>
          <hr className="border-t-2 border-grey my-4" />
          <h2 className="text-lg font-semibold mb-2 mt-10">🌐 Platform-Specific Instructions</h2>

          <h3 className="font-medium mt-6 mb-1">🔹 Squarespace</h3>
          <ol className="list-decimal pl-6 mb-4 text-[#000000]">
            <li>Go to your<b> Squarespace dashboard.</b></li>
            <li>Click on <b>Settings &gt; Advanced &gt; Code Injection.</b></li>
            <li>Scroll to the <b> Footer </b> section. </li>
            <li>Paste your embed code here.</li>
            <li>Click <b>Save.</b></li>
            ✔️ Your chatbot will now appear on every page.
          </ol>

          <hr className="border-t-2 border-grey my-4" />

          <h3 className="font-medium mt-6 mb-1">🔹 WordPress</h3>
          <div className="mb-2 font-semibold">Option A – Using Elementor:</div>
          <ol className="list-decimal pl-6 mb-2 text-[#000000]">
            <li>Open the page in Elementor where you want to place the chatbot.</li>
            <li>Drag the <b>HTML widget </b> to the bottom of the page.</li>
            <li>Paste the code into the widget.</li>
            <li>Click <b>Update.</b></li>
          </ol>
          
          <div className="mb-2 font-semibold">Option B – Manual Theme Install:</div>
          <ol className="list-decimal pl-6 mb-4 text-[#000000]">
            <li>Go to your WordPress Dashboard.</li>
            <li>Navigate to <b>Appearance &gt; Theme File Editor.</b></li>
            <li>Select the <b> footer. php file </b>.</li>
            <li>Paste the embed code <b>just before the closing &lt;/body&gt; tag. </b></li>
            <li>Click <b>Update File.</b></li>
          </ol>
          <hr className="border-t-2 border-grey my-4" />
          <h3 className="font-medium mt-6 mb-1">🔹 Wix</h3>
          <ol className="list-decimal pl-6 mb-4 text-[#000000]">
            <li>Go to your<b> Wix site dashboard. </b> </li>
            <li>Click <b>Settings &gt; Custom Code.</b></li>
            <li>Click <b>+ Add Custom Code.</b></li>
            <li>Paste the embed code.</li>
            <li>Under <b>Add Code to Pages, </b> select "All Pages."</li>
            <li>Choose <b>Place Code in: Body - end.</b></li>
            <li>Save and publish.</li>
          </ol>
          <hr className="border-t-2 border-grey my-4" />

          <h3 className="font-medium mt-6 mb-1">🔹 Shopify</h3>
          <ol className="list-decimal pl-6 mb-4 text-[#000000]">
            <li>From your admin panel, go to <b>Online Store &gt; Themes.</b></li>
            <li>Click <b>Actions &gt; Edit Code.</b></li>
            <li>Open the theme.liquid file.</li>
            <li>Scroll to the bottom and paste the code just<b> before the &lt;/body&gt; tag.</b></li>
            <li>Click <b>Save.</b></li>
           ✔️ The chatbot will now show on all pages.
          </ol>
          <hr className="border-t-2 border-grey my-4" />
          <h3 className="font-medium mt-6 mb-1">🔹 Webflow</h3>
          <ol className="list-decimal pl-6 mb-4 text-[#000000]">
            <li>Open your Webflow <b>project dashboard.</b></li>
            <li>Click <b>Pages, </b> then the gear icon next to your desired page.</li>
            <li>Scroll to the <b>Before &lt;/body&gt; tag </b>field.</li>
            <li>Paste the code.</li>
            <li>Click <b>Save, </b> then <b>Publish </b>your changes.</li>
          </ol>

          <hr className="border-t-2 border-grey my-4" />

          <h3 className="font-medium mt-6 mb-1">🔹 Weebly</h3>
          <ol className="list-decimal pl-6 mb-4 text-[#000000]">
            <li>Go to your <b>Site Editor &gt; Settings &gt; SEO.</b></li>
            <li>Scroll to the <b>Footer Code </b>section.</li>
            <li>Paste the embed code.</li>
            <li>Save and <b>Publish </b>your site.</li>
          </ol>

          <hr className="border-t-2 border-grey my-4" />
          <h3 className="font-medium mt-6 mb-1">🔹 GoDaddy Website Builder</h3>
          <ol className="list-decimal pl-6 mb-4 text-[#000000]">
            <li>In your dashboard, click <b> Edit Site.</b></li>
            <li>Navigate to <b>Settings &gt; Site-wide Code.</b></li>
            <li>Choose <b>Body - end.</b></li>
            <li>Paste the chatbot embed code.</li>
            <li>Click <b>Publish.</b></li>
          </ol>
          <hr className="border-t-2 border-grey my-4" />
          <h3 className="font-medium mt-6 mb-1">🔹 Duda</h3>
          <ol className="list-decimal pl-6 mb-4 text-[#000000]">
            <li>Open your site editor and click <b> Settings &gt; Head HTML </b></li>
            <li>Switch to the <b>Body End </b>tab.</li>
            <li>Paste your embed code.</li>
            <li>Click <b>Save </b>and <b>Publish.</b></li>
          </ol>
          <hr className="border-t-2 border-grey my-4" />
          <h3 className="font-medium mt-6 mb-1">🔹 ClickFunnels</h3>
          <ol className="list-decimal pl-6 mb-4 text-[#000000]">
            <li>Open the desired <b>funnel page.</b></li>
            <li>Click <b>Settings &gt; Tracking Code.</b></li>
            <li>Scroll to <b>Footer.</b></li>
            <li>Paste your embed code.</li>
            <li>Save the page.</li>
          </ol>         
           <hr className="border-t-2 border-grey my-4" />

          <h3 className="font-medium mt-6 mb-1">🔹 Kajabi</h3>
          <ol className="list-decimal pl-6 mb-4 text-[#000000]">
            <li>Go to <b>Settings &gt; Site Details &gt; Page Scripts.</b></li>
            <li>Paste the embed code in the <b>Footer section.</b></li>
            <li>Click <b>Save</b></li>
           ✔️ Your chatbot is now installed on all pages.
          </ol>
          <hr className="border-t-2 border-grey my-4" />

          <h3 className="font-medium mt-6 mb-1">🔹 Bubble.io</h3>
          <div className="mb-2 font-semibold">Option A – Site-wide Installation:</div>
          <ol className="list-decimal pl-6 mb-2 text-[#000000]">
            <li>Open your<b> Bubble app.</b></li>
            <li>Go to <b>Settings &gt; SEO / Metatags.</b></li>
            <li>Scroll to <b>Script in the body (before &lt;/body&gt;).</b></li>
            <li>Paste your embed code there.</li>
            <li>Click <b>Save.</b></li>
            <li><b>Deploy </b> or <b>Preview </b>to check chatbot visibility.</li>
          </ol>
          <hr className="border-t-2 border-grey my-4" />
          <div className="mb-2 font-semibold">Option B – Specific Page Installation:</div>
          <ol className="list-decimal pl-6 mb-4 text-[#000000]">
            <li>Open your desired page.</li>
            <li>Drag the <b>HTML element </b> onto the canvas.</li>
            <li>Paste the embed code inside the HTML element.</li>
            <li>Place it near the bottom of the page.</li>
            <li>Click <b>Preview </b>or <b>Deploy.</b></li>
          </ol>
          <hr className="border-t-2 border-grey my-4" />

          <h3 className="font-medium mt-6 mb-1">🔹 Framer</h3>
          <ol className="list-decimal pl-6 mb-4 text-[#000000]">
            <li>Open your Framer project.</li>
            <li>Go to<b> Settings &gt; Custom Code.</b></li>
            <li>Paste the embed code in the <b>Body - end </b>section.</li>
            <li>Click <b>Publish.</b></li>
          </ol>
          <hr className="border-t-2 border-grey my-4" />

          <h3 className="font-medium mt-6 mb-1">🔹 Carrd</h3>
          <ol className="list-decimal pl-6 mb-4 text-[#000000]">
            <li>In the editor, click <b>+ Add Element &gt; Embed.</b></li>
            <li>Select <b>Code </b>and paste the embed code.</li>
            <li>Place the element at the bottom of your page.</li>
            <li>Click <b>Publish.</b></li>
          </ol>
          <hr className="border-t-2 border-grey my-4" />
          <h3 className="font-medium mt-6 mb-1">🔹 Tilda</h3>
          <ol className="list-decimal pl-6 mb-4 text-[#000000]">
            <li>Go to <b>Site Settings &gt; More &gt; Custom Code.</b></li>
            <li>Scroll to<b> Before &lt;/body&gt;.</b></li>
            <li>Paste your embed code.</li>
            <li>Click <b>Save </b>and <b>Publish.</b></li>
          </ol>
          <hr className="border-t-2 border-grey my-4" />
          <h3 className="font-medium mt-6 mb-1">🔹 Webnode</h3>
          <ol className="list-decimal pl-6 mb-4 text-[#000000]">
            <li>Open your website dashboard.</li>
            <li>Navigate to <b>Settings &gt; Website Settings &gt; HTML Footer.</b></li>
            <li>Paste the chatbot embed code.</li>
            <li>Click <b>Save </b>and <b>Publish.</b></li>
          </ol>
          <hr className="border-t-2 border-grey my-4" />

          <h3 className="font-medium mt-10 mb-2">❓ Need Help?</h3>
          <div className="mb-4 text-[#000000]">
            If your website platform isn't listed or you'd like assistance, feel free to reach out to us anytime at <a href="mailto:support@wellnexai.com" className="underline text-blue-600">support@wellnexai.com</a>.<br />
            We're here to make setup simple so you can start converting visitors into clients right away.
          </div>

          <div className="font-bold mb-2">💭 My chatbot isn't showing up on my website. What should I do?</div>
          <div className="mb-2">There are a few common reasons why your WellnexAI chatbot may not appear after installation:</div>

          <div className="font-semibold">✅ 1. Check that the embed code is placed correctly</div>
          <ol className="list-decimal pl-6 text-[#000000] mb-2">
            <li>Make sure the code was pasted <b>just before the closing &lt;/body&gt; tag </b> of your website's HTML.</li>
            <li>If you're using a site builder (like Wix, Shopify, Webflow, etc.), double-check that you followed the correct steps for your platform.</li>
            <li>On WordPress, if you're using a theme editor, ensure you saved changes in footer.php.</li>
          </ol>

          <div className="font-semibold mt-4">🔄 2. Clear your cache and refresh</div>
          <ol className="list-decimal pl-6 text-[#000000] mb-2">
            <li>Sometimes, browser or site caching can delay updates.</li>
            <li>Try clearing your browser cache or open your site in an incognito/private window.</li>
            <li>If you're using a site builder with a "Publish" button, make sure you've clicked it after adding the code.</li>
          </ol>

          <div className="font-semibold mt-4">🆔 3. Verify your chatbot ID</div>
          <ol className="list-decimal pl-6 text-[#000000] mb-2">
            <li>Ensure that your embed code contains your <b> unique business ID </b>(e.g., biz=yourcompany123). If the ID is missing or incorrect, the chatbot won't load.</li>
          </ol>

          <div className="font-semibold mt-4">🔐 4. Check if the chatbot is restricted by your site's privacy settings</div>
          <ol className="list-decimal pl-6 text-[#000000] mb-2">
            <li>Some platforms (like Shopify or Webflow) may have custom script settings, cookie consent banners, or security rules that block scripts.</li>
            <li>Make sure third-party scripts are allowed, or whitelist the WellnexAI script in any firewall or cookie consent manager.</li>
          </ol>

          <div className="font-semibold mt-4">🛑 Still not working?</div>
          <ol className="list-decimal pl-6 text-[#000000] mb-2">
            <li>If you've double-checked all the above and your chatbot is still not showing, please contact us:</li>
            <li>📩 Email: <a href="mailto:support@wellnexai.com" className="underline text-blue-600">support@wellnexai.com</a></li>
            <li>Include:</li>
            <ol className="list-decimal pl-6 text-[#000000]">
              <li>Your website URL</li>
              <li>A screenshot of where the code is placed</li>
              <li>The platform you're using (e.g., Squarespace, Shopify, etc.)</li>
            </ol>
            <li>We're here to help and usually respond within 24 hours.</li>
          </ol>
        </div>
      </section>

      <Footer />
    </main>
  )

}