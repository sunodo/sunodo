import Script from 'next/script';

export function Gtm() {
  return (
    <>
      <Script
        strategy="lazyOnload"
        id="gtm"
        src={`https://www.googletagmanager.com/gtag/js?id=G-88KREZMP4F`}
      />

      <Script strategy="lazyOnload" id="gtm-init">
        {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', 'G-88KREZMP4F', {
                    page_path: window.location.pathname,
                    });
                `}
      </Script>
    </>
  );
}
