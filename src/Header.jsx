import { useState } from 'react'

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="header">
      <button
        className="menu-toggle"
        type="button"
        aria-expanded={menuOpen}
        aria-controls="main-navigation"
        onClick={() => setMenuOpen((isOpen) => !isOpen)}
      >
        
        <span className="hamburger"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://w3.org">
  <path d="M3 6H21M3 12H21M3 18H21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
</svg></span>
      </button>
      <ul id="main-navigation" className={`nav-links ${menuOpen ? 'is-open' : ''}`}>
        <li><a href="/" onClick={() => setMenuOpen(false)}>Home</a></li>
        <li><a href="/about" onClick={() => setMenuOpen(false)}>About</a></li>
        <li><a href="/contact" onClick={() => setMenuOpen(false)}>Contact</a></li>
      </ul>
      <h1>josh olea</h1>
    </header>
  )
}

export default Header