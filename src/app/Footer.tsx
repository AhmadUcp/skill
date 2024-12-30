"use client";
import { useState } from "react";
import { Mail, Phone } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  const [subscription, setSubscription] = useState({
    name: "",
    email: "",
    company: "",
  });

  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleInputChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setSubscription((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubscribe = (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    if (subscription.name && subscription.email) {
      // Simulating a successful subscription
      console.log("Subscribed with:", subscription);
      setIsSubscribed(true);

      // Reset form fields
      setSubscription({
        name: "",
        email: "",
        company: "",
      });

      // Optionally, call an API to save subscription data
      // fetch("/api/subscribe", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(subscription),
      // })
      //   .then(response => response.json())
      //   .then(data => console.log("Subscription success:", data))
      //   .catch(error => console.error("Subscription error:", error));
    } else {
      alert("Please fill out Name and Email fields.");
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-blue-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="hover:text-blue-400">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-blue-400">
                  Contact & Support
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-blue-400">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/press" className="hover:text-blue-400">
                  Press
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/help" className="hover:text-blue-400">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-blue-400">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-blue-400">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/accessibility" className="hover:text-blue-400">
                  Accessibility
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/custom" className="hover:text-blue-400">
                  Custom Services
                </Link>
              </li>
              <li>
                <Link href="/why-us" className="hover:text-blue-400">
                  Why SkillMap Navigator
                </Link>
              </li>
              <li>
                <Link href="/security" className="hover:text-blue-400">
                  Data Security
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Subscribe to us</h3>
            <form className="space-y-4" onSubmit={handleSubscribe}>
              {isSubscribed && (
                <p className="text-green-400">Thank you for subscribing!</p>
              )}
              <div>
                <input
                  type="text"
                  name="name"
                  value={subscription.name}
                  onChange={handleInputChange}
                  placeholder="Name"
                  className="w-full px-4 py-2 bg-white-500 border border-white-500 rounded-md focus:outline-none focus:border-blue-500 text-black"
                />
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  value={subscription.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                  className="w-full px-4 py-2 bg-white-500 border border-white-500 rounded-md focus:outline-none focus:border-blue-500 text-black"
                />
              </div>
              <div>
                <input
                  type="text"
                  name="company"
                  value={subscription.company}
                  onChange={handleInputChange}
                  placeholder="Company Name"
                  className="w-full px-4 py-2 bg-white-500 border border-white-500 rounded-md focus:outline-none focus:border-blue-500 text-black"
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 bg-white-600 border border-white-500 text-white rounded-md hover:bg-blue-500 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p>&copy; {currentYear} SkillMap Navigator. All rights reserved.</p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <div className="flex items-center space-x-2">
                <Mail className="h-5 w-5" />
                <span>contact@skillmap.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-5 w-5" />
                <span>+1 (555) 123-4567</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
