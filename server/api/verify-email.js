import { defineEventHandler, readBody } from 'h3';
import dns from 'node:dns/promises';
import disposableDomains from 'disposable-email-domains'; // Import the package

export default defineEventHandler(async (event) => {
  try {
    const { email } = await readBody(event);

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { validSyntax: false, domainExists: false, isDisposable: false, mxRecordsFound: false };
    }

    const domain = email.split('@')[1];

    let domainExists = false;
    let mxRecordsFound = false;

    try {
      const addresses = await dns.lookup(domain);
      domainExists = !!addresses;
      const mxRecords = await dns.resolveMx(domain);
      mxRecordsFound = mxRecords.length > 0;
    } catch (err) {
      domainExists = false;
      mxRecordsFound = false;
    }

    // Check against the large disposable email list
    const isDisposable = disposableDomains.includes(domain);

    return { validSyntax: true, domainExists, isDisposable, mxRecordsFound };

  } catch (error) {
    console.error("Server error:", error);
    return { error: "Internal Server Error" };
  }
});
