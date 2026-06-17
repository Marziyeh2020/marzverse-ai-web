import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  metadataBase: new URL("https://marzverse.com"),
  title: "Marzverse | AI Automation, AI Chatbots & Modern Web Development",
  description: "Marzverse builds premium websites, AI chatbots, AI automation systems and digital experiences that help businesses scale faster.",
  keywords: [
    "AI Automation",
    "AI Chatbot Development",
    "Website Development",
    "Web Design Agency",
    "Business Automation",
    "AI Solutions",
    "Modern Websites",
    "Digital Experiences",
    "Custom Software",
    "Digital Transformation",
    "Next.js Development",
    "Istanbul Web Design",
    "AI Agency",
    "AI Automation Agency",
    "AI Integration",
    "Custom AI Chatbots",
    "Next.js Agency",
    "Webflow Development",
    "Business Process Automation",
    "AI Consulting",
    "AI Website Development"
  ],
  authors: [{ name: "Marzverse" }],
  alternates: {
    canonical: "https://marzverse.com",
  },
  openGraph: {
    title: "Marzverse | AI Automation, AI Chatbots & Modern Web Development",
    description: "Marzverse builds premium websites, AI chatbots, AI automation systems and digital experiences that help businesses scale faster.",
    url: "https://marzverse.com",
    siteName: "Marzverse",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Marzverse AI Automation",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Marzverse | AI Automation, AI Chatbots & Modern Web Development",
    description: "Marzverse builds premium websites, AI chatbots, AI automation systems and digital experiences that help businesses scale faster.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Marzverse",
      "url": "https://marzverse.com",
      "logo": "https://marzverse.com/logo.png",
      "email": "contact@marzverse.com",
      "sameAs": [
        "https://x.com/MARZ_VERSE",
        "https://www.linkedin.com/company/marzverse/",
        "https://www.instagram.com/marz_verse_tech/"
      ],
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Digital Services",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Website Development"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "AI Chatbot Integration"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "AI Automation Systems"
            }
          }
        ]
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Marzverse",
      "url": "https://marzverse.com"
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is Marzverse?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Marzverse is a startup specializing in modern websites, AI chatbots, and AI automation solutions."
          }
        },
        {
          "@type": "Question",
          "name": "What services do you offer?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We offer modern website development, AI chatbots, AI automation solutions, and custom AI tools based on your business needs."
          }
        },
        {
          "@type": "Question",
          "name": "How long does it take to build a website?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Most projects are completed within 1 to 3 weeks depending on the scope, content, and requested features."
          }
        },
        {
          "@type": "Question",
          "name": "Do you provide website maintenance?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. Maintenance and support options can be discussed based on your project needs."
          }
        },
        {
          "@type": "Question",
          "name": "What can a chatbot do?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A chatbot can answer common questions, collect leads, provide service information, guide visitors, and assist customers 24/7."
          }
        },
        {
          "@type": "Question",
          "name": "Can the chatbot be customized?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. The chatbot can be customized according to your business, services, tone of voice, and branding."
          }
        },
        {
          "@type": "Question",
          "name": "What is AI automation?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "AI automation helps businesses automate repetitive tasks, improve efficiency, save time, and reduce manual work."
          }
        },
        {
          "@type": "Question",
          "name": "Can AI automation help my business?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. AI automation can support customer service, lead collection, content generation, appointment workflows, and internal business processes."
          }
        },
        {
          "@type": "Question",
          "name": "How much does a website cost?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Pricing depends on the project requirements. Our services range from simple websites to advanced websites with AI features. Contact us for a custom quote."
          }
        },
        {
          "@type": "Question",
          "name": "How much does a chatbot cost?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Chatbot pricing depends on the required features, level of customization, and integration needs."
          }
        },
        {
          "@type": "Question",
          "name": "How do I start a project?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Simply contact us with your project idea, and we will guide you through the next steps."
          }
        }
      ]
    }
  ];

  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased text-foreground bg-background-start overflow-x-hidden`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <div className="noise-overlay"></div>
        <div className="cinematic-bg"></div>
        {children}
      </body>
    </html>
  );
}
