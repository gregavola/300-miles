import React from "react";
import Head from "next/head";

export const siteTitle = `A Race For a Cure - 300 Miles for Cancer`;
export const siteDescription = `Join Greg Avola as he races 300 miles on his Peloton to race money for the American Cancer societ through the month of April 2020. Track his progress live!`;

export default function Layout({ children }) {
  return (
    <div>
      <Head>
        <title>{siteTitle}</title>
        <meta name="description" content={siteDescription} />
        <link
          rel="apple-touch-icon"
          sizes="144x144"
          href={`/favicon/apple-touch-icon.png?v=1`}
        />
        <link
          rel="icon"
          type="image/png"
          href={`/faviconfavicon-32x32.png`}
          sizes="32x32"
        />
        <link
          rel="icon"
          type="image/png"
          href={`/favicon/favicon-16x16.png`}
          sizes="16x16"
        />

        <meta property="og:title" content={siteTitle} />
        <meta property="og:description" content={siteDescription} />
        <meta name="twitter:title" content={siteTitle} />
        <meta name="twitter:description" content={siteDescription} />

        <meta property="og:image:width" content="1200 " />
        <meta property="og:image:height" content="630" />
        <meta property="og:image" content={"/og-fb-image.png"} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image:width" content="1600" />
        <meta name="twitter:image:height" content="900" />
        <meta name="twitter:image" content={"/og-twitter-image-v2.png"} />

        <meta property="og:url" content={"https://300miles.gregavola.com"} />
        <meta property="og:type" content="website" />

        <meta name="twitter:url" content={`https://300miles.gregavola.com`} />
        <meta name="twitter:site" content="@gregavola" />

        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <main>{children}</main>
    </div>
  );
}
