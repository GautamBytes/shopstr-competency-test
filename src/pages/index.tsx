import { useState } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';

// Syntax highlighting
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/cjs/styles/hljs';

// Define interfaces for our state objects
interface NostrResult {
  originalMessage?: string;
  decryptedContent?: string;
  error?: string;
  [key: string]: any;
}

interface CashuResult {
  message?: string;
  error?: string;
  [key: string]: any;
}

interface HodlResult {
  originalInvoice?: { status: string };
  heldInvoice?: { status: string };
  settledInvoice?: { status: string };
  failedSettlement?: { status: string };
  canceledInvoice?: { status: string };
  error?: string;
  [key: string]: any;
}

const Home: NextPage = () => {
  // Sidebar toggle state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Dark mode state using our module class
  const [darkMode, setDarkMode] = useState(false);
  const toggleDarkMode = () => setDarkMode(!darkMode);

  // Nostr states
  const [nostrResult, setNostrResult] = useState<NostrResult | null>(null);
  const [nostrLoading, setNostrLoading] = useState(false);
  const [nostrVisible, setNostrVisible] = useState(false);

  const toggleNostr = async () => {
    if (nostrVisible) {
      setNostrResult(null);
      setNostrVisible(false);
      return;
    }
    setNostrLoading(true);
    try {
      const response = await fetch('/api/nostr');
      const data = await response.json();
      setNostrResult(data);
      setNostrVisible(true);
    } catch (error) {
      console.error("Nostr test failed:", error);
      setNostrResult({ error: "Test failed. See console for details." });
      setNostrVisible(true);
    }
    setNostrLoading(false);
  };

  // Cashu states
  const [cashuResult, setCashuResult] = useState<CashuResult | null>(null);
  const [cashuLoading, setCashuLoading] = useState(false);
  const [cashuVisible, setCashuVisible] = useState(false);

  const toggleCashu = async () => {
    if (cashuVisible) {
      setCashuResult(null);
      setCashuVisible(false);
      return;
    }
    setCashuLoading(true);
    try {
      const response = await fetch('/api/cashu');
      const data = await response.json();
      setCashuResult(data);
      setCashuVisible(true);
    } catch (error) {
      console.error("Cashu test failed:", error);
      setCashuResult({ error: "Test failed. See console for details." });
      setCashuVisible(true);
    }
    setCashuLoading(false);
  };

  // HODL states
  const [hodlResult, setHodlResult] = useState<HodlResult | null>(null);
  const [hodlLoading, setHodlLoading] = useState(false);
  const [hodlVisible, setHodlVisible] = useState(false);

  const toggleHodl = async () => {
    if (hodlVisible) {
      setHodlResult(null);
      setHodlVisible(false);
      return;
    }
    setHodlLoading(true);
    try {
      const response = await fetch('/api/hodl');
      const data = await response.json();
      setHodlResult(data);
      setHodlVisible(true);
    } catch (error) {
      console.error("HODL invoice test failed:", error);
      setHodlResult({ error: "Test failed. See console for details." });
      setHodlVisible(true);
    }
    setHodlLoading(false);
  };

  return (
    <div className={`${styles.wrapper} ${darkMode ? styles.darkMode : ''}`}>
      <Head>
        <title>Shopstr Competency Test</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" /> 
        <meta name="description" content="Testing implementation of Nostr, Cashu, and HODL invoices" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </Head>

      {/* Dark mode toggle button */}
      <div className={styles.darkModeToggle}>
        <button 
          onClick={toggleDarkMode} 
          className={styles.darkModeBtn}
          aria-label="Toggle Dark Mode"
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>

      {/* Floating shapes container - hide on small screens */}
      <div className={styles.floatingShapes}>
        <div
          className={styles.shape}
          style={{
            width: '80px',
            height: '80px',
            top: '120px',
            left: '15%',
            background: 'linear-gradient(135deg, var(--secondary), var(--primary))'
          }}
        />
        <div
          className={styles.shape}
          style={{
            width: '100px',
            height: '100px',
            top: '320px',
            left: '60%',
            background: 'linear-gradient(135deg, var(--secondary), var(--primary))'
          }}
        />
        <div
          className={styles.shape}
          style={{
            width: '60px',
            height: '60px',
            top: '500px',
            left: '80%',
            background: 'linear-gradient(135deg, var(--secondary), var(--primary))'
          }}
        />
      </div>

      {/* Hamburger / Toggle Button */}
      <div className={styles.navToggle}>
        <button 
          onClick={toggleSidebar} 
          className={styles.hamburgerBtn}
          aria-label="Toggle Sidebar Navigation"
        >
          ☰
        </button>
      </div>

      {/* Overlay behind sidebar */}
      {sidebarOpen && (
        <div className={styles.overlay} onClick={toggleSidebar} role="button" aria-label="Close Sidebar"></div>
      )}

      {/* Sidebar Navigation */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`} role="navigation">
        <h2 className={styles.sidebarTitle}>Resources</h2>
        <ul className={styles.sidebarLinks}>
          <li>
            <a 
              href="https://github.com/nostr-protocol/nips/blob/master/17.md" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="NIP-17 Docs"
            >
              <span className={styles.arrow}>➜</span> NIP-17 Docs
            </a>
          </li>
          <li>
            <a 
              href="https://github.com/cashubtc/nuts/blob/main/11.md" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Cashu P2PK"
            >
              <span className={styles.arrow}>➜</span> Cashu P2PK
            </a>
          </li>
          <li>
            <a 
              href="https://github.com/lightningnetwork/lnd/pull/2022" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="HODL Invoices"
            >
              <span className={styles.arrow}>➜</span> HODL Invoices
            </a>
          </li>
        </ul>
      </aside>

      <div className={styles.container}>
        <header className={styles.hero}>
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>Welcome to Shopstr!</h1>
            <p className={styles.heroSubtitle}>
              Trade anonymously with Bitcoin via secure, automated escrow.
            </p>
          </div>
          <div className={styles.heroImage}>
            <Image
              src="/hero-cartoon.jpg"
              alt="Illustration of a shopping cart and secure payment"
              width={480}
              height={360}
              style={{ objectFit: 'contain', maxWidth: '100%', height: 'auto' }}
              priority
            />
          </div>
        </header>

        <div className={styles.waveWrapper}>
          <svg className={styles.wave} viewBox="0 0 1440 150" preserveAspectRatio="none">
            <path fill="#fff" d="M0,60 C360,180 1080,0 1440,60 L1440,0 L0,0 Z"></path>
          </svg>
        </div>

        <main className={styles.main}>
          {/* Nostr Section */}
          <section className={styles.card}>
            <h2>1. Nostr Gift-Wrapped Messages</h2>
            <button 
              onClick={toggleNostr} 
              disabled={nostrLoading} 
              className={styles.button}
            >
              {nostrLoading
                ? 'Testing...'
                : nostrVisible
                ? 'Hide Nostr Results'
                : 'Show Nostr Results'}
            </button>

            {nostrResult && nostrVisible && (
              <div className={`${styles.resultsContainer} ${styles.fadeIn}`}>
                <h3>Original Message</h3>
                <p>{nostrResult.originalMessage}</p>
                <h3>Decrypted Content</h3>
                <p>{nostrResult.decryptedContent}</p>
                <details>
                  <summary>Show Full Details</summary>
                  <SyntaxHighlighter language="json" style={docco} className={styles.detailsPre}>
                    {JSON.stringify(nostrResult, null, 2)}
                  </SyntaxHighlighter>
                </details>
              </div>
            )}
          </section>

          {/* Cashu Section */}
          <section className={styles.card}>
            <h2>2. P2PK-Locked Cashu Tokens</h2>
            <button 
              onClick={toggleCashu} 
              disabled={cashuLoading} 
              className={styles.button}
            >
              {cashuLoading
                ? 'Testing...'
                : cashuVisible
                ? 'Hide Cashu Results'
                : 'Show Cashu Results'}
            </button>

            {cashuResult && cashuVisible && (
              <div className={`${styles.resultsContainer} ${styles.fadeIn}`}>
                <h3>Token Validation</h3>
                <p>{cashuResult.message}</p>
                <details>
                  <summary>Show Full Details</summary>
                  <SyntaxHighlighter language="json" style={docco} className={styles.detailsPre}>
                    {JSON.stringify(cashuResult, null, 2)}
                  </SyntaxHighlighter>
                </details>
              </div>
            )}
          </section>

          {/* HODL Section */}
          <section className={styles.card}>
            <h2>3. HODL Invoice</h2>
            <button 
              onClick={toggleHodl} 
              disabled={hodlLoading} 
              className={styles.button}
            >
              {hodlLoading
                ? 'Testing...'
                : hodlVisible
                ? 'Hide HODL Results'
                : 'Show HODL Results'}
            </button>

            {hodlResult && hodlVisible && (
              <div className={`${styles.resultsContainer} ${styles.fadeIn}`}>
                <h3>Invoice Statuses</h3>
                <ul className={styles.statusList}>
                  <li>Original: {hodlResult.originalInvoice?.status}</li>
                  <li>After Payment: {hodlResult.heldInvoice?.status}</li>
                  <li>After Settlement: {hodlResult.settledInvoice?.status}</li>
                  <li>With Wrong Preimage: {hodlResult.failedSettlement?.status}</li>
                  <li>After Cancellation: {hodlResult.canceledInvoice?.status}</li>
                </ul>
                <details>
                  <summary>Show Full Details</summary>
                  <SyntaxHighlighter language="json" style={docco} className={styles.detailsPre}>
                    {JSON.stringify(hodlResult, null, 2)}
                  </SyntaxHighlighter>
                </details>
              </div>
            )}
          </section>
        </main>

        <footer className={styles.footer}>
          <p className={styles.footerText}>
            © 2025 Gautam Manchandani | Built for the Shopstr Competency Test[SOB&apos;25]
          </p>
          <div className={styles.footerLinks}>
            <a 
              href="https://github.com/GautamBytes/shopstr-competency-test" 
              target="_blank" 
              rel="noopener noreferrer" 
              className={styles.iconLink} 
              aria-label="GitHub Repository"
            >
              {/* GitHub SVG icon */}
              <svg role="img" viewBox="0 0 24 24" width="24" height="24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <title>GitHub Handle</title>
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 
                  3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 
                  0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61 
                  -.546-1.387-1.333-1.757-1.333-1.757-1.089-.744.084-.73.084-.73 
                  1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.807 1.305 
                  3.495.998.108-.776.417-1.305.76-1.605-2.665-.305-5.466-1.332-5.466-5.93 
                  0-1.31.47-2.38 1.236-3.22-.123-.303-.536-1.523.117-3.176 
                  0 0 1.008-.322 3.301 1.23a11.52 11.52 0 0 1 3.003-.404 
                  c1.02.005 2.047.138 3.003.404 2.291-1.552 3.297-1.23 3.297-1.23 
                  .653 1.653.24 2.873.117 3.176.77.84 1.236 1.91 1.236 3.22 
                  0 4.61-2.807 5.623-5.479 5.92.43.372.81 1.102.81 2.222 
                  0 1.606-.014 2.898-.014 3.293 0 .317.216.686.824.57 
                  C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
              </svg>
            </a>

            <a 
              href="https://gautam-portfolio-sigma.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className={styles.iconLink} 
              aria-label="Portfolio Website"
            >
              {/* Portfolio SVG icon */}
              <svg role="img" viewBox="0 0 24 24" width="30" height="30" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <title>Portfolio Website</title>
                <path d="M10.5 2h3a.5.5 0 0 1 .5.5V4h3.5A2.5 2.5 0 0 1 20 
                  6.5v10A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 
                  16.5v-10A2.5 2.5 0 0 1 6.5 4H10V2.5a.5.5 0 0 1 .5-.5zM11 
                  4v1h2V4h-2zm-4.5 3A1.5 1.5 0 0 0 5 8.5v1h14v-1A1.5 
                  1.5 0 0 0 17.5 7h-11z" />
              </svg>
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Home;
